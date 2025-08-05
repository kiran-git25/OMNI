import { Rar } from 'unrar.js';

export async function extractRar(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const rar = new Rar(arrayBuffer);
    const files = [];
    
    rar.getFiles().forEach(file => {
      files.push({
        name: file.name,
        size: file.size
      });
    });
    
    return files;
  } catch (error) {
    throw new Error(`RAR extraction failed: ${error.message}`);
  }
}
