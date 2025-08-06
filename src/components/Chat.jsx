import React from 'react';
import { useContext, useState } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './Chat.css';

export default function Chat() {
  const { messages, addMessage } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      addMessage({
        text: input,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
      </div>
      <MessageList messages={messages} />
      <ChatInput 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
      />
    </div>
  );
}
