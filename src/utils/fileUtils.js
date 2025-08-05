import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { saveFile, getFile } from './db';
import { encryptData, decryptData } from './crypto';
import { Unrar } from 'unrar.js';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

// ... (keep all existing functions until displayArchive)

export async function displayArchive(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    let filesList = [];
    
    if (file.name.toLowerCase().endsWith('.zip')) {
      const zip = await JSZip.loadAsync(arrayBuffer);
      filesList = Object.keys(zip.files)
        .filter(name => !zip.files[name].dir)
        .map(name => ({
          name,
          size: zip.files[name].uncompressedSize
        }));
    } 
    else if (file.name.toLowerCase().endsWith('.rar')) {
      const unrar = await Unrar.create(arrayBuffer);
      filesList = unrar.getFileList().map(file => ({
        name: file.name,
        size: file.size
      }));
    }
    else if (file.name.toLowerCase().endsWith('.7z')) {
      const { SevenZ } = await import('7z-wasm');
      const sevenZ = new SevenZ();
      await sevenZ.loadWasm();
      const contents = await sevenZ.list(arrayBuffer);
      filesList = contents.files.map(file => ({
        name: file.name,
        size: file.size
      }));
    }
    else {
      throw new Error('Unsupported archive format');
    }

    const ul = document.createElement('ul');
    filesList.forEach(file => {
      const li = document.createElement('li');
      li.textContent = `${file.name} (${file.size} bytes)`;
      ul.appendChild(li);
    });

    return ul;
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'archive-error';
    errorDiv.innerHTML = `
      <p>Error reading archive: ${error.message}</p>
      <p>Supported formats: ZIP, RAR, 7Z</p>
    `;
    return errorDiv;
  }
}

// ... (keep rest of the existing functions)
