import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import './Chat.css';

export default function Chat({ chatId, setChatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
    setMessages(savedMessages);
  }, [chatId]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  }, [messages, chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'You',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const shareYouTube = () => {
    const url = prompt('Enter YouTube URL:');
    if (!url) return;
    
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }
    
    const newMessage = {
      id: Date.now(),
      videoId,
      sender: 'You',
      timestamp: new Date().toISOString(),
      type: 'youtube'
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const shareFile = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          id: Date.now(),
          content: event.target.result,
          sender: 'You',
          timestamp: new Date().toISOString(),
          type
        };
        
        setMessages(prev => [...prev, newMessage]);
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  };

  const startCall = (isVideo) => {
    navigator.mediaDevices.getUserMedia({ 
      audio: true, 
      video: isVideo 
    }).then(stream => {
      setIsCallActive(true);
      // In a real app, you'd set up WebRTC here
    }).catch(err => {
      alert(`Error accessing ${isVideo ? 'camera' : 'microphone'}: ${err.message}`);
    });
  };

  const clearChat = () => {
    if (confirm('Clear all messages in this chat?')) {
      localStorage.removeItem(`chat_${chatId}`);
      setMessages([]);
    }
  };

  const createNewChat = () => {
    const newId = prompt('Enter new chat ID:');
    if (newId) setChatId(newId);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat: {chatId}</h3>
        <div className="chat-actions">
          <button onClick={createNewChat}>New Chat</button>
          <button onClick={clearChat}>Clear</button>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area">
        <div className="media-buttons">
          <button onClick={() => shareFile('image')}>🖼️</button>
          <button onClick={() => shareFile('video')}>🎬</button>
          <button onClick={shareYouTube}>▶️</button>
          <button onClick={() => startCall(false)}>🎙️</button>
          <button onClick={() => startCall(true)}>📹</button>
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      
      {isCallActive && (
        <div className="call-overlay">
          <div className="call-controls">
            <button onClick={() => setIsCallActive(false)}>End Call</button>
          </div>
        </div>
      )}
    </div>
  );
}
