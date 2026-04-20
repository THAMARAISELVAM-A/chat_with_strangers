import { useState, useCallback, useRef } from 'react';

const MOOODS = {
  FRIENDLY: {
    speed: 0.8, // Faster
    typoChance: 0.1,
    vocabulary: ['hey', 'lol', 'awesome', 'cool!', 'yay', ':)'],
    openers: ['hey! so glad we matched!', 'hi! how is your day going? :)', 'yo! what\'s up?'],
    responses: ['that sounds so cool!', 'oh wow, really?', 'haha i love that', 'tell me more!']
  },
  SKEPTICAL: {
    speed: 1.5, // Slower
    typoChance: 0.05,
    vocabulary: ['uh', 'ok', '?', 'maybe', 'why', 'who'],
    openers: ['who are you?', '...', 'hi.'],
    responses: ['why should I tell you?', 'i guess.', 'not sure if i believe that', 'k.']
  },
  MYSTERIOUS: {
    speed: 2.0, // Very slow
    typoChance: 0.02,
    vocabulary: ['void', 'signal', 'echo', 'shadow', 'pulse'],
    openers: ['do you hear the signal?', 'the void connects us.', '...waiting...'],
    responses: ['the data never lies.', 'everything is an echo.', 'silence speaks louder.', 'do you feel it?']
  },
  CHAOTIC: {
    speed: 0.5, // Ultra fast
    typoChance: 0.25, // Lots of typos
    vocabulary: ['OMG', 'WHAAAAA', '!!!!', 'AHAHA', 'omg no way'],
    openers: ['AHHHHH HI!!', 'OMGGGG WHO ARE U', 'LETS GOOOO'],
    responses: ['NO WAYYYYY', 'LMAOOOO STOP IT', 'WHAAAAT RLLY?', 'IKR!!!!']
  }
};

const TYPOS = {
  'there': 'their',
  'your': 'youre',
  'cool': 'tool',
  'hello': 'hrllo',
  'matching': 'mathing',
  'gaming': 'gamin',
  'believe': 'beleive'
};

export default function useStranger() {
  const [mood, setMood] = useState('FRIENDLY');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connectionStrength, setConnectionStrength] = useState(100);
  
  const historyRef = useRef([]);
  const moodRef = useRef('FRIENDLY');

  const initialize = useCallback((interests = []) => {
    const keys = Object.keys(MOOODS);
    const randomMood = keys[Math.floor(Math.random() * keys.length)];
    setMood(randomMood);
    moodRef.current = randomMood;
    setConnectionStrength(100);
    setMessages([]);
    historyRef.current = [];
    
    return { mood: randomMood, name: `Stranger_${Math.random().toString(36).substr(2, 4).toUpperCase()}` };
  }, []);

  const generateResponse = useCallback(async (userText) => {
    const currentMood = MOOODS[moodRef.current];
    setIsTyping(true);

    // Contextual interest logic
    // (In a real app, we'd check userText against interests)

    // Calculate latency based on mood and text length
    const baseDelay = (userText?.length || 10) * 15 * currentMood.speed;
    const jitter = Math.random() * 2000 + 1000;
    await new Promise(r => setTimeout(r, baseDelay + jitter));

    let responseText = '';
    if (historyRef.current.length === 0) {
      responseText = currentMood.openers[Math.floor(Math.random() * currentMood.openers.length)];
    } else {
      responseText = currentMood.responses[Math.floor(Math.random() * currentMood.responses.length)];
    }

    // Add simulated typo?
    let typoMessage = null;
    if (Math.random() < currentMood.typoChance) {
      const words = responseText.toLowerCase().split(' ');
      for (let i = 0; i < words.length; i++) {
        if (TYPOS[words[i]]) {
          const original = words[i];
          words[i] = TYPOS[words[i]];
          typoMessage = responseText.replace(original, words[i]);
          break;
        }
      }
    }

    setIsTyping(false);

    if (typoMessage) {
      // Send typo, then correction
      const tMsg = { id: Date.now(), sender: 'stranger', text: typoMessage, time: getTime() };
      addMessage(tMsg);
      
      await new Promise(r => setTimeout(r, 1200));
      const cMsg = { id: Date.now() + 1, sender: 'stranger', text: `*${responseText}`, time: getTime() };
      addMessage(cMsg);
    } else {
      const msg = { id: Date.now(), sender: 'stranger', text: responseText, time: getTime() };
      addMessage(msg);
    }

    // Update connection strength randomly
    setConnectionStrength(prev => Math.max(0, prev - Math.floor(Math.random() * 5)));
  }, []);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
    historyRef.current.push(msg);
  };

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return { mood, messages, isTyping, connectionStrength, initialize, generateResponse, setMessages };
}
