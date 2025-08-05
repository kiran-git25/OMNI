import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { extractRar } from './rarUtils';

// ... (keep all existing functions until displayArchive)

export async function displayArchive(file) {
  try {
    let files = [];

    if (file.name.toLowerCase().endsWith('.zip')) {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      files = Object.keys(zip.files)
        .filter(name => !zip.files[name].dir)
        .map(name => ({
          name,
          size: zip.files[name].uncompressedSize
        }));
    }
    else if (file.name.toLowerCase().endsWith('.rar')) {
      files = await extractRar(file);
    }
    else if (file.name.toLowerCase().endsWith('.7z')) {
      const { SevenZ } = await import('7z-wasm');
      const sevenZ = new SevenZ();
      await sevenZ.loadWasm();
      const contents = await sevenZ.list(await file.arrayBuffer());
      files = contents.files.map(f => ({
        name: f.name,
        size: f.size
      }));
    }
    else {
      throw new Error('Unsupported archive format');
    }

    return renderFileList(files, file.name.split('.').pop().toUpperCase());
  } catch (error) {
    return (
      <div className="archive-error">
        <p>Error reading archive: {error.message}</p>
        <p>Supported formats: ZIP, RAR, 7Z</p>
      </div>
    );
  }
}

// ... (keep the rest of your fileUtils.js)
