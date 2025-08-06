import { useContext, useState } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ErrorBoundary from './ErrorBoundary';
import './Chat.css';

function Chat() {
  const { messages, addMessage, clearChat } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      addMessage({
        text: input,
        sender: 'user'
      });
      setInput('');
    }
  };

  return (
    <ErrorBoundary>
      <div className="chat-container">
        <div className="chat-header">
          <h3>Chat</h3>
          <button onClick={clearChat} className="clear-button">
            Clear Chat
          </button>
        </div>
        
        <MessageList messages={messages} />
        
        <ChatInput 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={handleSend}
        />
      </div>
    </ErrorBoundary>
  );
}

export default Chat;
