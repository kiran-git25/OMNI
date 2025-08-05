import { useContext, useState, useEffect } from 'react';
import { FileContext } from '../../contexts/FileContext';
import FileRenderer from './FileRenderer';
import FileInfo from './FileInfo';
import ProgressBar from '../UI/ProgressBar';
import './FileViewer.css';

export default function FileViewer() {
  const { currentFile, loadingProgress } = useContext(FileContext);
  const [renderedContent, setRenderedContent] = useState(null);

  useEffect(() => {
    if (!currentFile) {
      setRenderedContent(null);
      return;
    }

    const renderFile = async () => {
      try {
        // Content will be rendered by FileRenderer component
        setRenderedContent(<FileRenderer file={currentFile} />);
      } catch (error) {
        setRenderedContent(
          <div className="error-message">
            Error displaying file: {error.message}
          </div>
        );
      }
    };

    renderFile();
  }, [currentFile]);

  return (
    <div className="file-viewer">
      {currentFile ? (
        <>
          <FileInfo file={currentFile} />
          {loadingProgress > 0 && loadingProgress < 100 && (
            <ProgressBar value={loadingProgress} />
          )}
          <div className="file-content">
            {renderedContent || <div>Loading file...</div>}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Drop a file or enter a URL to view content</p>
        </div>
      )}
    </div>
  );
}
