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
    const content = (text && text.trim()) || defaultText;
    if (!content) return [];

    // Support CJK text without spaces using native Intl.Segmenter if available
    const hasCJK = /[\u4e00-\u9fa5\u3040-\u30ff]/.test(content);
    if (hasCJK && typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
      const segments = Array.from(segmenter.segment(content));
      return segments
        .map(s => s.segment.trim())
        .filter(w => w.length > 0 && !/^[\s\p{P}]+$/u.test(w));
    }

    return content.split(/\s+/).filter(w => w.length > 0);
  },

  formatWord(word) {
    // Unicode-aware punctuation stripping to protect accents in Spanish, German, French, Chinese, etc.
    const cleanWord = word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
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
