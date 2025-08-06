import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ChatProvider } from './contexts/ChatContext';
import { FileProvider } from './contexts/FileContext';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FileProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </FileProvider>
    </BrowserRouter>
  </React.StrictMode>
);
