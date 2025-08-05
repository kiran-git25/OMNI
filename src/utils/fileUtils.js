import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { saveFile, getFile } from './db';
import { encryptData, decryptData } from './crypto';

// File processing
export async function processFile(file) {
  const encrypted = await encryptData(file);
  await saveFile(file.name, encrypted);
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    id: file.name + Date.now()
  };
}

// Archive handling
export async function displayArchive(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  if (file.name.toLowerCase().endsWith('.zip')) {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files = Object.keys(zip.files)
      .filter(name => !zip.files[name].dir)
      .map(name => ({
        name,
        size: zip.files[name].uncompressedSize
      }));
    return renderFileList(files, 'ZIP');
  } 
  else if (file.name.toLowerCase().endsWith('.rar')) {
    const { Unrar } = await import('unrar.js');
    const unrar = await Unrar.create(arrayBuffer);
    const files = unrar.getFileList().map(f => ({
      name: f.name,
      size: f.size
    }));
    return renderFileList(files, 'RAR');
  }
  else if (file.name.toLowerCase().endsWith('.7z')) {
    const { SevenZ } = await import('7z-wasm');
    const sevenZ = new SevenZ();
    await sevenZ.loadWasm();
    const contents = await sevenZ.list(arrayBuffer);
    const files = contents.files.map(f => ({
      name: f.name,
      size: f.size
    }));
    return renderFileList(files, '7Z');
  }
  throw new Error('Unsupported archive format');
}

function renderFileList(files, format) {
  return (
    <div className="archive-viewer">
      <h4>{format} Archive Contents</h4>
      <div className="archive-contents">
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatBytes(file.size)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ... (Include all other file display functions from previous examples)
