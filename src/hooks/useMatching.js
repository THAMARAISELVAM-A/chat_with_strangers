import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

/**
 * END-TO-END MESSAGE DIAGNOSTIC & FIX
 * Fixes: 1) Real-time delivery 2) Message persistence 3) Cross-user sync
 */
export default function useMatching(sessionId) {
  const [isSearching, setIsSearching] = useState(false);
  const [room, setRoom] = useState(null);
  const [partnerSession, setPartnerSession] = useState(null);
  const [partnerNick, setPartnerNick] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const roomChannelRef = useRef(null);
  const inactivityRef = useRef(null);

  const useSupabase = isSupabaseAvailable();

  // DIAGNOSTIC: Log all operations
  const log = (op, data, error = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${op}:`, error || 'OK', error ? error : data);
  };

  // Cleanup subscriptions
  const cleanup = useCallback(() => {
    if (roomChannelRef.current) {
      supabase?.removeChannel(roomChannelRef.current);
      roomChannelRef.current = null;
    }
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = null;
    }
  }, []);

  // FIX: Robust channel subscription with Broadcast and Postgres Changes
  const subscribeToRoom = useCallback(async (roomId, mySessionId) => {
    if (!useSupabase || !roomId) {
      log('subscribeToRoom', 'Skipping - no Supabase');
      return;
    }

    log('subscribeToRoom', { roomId, mySessionId });

    // 1. Initial Load of History
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setMessages(data.map(m => ({ ...m, status: 'delivered' })));
      }
    } catch (e) {
      log('Initial load error', e);
    }

    // 2. Create Single Room Channel
    try {
      if (roomChannelRef.current) {
        supabase.removeChannel(roomChannelRef.current);
      }

      const channel = supabase.channel(`room:${roomId}`, {
        config: {
          broadcast: { self: false } // We handle self-delivery manually for speed
        }
      });

      // --- BROADCAST HANDLERS ---
      
      // Handle Incoming Messages (Vastly faster than Postgres changes)
      channel.on('broadcast', { event: 'message' }, (payload) => {
        const newMsg = payload.payload;
        log('Broadcast message received', newMsg.id);
        
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, { ...newMsg, status: 'delivered' }];
        });

        // Send Ack back
        channel.send({
          type: 'broadcast',
          event: 'ack',
          payload: { msgId: newMsg.id, senderId: mySessionId }
        });
      });

      // Handle Acknowledge (Confirmation ticket)
      channel.on('broadcast', { event: 'ack' }, (payload) => {
        const { msgId } = payload.payload;
        log('Ack received for', msgId);
        setMessages(prev => prev.map(m => 
          m.id === msgId ? { ...m, status: 'delivered' } : m
        ));
      });

      // Handle Typing
      channel.on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.session_id !== mySessionId) {
          setIsPartnerTyping(payload.payload.is_typing);
        }
      });

      // --- POSTGRES CHANGES (Backup/Sync) ---
      channel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const newMsg = payload.new;
        log('Postgres message received', newMsg.id);
        
        setMessages(prev => {
          const existing = prev.find(m => m.id === newMsg.id);
          if (existing) {
            // Upgrade status if it was just 'sent'
            return prev.map(m => m.id === newMsg.id ? { ...newMsg, status: 'delivered' } : m);
          }
          return [...prev, { ...newMsg, status: 'delivered' }];
        });
      });

      channel.subscribe((status) => {
        log('Room channel status', status);
      });

      roomChannelRef.current = channel;
    } catch (e) {
      log('Subscription error', e);
    }
  }, [useSupabase]);

  // Start matching
  const startMatching = useCallback(async (nickname) => {
    setIsSearching(true);
    setError(null);
    setMessages([]);

    if (!useSupabase) {
      // Demo mode
      setTimeout(() => {
        setIsSearching(false);
        setRoom({ id: 'demo-room' });
        setPartnerSession('demo-partner');
        setPartnerNick(['Alex', 'Sam', 'Jordan', 'Taylor'][Math.floor(Math.random() * 4)]);
        setMessages([{ id: '1', content: '👋 Hi there!', created_at: new Date().toISOString(), status: 'delivered' }]);
      }, 1500);
      return;
    }

    try {
      log('startMatching', { nickname, sessionId });

      await supabase.from('sessions').upsert({
        id: sessionId,
        nickname: nickname
      }, { onConflict: 'id' });

      const { data: waitingRooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'waiting');

      const availableRoom = waitingRooms?.find(r => r.user_a !== sessionId);

      if (availableRoom) {
        await supabase.from('rooms').update({ 
          status: 'active', 
          user_b: sessionId 
        }).eq('id', availableRoom.id);

        const partnerId = availableRoom.user_a;
        setRoom({ id: availableRoom.id, user_a: partnerId, user_b: sessionId });
        setPartnerSession(partnerId);

        const { data: sess } = await supabase.from('sessions').select('nickname').eq('id', partnerId).single();
        setPartnerNick(sess?.nickname || 'Stranger');
        setIsSearching(false);

        subscribeToRoom(availableRoom.id, sessionId);
        return;
      }

      const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await supabase.from('rooms').insert({
        id: roomId,
        user_a: sessionId,
        status: 'waiting'
      });

      let matched = false;
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 1500));
        
        const { data: roomData } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomData?.status === 'active' && roomData?.user_b) {
          setRoom(roomData);
          setPartnerSession(roomData.user_b);
          const { data: sess } = await supabase.from('sessions').select('nickname').eq('id', roomData.user_b).single();
          setPartnerNick(sess?.nickname || 'Stranger');
          matched = true;
          setIsSearching(false);
          subscribeToRoom(roomId, sessionId);
          break;
        }
        if (!isSearching) break;
      }

      if (!matched && isSearching) {
        setIsSearching(false);
        setRoom({ id: 'demo-room' });
        setPartnerSession('demo-partner');
        setPartnerNick('Stranger');
        setMessages([{ id: '1', content: '👋 Hi! (demo mode)', created_at: new Date().toISOString(), status: 'delivered' }]);
      }

    } catch (err) {
      log('Matching error', err);
      setIsSearching(false);
    }
  }, [sessionId, useSupabase, subscribeToRoom, isSearching]);

  // Cancel matching
  const cancelMatching = useCallback(async () => {
    setIsSearching(false);
    cleanup();
    if (useSupabase && sessionId) {
      await supabase.from('rooms').delete().eq('user_a', sessionId).eq('status', 'waiting');
    }
  }, [sessionId, useSupabase, cleanup]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (room && useSupabase && !room.id.startsWith('demo')) {
      await supabase.from('rooms').update({ status: 'ended' }).eq('id', room.id);
    }
    cleanup();
    setRoom(null);
    setPartnerSession(null);
    setPartnerNick(null);
    setMessages([]);
    setIsPartnerTyping(false);
  }, [room, useSupabase, cleanup]);

  // FIX: Send message with Broadcast + Persistence
  const sendMessage = useCallback(async (content) => {
    if (!room || !content.trim()) return;

    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const msg = {
      id: msgId,
      room_id: room.id,
      sender_session_id: sessionId,
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    log('sendMessage', msg);

    // 1. Add locally as 'sent'
    setMessages(prev => [...prev, { ...msg, status: 'sent' }]);

    // 2. Broadcast immediately for instant delivery
    if (roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'message',
        payload: msg
      });
    }

    // 3. Save to Supabase for persistence
    if (useSupabase && !room.id.startsWith('demo')) {
      try {
        const { error } = await supabase.from('messages').insert([msg]);
        if (error) log('Save error', error);
      } catch (e) {
        log('Save error', e);
      }
    }

    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => leaveRoom(), INACTIVITY_TIMEOUT);
  }, [room, sessionId, useSupabase, leaveRoom]);

  // Typing indicator using combined channel
  const markTyping = useCallback((isTyping) => {
    if (!useSupabase || !room || room.id.startsWith('demo')) return;
    if (roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { session_id: sessionId, is_typing: isTyping }
      });
    }
  }, [room, sessionId, useSupabase]);

  // Report
  const reportPartner = useCallback(async (reason) => {
    if (useSupabase && room && partnerSession) {
      await supabase.from('reports').insert({
        reporter_session: sessionId,
        reported_session: partnerSession,
        room_id: room.id,
        reason
      });
    }
    leaveRoom();
  }, [room, sessionId, partnerSession, useSupabase, leaveRoom]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return {
    isSearching,
    room,
    partnerSession,
    partnerNick,
    messages,
    error,
    startMatching,
    cancelMatching,
    leaveRoom,
    sendMessage,
    markTyping,
    isPartnerTyping,
    reportPartner
  };
}
