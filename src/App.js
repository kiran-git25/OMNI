import React from 'react';
import FileViewer from './components/FileViewer';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <FileViewer />
        <Chat />
      </div>
    </div>
  );
}

export default App;
