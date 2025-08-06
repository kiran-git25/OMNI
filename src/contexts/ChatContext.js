import { createContext, useState, useEffect } from 'react';

export const ChatContext = createContext({
  messages: [],
  addMessage: () => {},
  clearChat: () => {},
  currentChat: { name: 'Default Chat' }
});

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearChat,
      currentChat: { name: 'Default Chat' }
    }}>
      {children}
    </ChatContext.Provider>
  );
};
