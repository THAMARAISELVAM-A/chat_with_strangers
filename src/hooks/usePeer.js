import { useState, useEffect, useCallback, useRef } from 'react';
import Peer from 'peerjs';

export default function usePeer() {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  
  const peerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Generate a unique ID for this user
    const id = `twy-${Math.random().toString(36).substr(2, 9)}`;
    const newPeer = new Peer(id, {
      debug: 1,
      secure: true
    });

    newPeer.on('open', (id) => {
      setPeerId(id);
      console.log('Peer connected with ID:', id);
    });

    newPeer.on('error', (err) => {
      console.warn('PeerJS Error:', err.type);
      // If we can't connect to signaling, we can still fall back to simulation
    });

    newPeer.on('connection', (conn) => {
      console.log('Received connection from:', conn.peer);
      setConnection(conn);
      setupConnection(conn);
    });

    newPeer.on('call', (call) => {
      console.log('Received call from:', call.peer);
      // Answer the call with local stream if available
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          call.answer(stream);
          call.on('stream', (rStream) => {
            setRemoteStream(rStream);
          });
        });
    });

    peerRef.current = newPeer;
    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const setupConnection = (conn) => {
    conn.on('data', (data) => {
      if (typeof data === 'string') {
        const msg = JSON.parse(data);
        setMessages((prev) => [...prev, { ...msg, sender: 'stranger' }]);
      }
    });

    conn.on('close', () => {
      setConnection(null);
      setRemoteStream(null);
    });
  };

  const findMatch = useCallback(async () => {
    setIsSearching(true);
    setIsSimulated(false);
    console.log('Finding match...');
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // Fallback to simulation after 10 seconds
    searchTimeoutRef.current = setTimeout(() => {
      console.log('No peer found. Falling back to AI Simulation.');
      setIsSearching(false);
      setIsSimulated(true);
      
      // Setup a "Mock" Stranger
      setMessages([{
        id: Date.now(),
        text: "System: Secure link established (Simulated Mode)",
        sender: "system"
      }]);

      // Mock first message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "hey! nice to meet u :)",
          sender: "stranger",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);

    }, 8000); // 8 seconds for snappier demo
  }, []);

  const sendMessage = (text) => {
    if (isSimulated) {
      const msg = { 
        id: Date.now(), 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages((prev) => [...prev, { ...msg, sender: 'user' }]);
      
      // Mock Response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "lol for real? same tbh",
          sender: "stranger",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
      return;
    }

    if (connection && connection.open) {
      const msg = { 
        id: Date.now(), 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      connection.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, { ...msg, sender: 'user' }]);
    }
  };

  return { 
    peerId, 
    remoteStream, 
    localStream, 
    messages, 
    sendMessage, 
    findMatch, 
    isSearching,
    isSimulated,
    connection 
  };
}
