import { useContext, useEffect, useState } from 'react';
import { FileContext } from '../../contexts/FileContext';
import { displayArchive, displayPDF } from '../../utils/fileUtils';
import './FileViewer.css';

export default function FileViewer() {
  const { currentFile } = useContext(FileContext);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const renderFile = async () => {
      if (!currentFile) {
        setContent(null);
        return;
      }

      setIsLoading(true);
      try {
        const extension = currentFile.name.split('.').pop().toLowerCase();
        let rendered;
        
        if (['zip', 'rar', '7z'].includes(extension)) {
          rendered = await displayArchive(currentFile);
        } 
        else if (extension === 'pdf') {
          rendered = await displayPDF(currentFile);
        }
        // Add other file type handlers here
        
        setContent(rendered);
      } catch (error) {
        console.error('File rendering error:', error);
        setContent(
          <div className="error">
            Failed to render file: {error.message}
          </div>
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    renderFile();
  }, [currentFile]);

  return (
    <div className="file-viewer">
      {currentFile ? (
        <>
          <div className="file-info">
            <h3>{currentFile.name}</h3>
            <p>{formatBytes(currentFile.size)} • {currentFile.type}</p>
          </div>
          <div className="file-content">
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              content || <p>No content to display</p>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Drop files or enter URLs to view content</p>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
