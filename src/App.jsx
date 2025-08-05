import { useState, useEffect } from 'react';
import { FileProvider } from './contexts/FileContext';
import { ChatProvider } from './contexts/ChatContext';
import FileViewer from './components/FileViewer/FileViewer';
import ChatSystem from './components/ChatSystem/Chat';
import NavBar from './components/UI/NavBar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('viewer');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <FileProvider>
      <ChatProvider>
        <div className="app-container">
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {!isOnline && (
            <div className="offline-banner">
              You are currently offline. Some features may be limited.
            </div>
          )}

          <main>
            {activeTab === 'viewer' ? <FileViewer /> : <ChatSystem />}
          </main>
        </div>
      </ChatProvider>
    </FileProvider>
  );
}

export default App;
