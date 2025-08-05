import { useEffect, useState } from 'react';
import { 
  displayPDF, 
  displayWord, 
  displayExcel, 
  displayText, 
  displayCode, 
  displayImage, 
  displayAudio, 
  displayVideo, 
  displayArchive 
} from '../../utils/fileUtils';
import './FileViewer.css';

export default function FileViewer({ file }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!file) return;

    const renderFile = async () => {
      try {
        let renderedContent;
        const extension = file.name.split('.').pop().toLowerCase();

        switch (extension) {
          case 'pdf':
            renderedContent = await displayPDF(file);
            break;
          case 'docx':
          case 'doc':
            renderedContent = await displayWord(file);
            break;
          case 'xlsx':
          case 'xls':
          case 'csv':
            renderedContent = await displayExcel(file);
            break;
          case 'txt':
          case 'md':
          case 'json':
          case 'xml':
          case 'yaml':
          case 'yml':
            renderedContent = await displayText(file);
            break;
          case 'js':
          case 'jsx':
          case 'html':
          case 'css':
          case 'py':
          case 'java':
            renderedContent = await displayCode(file);
            break;
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'gif':
          case 'svg':
          case 'webp':
          case 'bmp':
          case 'ico':
            renderedContent = await displayImage(file);
            break;
          case 'mp3':
          case 'wav':
          case 'ogg':
          case 'aac':
          case 'flac':
          case 'm4a':
            renderedContent = await displayAudio(file);
            break;
          case 'mp4':
          case 'webm':
          case 'avi':
          case 'mov':
          case 'mkv':
          case 'flv':
            renderedContent = await displayVideo(file);
            break;
          case 'zip':
          case 'rar':
          case '7z':
            renderedContent = await displayArchive(file);
            break;
          default:
            renderedContent = <div>Unsupported file type</div>;
        }

        setContent(renderedContent);
      } catch (error) {
        setContent(<div>Error displaying file: {error.message}</div>);
      }
    };

    renderFile();
  }, [file]);

  return (
    <div className="file-viewer">
      {file ? (
        <>
          <div className="file-info">
            <h3>{file.name}</h3>
            <p>{file.size} bytes • {file.type}</p>
          </div>
          <div className="file-content">
            {content || <div>Loading file...</div>}
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
