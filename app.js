document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const wpmSlider = document.getElementById('wpmSlider');
  const wpmValue = document.getElementById('wpmValue');
  const progressBar = document.getElementById('progressBar');
  const muteBtn = document.getElementById('muteBtn');
  const volSlider = document.getElementById('volSlider');
  const readerCard = document.getElementById('readerCard');
  const pauseHud = document.getElementById('pauseHud');
  const jumpBackBtn = document.getElementById('jumpBackBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const hudWordPos = document.getElementById('hudWordPos');
  const hudWordTotal = document.getElementById('hudWordTotal');
  const hudWpm = document.getElementById('hudWpm');
  const hudProgress = document.getElementById('hudProgress');
  const countdownHud = document.getElementById('countdownHud');
  const countdownText = document.getElementById('countdownText');
  const ringProgress = document.getElementById('ringProgress');
  
  const wordStartEl = document.getElementById('wordStart');
  const focalPointEl = document.getElementById('focalPoint');
  const wordEndEl = document.getElementById('wordEnd');

  let words = [];
  let currentIndex = 0;
  let isPlaying = false;
  let timerId = null;

  const defaultText = "Welcome to TACHYON. Paste your text below to begin high-velocity reading. Focus your eyes on the crimson dot. Let the words flow. Read faster than thought.";
  
  let audioCtx = null;
  let isAudioUnlocked = false;
  let isMuted = false;
  let masterVolume = parseFloat(volSlider.value);

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isAudioUnlocked = true;
  }

  // Unlock audio on first interaction
  document.body.addEventListener('touchstart', initAudio, { once: true, passive: true });
  document.body.addEventListener('click', initAudio, { once: true });

  function playTick() {
    if (!audioCtx || !isAudioUnlocked || isMuted || masterVolume === 0) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle'; // acoustic click/tick tone
    const wpm = parseInt(wpmSlider.value, 10);
    const freq = 850 + ((wpm - 350) * 0.15); // Speed-pitch compensation
    osc.frequency.setValueAtTime(Math.max(200, freq), t);

    // Exponential gain drop (duration 20ms)
    gainNode.gain.setValueAtTime(masterVolume, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  }

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
      playTick();
      
      currentIndex++;
      updateProgress();
      
      const wpm = parseInt(wpmSlider.value, 10);
      let delay = (60 / wpm) * 1000;
      
      // Dynamic pacing
      if (currentWord.endsWith('.') || currentWord.endsWith('!') || currentWord.endsWith('?')) {
        delay *= 1.6; 
      } else if (currentWord.endsWith(',') || currentWord.endsWith(';') || currentWord.endsWith(':') || currentWord.endsWith('—')) {
        delay *= 1.3;
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
    saveState();
  }

  // Full-Screen Tap-to-Pause
  readerCard.addEventListener('click', (e) => {
    if (e.target.closest('.hud-controls')) return;
    if (isPlaying) {
      stop();
      showPauseHud();
    }
  });

  function showPauseHud() {
    hudWordPos.textContent = currentIndex;
    hudWordTotal.textContent = words.length;
    hudWpm.textContent = wpmSlider.value;
    hudProgress.textContent = words.length ? Math.floor((currentIndex / words.length) * 100) : 0;
    pauseHud.classList.remove('hidden');
  }

  jumpBackBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = Math.max(0, currentIndex - 5);
    hudWordPos.textContent = currentIndex;
    hudProgress.textContent = words.length ? Math.floor((currentIndex / words.length) * 100) : 0;
    displayWord(words[currentIndex]);
    updateProgress();
    saveState();
  });

  resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseHud.classList.add('hidden');
    startCountdown();
  });

  let countdownTimerId = null;
  function startCountdown() {
    countdownHud.classList.remove('hidden');
    let count = 3;
    ringProgress.style.transition = 'none';
    ringProgress.style.strokeDashoffset = 0;
    
    // Force reflow for css transition
    void ringProgress.offsetWidth;
    ringProgress.style.transition = 'stroke-dashoffset 1s linear';

    function tickCountdown() {
      if (count > 0) {
        countdownText.textContent = count;
        ringProgress.style.strokeDashoffset = 283 - ((3 - count + 1) / 3) * 283;
        
        // Play beep
        if (audioCtx && isAudioUnlocked && !isMuted && masterVolume > 0) {
          const t = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, t);
          gainNode.gain.setValueAtTime(masterVolume, t);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.1);
        }
        
        count--;
        countdownTimerId = setTimeout(tickCountdown, 1000);
      } else {
        countdownText.textContent = "FOCUS";
        ringProgress.style.strokeDashoffset = 283;
        
        // High pitch beep
        if (audioCtx && isAudioUnlocked && !isMuted && masterVolume > 0) {
          const t = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, t);
          gainNode.gain.setValueAtTime(masterVolume, t);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.2);
        }
        
        countdownTimerId = setTimeout(() => {
          countdownHud.classList.add('hidden');
          play();
        }, 800);
      }
    }
    tickCountdown();
  }

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      stop();
    } else {
      if (currentIndex > 0 && currentIndex < words.length) {
        startCountdown();
      } else {
        play();
      }
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
    saveState();
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted', isMuted);
    if (!isAudioUnlocked) initAudio();
  });

  volSlider.addEventListener('input', (e) => {
    masterVolume = parseFloat(e.target.value);
    if (masterVolume > 0 && isMuted) {
      isMuted = false;
      muteBtn.textContent = '🔊';
      muteBtn.classList.remove('muted');
    }
    if (masterVolume === 0 && !isMuted) {
      isMuted = true;
      muteBtn.textContent = '🔇';
      muteBtn.classList.add('muted');
    }
    if (!isAudioUnlocked) initAudio();
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
    saveState();
  });

  // Local Storage State Persistence
  function saveState() {
    const state = {
      text: textInput.value,
      currentIndex: currentIndex,
      wpm: wpmSlider.value,
      masterVolume: masterVolume,
      isMuted: isMuted
    };
    localStorage.setItem('tachyonState', JSON.stringify(state));
  }

  function loadState() {
    const saved = localStorage.getItem('tachyonState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.text) textInput.value = state.text;
        if (state.wpm) {
          wpmSlider.value = state.wpm;
          wpmValue.textContent = state.wpm;
        }
        if (state.masterVolume !== undefined) {
          masterVolume = state.masterVolume;
          volSlider.value = masterVolume;
        }
        if (state.isMuted !== undefined) {
          isMuted = state.isMuted;
          muteBtn.textContent = isMuted ? '🔇' : '🔊';
          muteBtn.classList.toggle('muted', isMuted);
        }
        words = getWords();
        if (state.currentIndex !== undefined && state.currentIndex < words.length) {
          currentIndex = state.currentIndex;
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }

  // Init
  loadState();
  if (!words || words.length === 0) words = getWords();
  if (words.length > 0) displayWord(words[currentIndex || 0]);
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
