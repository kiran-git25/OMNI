import { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import CallInterface from './CallInterface';
import './Chat.css';

export default function Chat() {
  const {
    currentChat,
    messages,
    sendMessage,
    startCall,
    endCall,
    callStatus,
    peerConnection
  } = useContext(ChatContext);
  
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{currentChat.name}</h3>
        <div className="chat-actions">
          <button onClick={() => startCall('video')} disabled={callStatus !== 'inactive'}>
            📹 Video Call
          </button>
          <button onClick={() => startCall('audio')} disabled={callStatus !== 'inactive'}>
            🎙️ Voice Call
          </button>
        </div>
      </div>
      
      <MessageList messages={messages} />
      
      <ChatInput 
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onSendFile={(type) => {/* File send logic */}}
        onSendYouTube={() => {/* YouTube share logic */}}
      />
      
      {callStatus !== 'inactive' && (
        <CallInterface 
          status={callStatus}
          onEndCall={endCall}
          peerConnection={peerConnection}
        />
      )}
    </div>
  );
}
