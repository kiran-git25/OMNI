import { UnRAR } from '@samuelthomas2774/unrar.js';

export async function extractRar(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const unrar = await UnRAR.create(arrayBuffer);
    const files = [];
    
    for (const entry of unrar.entries) {
      if (!entry.isDirectory) {
        files.push({
          name: entry.name,
          size: entry.size
        });
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`RAR extraction failed: ${error.message}`);
  }
}
