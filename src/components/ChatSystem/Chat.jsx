import { useContext, useState } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import CallInterface from './CallInterface';
import './Chat.css';

export default function Chat() {
  const {
    messages = [],
    addMessage,
    clearChat
  } = useContext(ChatContext);
  
  const [input, setInput] = useState('');
  const [callStatus, setCallStatus] = useState('inactive');

  const handleSend = () => {
    if (input.trim()) {
      addMessage({
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
      setInput('');
    }
  };

  const startCall = (type) => {
    setCallStatus(type === 'video' ? 'video-call' : 'audio-call');
    addMessage({
      id: Date.now(),
      text: `Started ${type} call`,
      sender: 'system',
      timestamp: new Date().toISOString()
    });
  };

  const endCall = () => {
    setCallStatus('inactive');
    addMessage({
      id: Date.now(),
      text: 'Call ended',
      sender: 'system',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <div className="chat-actions">
          <button 
            onClick={() => startCall('video')} 
            disabled={callStatus !== 'inactive'}
            className="call-button"
          >
            📹 Video Call
          </button>
          <button 
            onClick={() => startCall('audio')} 
            disabled={callStatus !== 'inactive'}
            className="call-button"
          >
            🎙️ Voice Call
          </button>
          <button 
            onClick={clearChat}
            className="clear-button"
          >
            Clear Chat
          </button>
        </div>
      </div>
      
      <MessageList messages={messages} />
      
      <ChatInput 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
      />
      
      {callStatus !== 'inactive' && (
        <CallInterface 
          status={callStatus}
          onEndCall={endCall}
        />
      )}
    </div>
  );
}
