import * as JSZip from 'jszip';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// PDF Viewer
export async function displayPDF(file) {
  const pdfjs = await import('pdfjs-dist/build/pdf');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  const page = await pdf.getPage(1);
  
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  return canvas;
}

// Word Document Viewer
export async function displayWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const pre = document.createElement('pre');
  pre.textContent = result.value;
  return pre;
}

// Excel Viewer
export async function displayExcel(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const html = XLSX.utils.sheet_to_html(worksheet);
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

// Text Viewer
export async function displayText(file) {
  const text = await file.text();
  const pre = document.createElement('pre');
  pre.textContent = text;
  return pre;
}

// Code Viewer
export async function displayCode(file) {
  const text = await file.text();
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = text;
  pre.appendChild(code);
  
  // Dynamically import highlight.js for syntax highlighting
  const hljs = await import('highlight.js');
  hljs.highlightElement(code);
  
  return pre;
}

// Image Viewer
export async function displayImage(file) {
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  img.alt = file.name;
  img.style.maxWidth = '100%';
  return img;
}

// Audio Player
export async function displayAudio(file) {
  const url = URL.createObjectURL(file);
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  return audio;
}

// Video Player
export async function displayVideo(file) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.style.maxWidth = '100%';
  return video;
}

// Archive Viewer
export async function displayArchive(file) {
  if (!file.name.toLowerCase().endsWith('.zip')) {
    return document.createTextNode('Only ZIP archives are fully supported in browser');
  }

  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const ul = document.createElement('ul');
  
  Object.keys(zip.files).forEach(filename => {
    if (!zip.files[filename].dir) {
      const li = document.createElement('li');
      li.textContent = `${filename} (${zip.files[filename].uncompressedSize} bytes)`;
      ul.appendChild(li);
    }
  });

  return ul;
}

// URL Loaders
export async function loadFromUrl(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return displayYouTubeVideo(url);
  }
  
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const blob = await response.blob();
  return new File([blob], new URL(url).pathname.split('/').pop() || 'downloaded', { 
    type: response.headers.get('content-type') 
  });
}

function displayYouTubeVideo(url) {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  if (!videoId) throw new Error('Invalid YouTube URL');
  
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.allowFullscreen = true;
  iframe.style.width = '100%';
  iframe.style.height = '500px';
  iframe.style.border = 'none';
  return iframe;
}
