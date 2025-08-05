import { useState, useEffect, useRef } from 'react';
import { useFileContext } from '../../contexts/FileContext';
import FileInfo from './FileInfo';
import ProgressBar from '../UI/ProgressBar';
import './FileViewer.css';

export default function FileViewer() {
  const { currentFile, loadingProgress } = useFileContext();
  const [renderedContent, setRenderedContent] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clean up worker when component unmounts
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (!currentFile) {
      setRenderedContent(null);
      return;
    }

    const renderFile = async () => {
      try {
        const extension = currentFile.name.split('.').pop().toLowerCase();
        
        if (extension === 'rar') {
          setRenderedContent(await renderRarFile(currentFile));
        } else {
          // Existing file rendering logic for other types
          setRenderedContent(await renderOtherFile(currentFile, extension));
        }
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

  async function renderRarFile(file) {
    const { default: Unrar, wrap } = await import('unrar.js');
    const { default: Comlink } = await import('comlink');

    // Create worker
    workerRef.current = new Worker(new URL('../../utils/rar.worker.js', import.meta.url));
    const workerApi = Comlink.wrap(workerRef.current);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { success, files, error } = await workerApi.extract(arrayBuffer);

      if (!success) {
        throw new Error(error);
      }

      return (
        <div className="archive-viewer">
          <h4>RAR Archive Contents:</h4>
          <div className="archive-contents">
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    } catch (error) {
      throw new Error(`Failed to read RAR file: ${error.message}`);
    }
  }

  async function renderOtherFile(file, extension) {
    // Your existing file rendering logic for non-RAR files
    // ...
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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
