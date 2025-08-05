import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { saveFile, getFile } from './db';
import { encryptData, decryptData } from './crypto';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export async function processFile(file) {
  try {
    // Encrypt and store file in IndexedDB
    const encrypted = await encryptData(file);
    await saveFile(file.name, encrypted);
    
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      id: file.name + Date.now()
    };
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
}

export async function getFileContent(fileId) {
  try {
    const encrypted = await getFile(fileId);
    return await decryptData(encrypted);
  } catch (error) {
    console.error('File retrieval error:', error);
    throw error;
  }
}

// ... (keep all the existing display functions but update them to use chunked processing)
