import { useContext, useEffect, useState } from 'react';
import { FileContext } from '../contexts/FileContext';
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
          const files = await extractArchive(currentFile);
          setContent(
            <div className="archive-contents">
              <h4>Archive Contents</h4>
              <ul>
                {files.map((file, i) => (
                  <li key={i}>{file.name} ({formatBytes(file.size)})</li>
                ))}
              </ul>
            </div>
          );
        } else {
          setContent(<div>Preview not available for {extension} files</div>);
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

async function extractArchive(file) {
  const buffer = await file.arrayBuffer();
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(buffer);
  
  const files = [];
  
  loadedZip.forEach((relativePath, fileEntry) => {
    if (!fileEntry.dir) {
      files.push({
        name: relativePath,
        size: fileEntry._data.uncompressedSize
      });
    }
  });
  
  return files;
}
