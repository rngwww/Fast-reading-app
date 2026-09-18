import { PreloadedLibrary } from './data.js';

export const Storage = {
  save(state) {
    localStorage.setItem('tachyonState', JSON.stringify(state));
  },
  load() {
    const defaultState = {
      text: "",
      currentIndex: 0,
      wpm: 350,
      masterVolume: 0.3,
      isMuted: false,
      isPro: false,
      freeTimeRemaining: 600, // 10 minutes (in seconds)
      quotaDate: new Date().toDateString(),
      library: [...PreloadedLibrary],
      soundProfile: 'woodblock',
      colorPalette: 'crimson',
      activeDocId: null
    };

    try {
      const saved = localStorage.getItem('tachyonState');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Reset quota if it's a new day
        const today = new Date().toDateString();
        if (parsed.quotaDate !== today) {
          parsed.freeTimeRemaining = 600;
          parsed.quotaDate = today;
        }

        // Merge defaults
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    
    return defaultState;
  }
};
