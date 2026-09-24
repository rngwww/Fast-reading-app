// Storage abstraction for TACHYON
// Supports IndexedDB with automatic fallback to localStorage / in-memory cache

const memoryFallback = {
  settings: {
    wpm: 350,
    masterVolume: 0.3,
    isMuted: false,
    isPro: false,
    soundProfile: 'organic_pop',
    colorPalette: 'red',
    activeDocId: null,
    rsvpFont: 'sans',
    uiSoundsEnabled: true,
    appTheme: 'obsidian'
  },
  booksMeta: {},
  booksChunks: {}
};

// Try to load any previously saved settings from localStorage as early fallback
try {
  const localSettings = localStorage.getItem('tachyon_settings');
  if (localSettings) {
    Object.assign(memoryFallback.settings, JSON.parse(localSettings));
  }
} catch (e) {
  // localStorage might be unavailable in some sandboxed environments
}

export const Storage = {
  db: null,
  
  async initDB() {
    return new Promise((resolve) => {
      if (this.db) return resolve(true);
      if (typeof indexedDB === 'undefined') {
        console.warn('IndexedDB not supported in this environment, using memory/localStorage fallback.');
        return resolve(false);
      }
      
      try {
        const request = indexedDB.open('TachyonDB', 1);
        
        request.onerror = (e) => {
          console.warn('IndexedDB open error, continuing with memory fallback:', e);
          resolve(false);
        };
        
        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(true);
        };
        
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('books_meta')) {
            db.createObjectStore('books_meta', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('books_chunks')) {
            const chunkStore = db.createObjectStore('books_chunks', { keyPath: 'id' });
            chunkStore.createIndex('bookId', 'bookId', { unique: false });
          }
        };

        request.onblocked = () => {
          console.warn('IndexedDB upgrade blocked by another connection');
          resolve(false);
        };
      } catch (err) {
        console.warn('IndexedDB initialization failed with exception:', err);
        resolve(false);
      }
    });
  },

  async loadSettings() {
    const defaultSettings = { ...memoryFallback.settings };

    if (!this.db) {
      try {
        const saved = localStorage.getItem('tachyon_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
      } catch (e) {
        return defaultSettings;
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('settings', 'readonly');
        const req = tx.objectStore('settings').get('app_settings');
        
        req.onsuccess = () => {
          resolve(req.result ? { ...defaultSettings, ...req.result } : defaultSettings);
        };
        
        req.onerror = () => resolve(defaultSettings);
      } catch (err) {
        console.warn('Error reading settings from IndexedDB:', err);
        resolve(defaultSettings);
      }
    });
  },

  async saveSettings(settings) {
    try {
      localStorage.setItem('tachyon_settings', JSON.stringify(settings));
    } catch (e) {}
    Object.assign(memoryFallback.settings, settings);

    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ id: 'app_settings', ...settings });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        console.warn('Error saving settings to IndexedDB:', err);
        resolve();
      }
    });
  },

  async getLibraryMeta() {
    if (!this.db) {
      const items = Object.values(memoryFallback.booksMeta);
      items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      return items;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('books_meta', 'readonly');
        const req = tx.objectStore('books_meta').getAll();
        req.onsuccess = () => {
          let items = req.result || [];
          items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(items);
        };
        req.onerror = () => resolve([]);
      } catch (err) {
        console.warn('Error fetching library from IndexedDB:', err);
        resolve([]);
      }
    });
  },

  async getBookMeta(id) {
    if (!this.db) {
      return memoryFallback.booksMeta[id] || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('books_meta', 'readonly');
        const req = tx.objectStore('books_meta').get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        console.warn('Error fetching book meta from IndexedDB:', err);
        resolve(null);
      }
    });
  },

  async saveBook(id, title, author, wordsArray, color) {
    const totalWords = wordsArray.length;
    const timestamp = Date.now();
    const existing = memoryFallback.booksMeta[id];
    let currentIndex = existing ? existing.currentIndex : 0;
    if (currentIndex >= totalWords) currentIndex = 0;

    const metaObj = {
      id,
      title: title || 'Untitled',
      author: author || 'Unknown',
      totalWords,
      color: color || 'red',
      dateAdded: existing ? existing.dateAdded : timestamp,
      currentIndex,
      timestamp
    };
    memoryFallback.booksMeta[id] = metaObj;

    const chunkSize = 1000;
    for (let i = 0; i < totalWords; i += chunkSize) {
      const chunkIdx = Math.floor(i / chunkSize);
      memoryFallback.booksChunks[`${id}_${chunkIdx}`] = wordsArray.slice(i, i + chunkSize);
    }

    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(['books_meta', 'books_chunks'], 'readwrite');
        const metaStore = tx.objectStore('books_meta');
        const chunkStore = tx.objectStore('books_chunks');
        
        const getReq = metaStore.get(id);
        getReq.onsuccess = () => {
          const dbExisting = getReq.result;
          let dbCurrentIndex = dbExisting ? dbExisting.currentIndex : currentIndex;
          if (dbCurrentIndex >= totalWords) dbCurrentIndex = 0;

          metaStore.put({
            id,
            title: title || 'Untitled',
            author: author || 'Unknown',
            totalWords,
            color: color || 'red',
            dateAdded: dbExisting ? dbExisting.dateAdded : timestamp,
            currentIndex: dbCurrentIndex,
            timestamp
          });

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
        tx.onerror = (e) => {
          console.warn('Error saving book to IndexedDB:', e);
          resolve();
        };
      } catch (err) {
        console.warn('Error initiating book save transaction:', err);
        resolve();
      }
    });
  },

  async updateBookProgress(id, currentIndex) {
    if (memoryFallback.booksMeta[id]) {
      memoryFallback.booksMeta[id].currentIndex = currentIndex;
      memoryFallback.booksMeta[id].timestamp = Date.now();
    }

    if (!this.db) return;

    return new Promise((resolve) => {
      try {
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
        req.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  },

  async getBookChunk(bookId, chunkIndex) {
    if (!this.db) {
      return memoryFallback.booksChunks[`${bookId}_${chunkIndex}`] || [];
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('books_chunks', 'readonly');
        const req = tx.objectStore('books_chunks').get(`${bookId}_${chunkIndex}`);
        req.onsuccess = () => {
          const result = req.result ? req.result.words : (memoryFallback.booksChunks[`${bookId}_${chunkIndex}`] || []);
          resolve(result);
        };
        req.onerror = () => resolve(memoryFallback.booksChunks[`${bookId}_${chunkIndex}`] || []);
      } catch (err) {
        resolve(memoryFallback.booksChunks[`${bookId}_${chunkIndex}`] || []);
      }
    });
  },
  
  async deleteBook(id) {
    delete memoryFallback.booksMeta[id];
    Object.keys(memoryFallback.booksChunks).forEach(k => {
      if (k.startsWith(`${id}_`)) delete memoryFallback.booksChunks[k];
    });

    if (!this.db) return;

    return new Promise((resolve) => {
      try {
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
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }
};
