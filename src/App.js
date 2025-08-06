import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <div className="app-container">
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;
