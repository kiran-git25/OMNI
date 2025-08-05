import { createContext, useState } from 'react';

export const ChatContext = createContext({
  currentChat: null,
  messages: [],
  sendMessage: () => {},
  startCall: () => {},
  endCall: () => {},
  callStatus: 'inactive',
  peerConnection: null
});

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState({ name: 'Default Chat' });
  const [messages, setMessages] = useState([]);
  const [callStatus, setCallStatus] = useState('inactive');
  const [peerConnection, setPeerConnection] = useState(null);

  const sendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startCall = (type) => {
    setCallStatus(type === 'video' ? 'video-call' : 'audio-call');
    // In a real app, you would initialize WebRTC connection here
    setPeerConnection({}); // Placeholder for actual peer connection
  };

  const endCall = () => {
    setCallStatus('inactive');
    setPeerConnection(null);
  };

  return (
    <ChatContext.Provider value={{
      currentChat,
      messages,
      sendMessage,
      startCall,
      endCall,
      callStatus,
      peerConnection
    }}>
      {children}
    </ChatContext.Provider>
  );
};
