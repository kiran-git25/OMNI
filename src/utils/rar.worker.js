import { Unrar } from 'unrar.js';

// Initialize Comlink exposure
const api = {
  async extract(arrayBuffer) {
    try {
      const unrar = await Unrar.create(arrayBuffer);
      const files = unrar.getFileList().map(file => ({
        name: file.name,
        size: file.size
      }));
      return { success: true, files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Comlink exposure
self.addEventListener('message', (e) => {
  if (e.data === 'init') {
    expose(api);
  }
});

// For non-Comlink usage
self.addEventListener('message', async (event) => {
  if (event.data.arrayBuffer) {
    try {
      const unrar = await Unrar.create(event.data.arrayBuffer);
      const files = unrar.getFileList();
      self.postMessage({ success: true, files });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  }
});
