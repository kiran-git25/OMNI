import { Unrar } from 'unrar.js';

self.addEventListener('message', async (event) => {
  try {
    const { arrayBuffer } = event.data;
    const unrar = await Unrar.create(arrayBuffer);
    const files = unrar.getFileList();
    self.postMessage({ success: true, files });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});
