import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';

export async function extractRar(file) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    
    return Object.entries(zip.files)
      .filter(([_, entry]) => !entry.dir)
      .map(([name, entry]) => ({
        name,
        size: entry._data.uncompressedSize,
        isDirectory: false
      }));
  } catch (error) {
    console.error('RAR extraction error:', error);
    throw new Error(`Failed to read RAR archive: ${error.message}`);
  }
}
