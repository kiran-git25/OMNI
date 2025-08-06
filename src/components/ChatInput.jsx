import React from 'react';
import './ChatInput.css';

export default function ChatInput({ value, onChange, onSend }) {
  return (
    <div className="chat-input-container">
      <div className="chat-input">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
}
