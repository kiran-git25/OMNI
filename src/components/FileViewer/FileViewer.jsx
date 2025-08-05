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
        setContent(
          ['zip', 'rar', '7z'].includes(extension)
            ? await displayArchive(currentFile)
            : extension === 'pdf'
              ? await displayPDF(currentFile)
              : <div>Unsupported file type</div>
        );
      } catch (error) {
        setContent(<div className="error">Failed to render file</div>);
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
            <p>{formatBytes(currentFile.size)}</p>
          </div>
          <div className="file-content">
            {isLoading ? 'Loading...' : content}
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
