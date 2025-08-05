import React, { useState } from 'react';
import { extractRar, extractFileFromRar } from '../utils/rarUtils';

function RarViewer() {
  const [archiveFiles, setArchiveFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const files = await extractRar(file);
      setArchiveFiles(files);
      setError(null);
    } catch (err) {
      setError(err.message);
      setArchiveFiles([]);
    }
  };

  const handleFileExtract = async (fileName) => {
    try {
      const fileInput = document.getElementById('rar-upload');
      const result = await extractFileFromRar(fileInput.files[0], fileName);
      console.log('Extracted file:', result);
      // Handle the extracted file (display, download, etc.)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rar-viewer">
      <input
        id="rar-upload"
        type="file"
        accept=".rar"
        onChange={handleFileUpload}
      />
      
      {error && <div className="error">{error}</div>}
      
      {archiveFiles.length > 0 && (
        <div className="file-list">
          <h3>Files in Archive:</h3>
          <ul>
            {archiveFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({Math.round(file.size / 1024)} KB)
                <button onClick={() => handleFileExtract(file.name)}>
                  Extract
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RarViewer;
