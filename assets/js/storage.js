export const Storage = {
  db: null,
  
  async initDB() {
    return new Promise((resolve, reject) => {
      if (this.db) return resolve();
      
      const request = indexedDB.open('TachyonDB', 1);
      
      request.onerror = (e) => reject(e.target.error);
      
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // App Settings
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        
        // Lightweight metadata for library list
        if (!db.objectStoreNames.contains('books_meta')) {
          db.createObjectStore('books_meta', { keyPath: 'id' });
        }
        
        // Chunked text contents
        if (!db.objectStoreNames.contains('books_chunks')) {
          const chunkStore = db.createObjectStore('books_chunks', { keyPath: 'id' });
          chunkStore.createIndex('bookId', 'bookId', { unique: false });
        }
      };
    });
  },

  async loadSettings() {
    return new Promise((resolve) => {
      const tx = this.db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get('app_settings');
      
      req.onsuccess = () => {
        const defaultSettings = {
          wpm: 350,
          masterVolume: 0.3,
          isMuted: false,
          isPro: false,
          soundProfile: 'organic_pop',
          colorPalette: 'red',
          activeDocId: null
        };
        resolve(req.result ? { ...defaultSettings, ...req.result } : defaultSettings);
      };
      
      req.onerror = () => resolve({
          wpm: 350, masterVolume: 0.3, isMuted: false, isPro: false,
          soundProfile: 'organic_pop', colorPalette: 'red', activeDocId: null
      });
    });
  },

  async saveSettings(settings) {
    return new Promise((resolve) => {
      const tx = this.db.transaction('settings', 'readwrite');
      tx.objectStore('settings').put({ id: 'app_settings', ...settings });
      tx.oncomplete = () => resolve();
    });
  },

  async getLibraryMeta() {
    return new Promise((resolve) => {
      const tx = this.db.transaction('books_meta', 'readonly');
      const req = tx.objectStore('books_meta').getAll();
      req.onsuccess = () => {
        // Sort by last read (timestamp) descending
        let items = req.result || [];
        items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        resolve(items);
      };
    });
  },

  async getBookMeta(id) {
    return new Promise((resolve) => {
      const tx = this.db.transaction('books_meta', 'readonly');
      const req = tx.objectStore('books_meta').get(id);
      req.onsuccess = () => resolve(req.result);
    });
  },

  async saveBook(id, title, author, wordsArray, color) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['books_meta', 'books_chunks'], 'readwrite');
      const metaStore = tx.objectStore('books_meta');
      const chunkStore = tx.objectStore('books_chunks');
      
      const totalWords = wordsArray.length;
      const timestamp = Date.now();
      
      // We read the existing meta to preserve currentIndex if it's an update
      const getReq = metaStore.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result;
        let currentIndex = existing ? existing.currentIndex : 0;
        if (currentIndex >= totalWords) currentIndex = 0;

        metaStore.put({
          id,
          title: title || 'Untitled',
          author: author || 'Unknown',
          totalWords,
          color: color || 'red',
          dateAdded: existing ? existing.dateAdded : timestamp,
          currentIndex,
          timestamp
        });

        // Delete old chunks to avoid orphans (we can do a simple index cursor but for simplicity just overwrite matching indices)
        // Since we overwrite id `${id}_${chunkIndex}`, any chunks beyond new totalWords might be left behind.
        // Let's delete them by iterating over the bookId index, but that requires a cursor. 
        // For performance, we'll just overwrite. The chunk logic uses totalWords to know when to stop anyway.
        
        const chunkSize = 1000;
        for (let i = 0; i < totalWords; i += chunkSize) {
          chunkStore.put({
            id: `${id}_${Math.floor(i / chunkSize)}`,
            bookId: id,
            chunkIndex: Math.floor(i / chunkSize),
            words: wordsArray.slice(i, i + chunkSize)
          });
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async updateBookProgress(id, currentIndex) {
    return new Promise((resolve) => {
      const tx = this.db.transaction('books_meta', 'readwrite');
      const store = tx.objectStore('books_meta');
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          req.result.currentIndex = currentIndex;
          req.result.timestamp = Date.now();
          store.put(req.result);
        }
        resolve();
      };
    });
  },

  async getBookChunk(bookId, chunkIndex) {
    return new Promise((resolve) => {
      const tx = this.db.transaction('books_chunks', 'readonly');
      const req = tx.objectStore('books_chunks').get(`${bookId}_${chunkIndex}`);
      req.onsuccess = () => resolve(req.result ? req.result.words : []);
    });
  },
  
  async deleteBook(id) {
    return new Promise((resolve) => {
      const tx = this.db.transaction(['books_meta', 'books_chunks'], 'readwrite');
      tx.objectStore('books_meta').delete(id);
      
      const index = tx.objectStore('books_chunks').index('bookId');
      const req = index.openKeyCursor(IDBKeyRange.only(id));
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          tx.objectStore('books_chunks').delete(cursor.primaryKey);
          cursor.continue();
        }
      };
      
      tx.oncomplete = () => resolve();
    });
  }
};
