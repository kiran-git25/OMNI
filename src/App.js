import React from 'react';
import Chat from './components/Chat';
import FileViewer from './components/FileViewer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <div className="file-viewer-container">
          <FileViewer />
        </div>
        <div className="chat-container">
          <Chat />
        </div>
      </main>
    </div>
  );
}

export default App;
