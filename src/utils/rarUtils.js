import JSZip from 'jszip';

export async function extractRar(file) {
  try {
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(buffer);
    
    const files = [];
    
    loadedZip.forEach((relativePath, fileEntry) => {
      if (!fileEntry.dir) {
        files.push({
          name: relativePath,
          size: fileEntry._data.uncompressedSize,
          isDirectory: false
        });
      }
    });
    
    return files;
  } catch (error) {
    console.error('RAR extraction error:', error);
    throw new Error('Failed to process RAR file');
  }
}
