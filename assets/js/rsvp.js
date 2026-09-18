export const RSVP = {
  getOptimalRecognitionPoint(word) {
    const len = word.length;
    if (len === 1) return 0;
    if (len >= 2 && len <= 5) return 1;
    if (len >= 6 && len <= 9) return 2;
    if (len >= 10 && len <= 13) return 3;
    return 4;
  },

  calculateDelay(word, wpm) {
    let delay = (60 / wpm) * 1000;
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
      delay *= 1.6;
    } else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':') || word.endsWith('—')) {
      delay *= 1.3;
    } else if (word.length > 8) {
      delay *= 1.2;
    }
    return delay;
  },

  parseText(text, defaultText) {
    const content = text.trim() || defaultText;
    return content.split(/\s+/).filter(w => w.length > 0);
  },

  formatWord(word) {
    const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, '');
    const searchWord = cleanWord.length > 0 ? cleanWord : word;
    let orpIndex = this.getOptimalRecognitionPoint(searchWord);
    
    let originalOrpIndex = word.indexOf(searchWord) + orpIndex;
    if(originalOrpIndex < 0 || originalOrpIndex >= word.length) {
       originalOrpIndex = Math.floor(word.length / 2);
    }

    return {
      start: word.substring(0, originalOrpIndex),
      focal: word.charAt(originalOrpIndex),
      end: word.substring(originalOrpIndex + 1)
    };
  }
};
