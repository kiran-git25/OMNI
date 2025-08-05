import { useContext, useEffect, useState } from 'react';
import { FileContext } from '../../contexts/FileContext';
import './FileViewer.css';

export default function FileViewer() {
  const { currentFile } = useContext(FileContext);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const renderFile = async () => {
      if (!currentFile) return setContent(null);
      
      try {
        const extension = currentFile.name.split('.').pop().toLowerCase();
        let rendered;
        
        if (['zip', 'rar', '7z'].includes(extension)) {
          rendered = await displayArchive(currentFile);
        } 
        else if (extension === 'pdf') {
          rendered = await displayPDF(currentFile);
        }
        // ... (other file type conditions)
        
        setContent(rendered);
      } catch (error) {
        setContent(<div className="error">{error.message}</div>);
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
          <div className="file-content">{content || 'Loading...'}</div>
        </>
      ) : (
        <div className="empty-state">
          <p>Drop files or enter URLs to view content</p>
        </div>
      )}
    </div>
  );
}
