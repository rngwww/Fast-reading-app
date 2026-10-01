// TACHYON File Importer
// Native client-side parsing for .txt and .epub files with zero server dependency

import { RSVP } from './rsvp.js?v=28';

export const FileImporter = {
  async importFile(file) {
    if (!file) throw new Error("No file provided");

    const fileName = file.name || "Untitled";
    const extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();

    if (extension === 'txt') {
      return await this.parseTxt(file);
    } else if (extension === 'epub') {
      return await this.parseEpub(file);
    } else {
      // Try treating as plain text
      return await this.parseTxt(file);
    }
  },

  async parseTxt(file) {
    const rawText = await file.text();
    const title = file.name.replace(/\.[^/.]+$/, "") || "Document";
    const words = RSVP.parseText(rawText, '');
    
    if (words.length === 0) {
      throw new Error("The selected text file is empty.");
    }

    return {
      title,
      author: "Text File",
      words,
      rawContent: rawText.slice(0, 5000) // snippet for preview
    };
  },

  async ensureJSZip() {
    if (window.JSZip) return window.JSZip;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/js/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = () => reject(new Error("Failed to load ePub extraction engine (JSZip)."));
      document.head.appendChild(script);
    });
  },

  async parseEpub(file) {
    const JSZip = await this.ensureJSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Locate container.xml to find the OPF file path
    const containerEntry = zip.file("META-INF/container.xml");
    if (!containerEntry) {
      throw new Error("Invalid ePub: Missing META-INF/container.xml");
    }

    const containerXml = await containerEntry.async("text");
    const parser = new DOMParser();
    const containerDoc = parser.parseFromString(containerXml, "application/xml");
    const rootfile = containerDoc.querySelector("rootfile");
    const opfPath = rootfile ? rootfile.getAttribute("full-path") : "content.opf";

    // 2. Read OPF package document
    const opfEntry = zip.file(opfPath);
    if (!opfEntry) {
      throw new Error(`Invalid ePub: Missing package document at ${opfPath}`);
    }

    const opfDir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
    const opfXml = await opfEntry.async("text");
    const opfDoc = parser.parseFromString(opfXml, "application/xml");

    // Extract Metadata
    const titleElem = opfDoc.querySelector("title, dc\\:title");
    const authorElem = opfDoc.querySelector("creator, dc\\:creator");
    const title = titleElem ? titleElem.textContent.trim() : file.name.replace(/\.[^/.]+$/, "");
    const author = authorElem ? authorElem.textContent.trim() : "Unknown Author";

    // Extract Manifest (id -> href)
    const manifestItems = {};
    opfDoc.querySelectorAll("manifest > item").forEach(item => {
      const id = item.getAttribute("id");
      const href = item.getAttribute("href");
      if (id && href) manifestItems[id] = href;
    });

    // Extract Spine order
    const spineOrder = [];
    opfDoc.querySelectorAll("spine > itemref").forEach(itemref => {
      const idref = itemref.getAttribute("idref");
      if (idref && manifestItems[idref]) {
        spineOrder.push(manifestItems[idref]);
      }
    });

    // If spine is empty, fallback to searching all html/xhtml files in the zip
    let chapterFiles = spineOrder;
    if (chapterFiles.length === 0) {
      chapterFiles = Object.keys(zip.files).filter(p => /\.(html|xhtml|htm)$/i.test(p));
    }

    // 3. Extract text content across all chapters in order
    let extractedText = "";

    for (const relPath of chapterFiles) {
      // Decode URI components in case hrefs have %20 etc.
      const cleanRelPath = decodeURIComponent(relPath);
      const fullPath = cleanRelPath.startsWith(opfDir) ? cleanRelPath : opfDir + cleanRelPath;
      
      const fileEntry = zip.file(fullPath) || zip.file(cleanRelPath);
      if (!fileEntry) continue;

      const htmlContent = await fileEntry.async("text");
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Remove script/style tags
      doc.querySelectorAll("script, style, noscript").forEach(el => el.remove());

      const bodyText = doc.body ? (doc.body.innerText || doc.body.textContent || "") : "";
      if (bodyText.trim()) {
        extractedText += " " + bodyText.trim();
      }
    }

    const words = RSVP.parseText(extractedText, '');
    if (words.length === 0) {
      throw new Error("Could not extract readable words from this ePub.");
    }

    return {
      title,
      author,
      words,
      rawContent: extractedText.slice(0, 5000)
    };
  }
};
