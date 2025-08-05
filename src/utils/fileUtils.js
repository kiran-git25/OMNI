import JSZip from 'jszip';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { extractRar } from './rarUtils';

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '');
}

export async function displayArchive(file) {
  try {
    let files = [];
    const extension = file.name.split('.').pop().toLowerCase();

    switch (extension) {
      case 'zip':
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        files = Object.entries(zip.files)
          .filter(([_, entry]) => !entry.dir)
          .map(([name, entry]) => ({
            name,
            size: entry._data.uncompressedSize,
            isDirectory: false
          }));
        break;

      case 'rar':
        files = await extractRar(file);
        break;

      case '7z':
        const { SevenZ } = await import('7z-wasm');
        const sevenZ = new SevenZ();
        await sevenZ.loadWasm();
        const contents = await sevenZ.list(await file.arrayBuffer());
        files = contents.files.map(f => ({
          name: f.name,
          size: f.size,
          isDirectory: f.isDirectory
        }));
        break;

      default:
        throw new Error('Unsupported archive format');
    }

    return (
      <div className="archive-viewer">
        <h4>{extension.toUpperCase()} Archive Contents</h4>
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className={file.isDirectory ? 'directory' : ''}>
              {file.name} ({formatBytes(file.size)})
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Archive processing error:', error);
    return (
      <div className="archive-error">
        <p>Error reading archive: {error.message}</p>
        <p>Supported formats: ZIP, RAR, 7Z</p>
      </div>
    );
  }
}

// Keep your existing PDF and other file handlers below
export async function displayPDF(file) {
  // Your existing PDF rendering logic
  // ...
}
