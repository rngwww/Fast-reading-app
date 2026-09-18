document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const wpmSlider = document.getElementById('wpmSlider');
  const wpmValue = document.getElementById('wpmValue');
  const progressBar = document.getElementById('progressBar');
  
  const wordStartEl = document.getElementById('wordStart');
  const focalPointEl = document.getElementById('focalPoint');
  const wordEndEl = document.getElementById('wordEnd');

  let words = [];
  let currentIndex = 0;
  let isPlaying = false;
  let timerId = null;

  const defaultText = "Welcome to TACHYON. Paste your text below to begin high-velocity reading. Focus your eyes on the crimson dot. Let the words flow. Read faster than thought.";
  
  function getWords() {
    const text = textInput.value.trim() || defaultText;
    return text.split(/\s+/).filter(w => w.length > 0);
  }

  function getOptimalReocenterPosition(word) {
    const len = word.length;
    if (len === 1) return 0;
    if (len >= 2 && len <= 5) return 1;
    if (len >= 6 && len <= 9) return 2;
    if (len >= 10 && len <= 13) return 3;
    return 4;
  }

  function displayWord(word) {
    if (!word) {
      wordStartEl.textContent = '';
      focalPointEl.textContent = '';
      wordEndEl.textContent = '';
      return;
    }
    
    // Strip some punctuation for ORP calculation, but display full word
    const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, '');
    const searchWord = cleanWord.length > 0 ? cleanWord : word;
    
    let orpIndex = getOptimalReocenterPosition(searchWord);
    
    // Adjust ORP index back to the original word including punctuation
    let originalOrpIndex = word.indexOf(searchWord) + orpIndex;
    if(originalOrpIndex < 0 || originalOrpIndex >= word.length) {
       originalOrpIndex = Math.floor(word.length / 2); // fallback
    }

    const start = word.substring(0, originalOrpIndex);
    const focal = word.charAt(originalOrpIndex);
    const end = word.substring(originalOrpIndex + 1);

    wordStartEl.textContent = start;
    focalPointEl.textContent = focal;
    wordEndEl.textContent = end;
  }

  function updateProgress() {
    if (words.length === 0) {
      progressBar.style.width = '0%';
      return;
    }
    // Progress calculation
    const progress = (currentIndex / words.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function tick() {
    if (currentIndex < words.length) {
      const currentWord = words[currentIndex];
      displayWord(currentWord);
      
      currentIndex++;
      updateProgress();
      
      const wpm = parseInt(wpmSlider.value, 10);
      let delay = (60 / wpm) * 1000;
      
      // Dynamic pacing
      if (currentWord.endsWith('.') || currentWord.endsWith('!') || currentWord.endsWith('?')) {
        delay *= 2; 
      } else if (currentWord.endsWith(',') || currentWord.endsWith(';') || currentWord.endsWith(':')) {
        delay *= 1.5;
      } else if (currentWord.length > 8) {
        delay *= 1.2;
      }

      timerId = setTimeout(tick, delay);
    } else {
      stop();
      currentIndex = 0; 
      updateProgress();
      displayWord(words[0]); // Reset to first word
    }
  }

  function play() {
    if (words.length === 0 || currentIndex >= words.length) {
      words = getWords();
      currentIndex = 0;
    }
    if (words.length === 0) return;
    
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
    playPauseBtn.classList.remove('primary');
    playPauseBtn.classList.add('secondary');
    
    tick();
  }

  function stop() {
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    playPauseBtn.classList.add('primary');
    playPauseBtn.classList.remove('secondary');
    clearTimeout(timerId);
  }

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  });

  resetBtn.addEventListener('click', () => {
    stop();
    currentIndex = 0;
    words = getWords();
    updateProgress();
    if(words.length > 0) {
      displayWord(words[0]);
    } else {
      displayWord('');
    }
  });

  wpmSlider.addEventListener('input', (e) => {
    wpmValue.textContent = e.target.value;
  });

  textInput.addEventListener('input', () => {
    if (isPlaying) stop();
    currentIndex = 0;
    words = getWords();
    updateProgress();
    if(words.length > 0) {
      displayWord(words[0]);
    } else {
      displayWord('');
    }
  });

  // Init
  words = getWords();
  if(words.length > 0) displayWord(words[0]);
  updateProgress();
  
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});
