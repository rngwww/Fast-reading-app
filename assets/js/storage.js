export const Storage = {
  save(state) {
    localStorage.setItem('tachyonState', JSON.stringify(state));
  },
  load() {
    try {
      const saved = localStorage.getItem('tachyonState');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved state', e);
      return null;
    }
  }
};
