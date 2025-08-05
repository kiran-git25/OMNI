import { useContext, useEffect, useState } from 'react';
import { FileContext } from '../../contexts/FileContext';
import { displayArchive } from '../../utils/fileUtils';
import './FileViewer.css';

export default function FileViewer() {
  const { currentFile } = useContext(FileContext);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const processFile = async () => {
      if (!currentFile) {
        setContent(null);
        return;
      }

      setIsLoading(true);
      try {
        const extension = currentFile.name.split('.').pop().toLowerCase();
        
        if (['zip', 'rar', '7z'].includes(extension)) {
          const archiveContent = await displayArchive(currentFile);
          setContent(archiveContent);
        } else {
          setContent(<div>Unsupported file type: {extension}</div>);
        }
      } catch (error) {
        setContent(<div className="error">Error displaying file</div>);
      } finally {
        setIsLoading(false);
      }
    };

    processFile();
  }, [currentFile]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  return (
    <div className="file-viewer">
      {currentFile ? (
        <>
          <div className="file-info">
            <h3>{currentFile.name}</h3>
            <p>{formatBytes(currentFile.size)}</p>
          </div>
          <div className="file-content">
            {isLoading ? (
              <div className="loading-spinner">Loading file...</div>
            ) : (
              content || <div>No content to display</div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Select a file to view its contents</p>
        </div>
      )}
    </div>
  );
}
