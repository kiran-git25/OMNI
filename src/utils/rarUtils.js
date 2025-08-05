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
          size: entry._data.uncompressedSize
        });
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`RAR extraction failed: ${error.message}`);
  }
}

export async function extractFirstSmallFile(file, maxSize = 10_000_000) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    
    // Find first file < maxSize
    const [fileName, fileEntry] = Object.entries(zip.files)
      .find(([name, entry]) => !entry.dir && entry._data.uncompressedSize < maxSize) || [];
    
    if (!fileName) throw new Error('No suitable file found');
    
    // Extract file content
    const content = await fileEntry.async('uint8array');
    
    // Detect MIME type
    const type = await fileTypeFromBuffer(content) || 
                 { mime: 'application/octet-stream' };
    
    return {
      name: fileName,
      content: new Blob([content], { type: type.mime })
    };
  } catch (error) {
    throw new Error(`RAR extraction failed: ${error.message}`);
  }
}
