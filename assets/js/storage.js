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
      library: [],
      soundProfile: 'organic_pop',
      colorPalette: 'purple',
      activeDocId: null
    };

    try {
      const saved = localStorage.getItem('tachyonState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    
    return defaultState;
  }
};
