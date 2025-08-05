import { useState } from 'react';
import FileViewer from './components/FileViewer/FileViewer';
import ChatSystem from './components/ChatSystem/Chat';
import DropZone from './components/UI/DropZone';
import UrlInput from './components/UI/UrlInput';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('viewer');
  const [file, setFile] = useState(null);
  const [chatId, setChatId] = useState('');

  return (
    <div className="app-container">
      <header>
        <h1>OmniPlay</h1>
        <nav>
          <button 
            onClick={() => setActiveTab('viewer')} 
            className={activeTab === 'viewer' ? 'active' : ''}
          >
            File Viewer
          </button>
          <button 
            onClick={() => setActiveTab('chat')} 
            className={activeTab === 'chat' ? 'active' : ''}
          >
            Chat
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'viewer' ? (
          <>
            <div className="input-section">
              <DropZone onFileLoad={setFile} />
              <UrlInput onUrlLoad={setFile} />
            </div>
            <FileViewer file={file} />
          </>
        ) : (
          <ChatSystem chatId={chatId} setChatId={setChatId} />
        )}
      </main>
    </div>
  );
}

export default App;
