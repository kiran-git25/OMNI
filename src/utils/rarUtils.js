import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';

export async function extractRar(file) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    
    const files = [];
    
    for (const [name, entry] of Object.entries(zip.files)) {
      if (!entry.dir) {
        files.push({
          name,
          size: entry._data.uncompressedSize,
          isDirectory: false
        });
      }
    }
    
    return files;
  } catch (error) {
    console.error('RAR extraction error:', error);
    throw new Error(`Failed to read RAR archive: ${error.message}`);
  }
}

export async function extractFileFromRar(file, targetFileName) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    
    const fileEntry = zip.files[targetFileName];
    if (!fileEntry || fileEntry.dir) {
      throw new Error('File not found in archive');
    }

    const content = await fileEntry.async('uint8array');
    const type = await fileTypeFromBuffer(content) || { mime: 'application/octet-stream' };
    
    return {
      name: targetFileName,
      content: new Blob([content], { type: type.mime }),
      size: fileEntry._data.uncompressedSize
    };
  } catch (error) {
    console.error('File extraction error:', error);
    throw new Error(`Failed to extract file: ${error.message}`);
  }
}
