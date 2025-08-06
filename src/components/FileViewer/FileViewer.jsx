import { useContext, useState, useEffect } from 'react';
import { FileContext } from '../contexts/FileContext';
import ErrorBoundary from './ErrorBoundary';
import './FileViewer.css';

function FileViewer() {
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
        // File processing logic would go here
        setContent(<div>File preview would render here</div>);
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
    <ErrorBoundary>
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
            <p>Select a file to view</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default FileViewer;
