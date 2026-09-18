import { Storage } from './storage.js';
import { AudioSystem } from './audio.js';
import { RSVP } from './rsvp.js';

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
  
  function initAudioOnTouch() {
    AudioSystem.init();
  }
  document.body.addEventListener('touchstart', initAudioOnTouch, { once: true, passive: true });
  document.body.addEventListener('click', initAudioOnTouch, { once: true });

  function displayWord(word) {
    if (!word) {
      wordStartEl.textContent = '';
      focalPointEl.textContent = '';
      wordEndEl.textContent = '';
      return;
    }
    const formatted = RSVP.formatWord(word);
    wordStartEl.textContent = formatted.start;
    focalPointEl.textContent = formatted.focal;
    wordEndEl.textContent = formatted.end;
  }

  function updateProgress() {
    if (words.length === 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (currentIndex / words.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function tick() {
    if (currentIndex < words.length) {
      const currentWord = words[currentIndex];
      displayWord(currentWord);
      const wpm = parseInt(wpmSlider.value, 10);
      AudioSystem.playTick(wpm);
      
      currentIndex++;
      updateProgress();
      
      const delay = RSVP.calculateDelay(currentWord, wpm);
      timerId = setTimeout(tick, delay);
    } else {
      stop();
      currentIndex = 0; 
      updateProgress();
      displayWord(words[0]); 
    }
  }

  function play() {
    if (words.length === 0 || currentIndex >= words.length) {
      words = RSVP.parseText(textInput.value, defaultText);
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

  // HUD Logic
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
    
    void ringProgress.offsetWidth;
    ringProgress.style.transition = 'stroke-dashoffset 1s linear';

    function tickCountdown() {
      if (count > 0) {
        countdownText.textContent = count;
        ringProgress.style.strokeDashoffset = 283 - ((3 - count + 1) / 3) * 283;
        AudioSystem.playCountdownBeep(false);
        count--;
        countdownTimerId = setTimeout(tickCountdown, 1000);
      } else {
        countdownText.textContent = "FOCUS";
        ringProgress.style.strokeDashoffset = 283;
        AudioSystem.playCountdownBeep(true);
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
    words = RSVP.parseText(textInput.value, defaultText);
    updateProgress();
    if(words.length > 0) displayWord(words[0]);
    saveState();
  });

  muteBtn.addEventListener('click', () => {
    AudioSystem.isMuted = !AudioSystem.isMuted;
    muteBtn.textContent = AudioSystem.isMuted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted', AudioSystem.isMuted);
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    saveState();
  });

  volSlider.addEventListener('input', (e) => {
    AudioSystem.volume = parseFloat(e.target.value);
    if (AudioSystem.volume > 0 && AudioSystem.isMuted) {
      AudioSystem.isMuted = false;
      muteBtn.textContent = '🔊';
      muteBtn.classList.remove('muted');
    }
    if (AudioSystem.volume === 0 && !AudioSystem.isMuted) {
      AudioSystem.isMuted = true;
      muteBtn.textContent = '🔇';
      muteBtn.classList.add('muted');
    }
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    saveState();
  });

  wpmSlider.addEventListener('input', (e) => {
    wpmValue.textContent = e.target.value;
    saveState();
  });

  textInput.addEventListener('input', () => {
    if (isPlaying) stop();
    currentIndex = 0;
    words = RSVP.parseText(textInput.value, defaultText);
    updateProgress();
    if(words.length > 0) displayWord(words[0]);
    saveState();
  });

  function saveState() {
    Storage.save({
      text: textInput.value,
      currentIndex: currentIndex,
      wpm: wpmSlider.value,
      masterVolume: AudioSystem.volume,
      isMuted: AudioSystem.isMuted
    });
  }

  function loadState() {
    const state = Storage.load();
    if (state) {
      if (state.text) textInput.value = state.text;
      if (state.wpm) {
        wpmSlider.value = state.wpm;
        wpmValue.textContent = state.wpm;
      }
      if (state.masterVolume !== undefined) {
        AudioSystem.volume = state.masterVolume;
        volSlider.value = AudioSystem.volume;
      }
      if (state.isMuted !== undefined) {
        AudioSystem.isMuted = state.isMuted;
        muteBtn.textContent = AudioSystem.isMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', AudioSystem.isMuted);
      }
      words = RSVP.parseText(textInput.value, defaultText);
      if (state.currentIndex !== undefined && state.currentIndex < words.length) {
        currentIndex = state.currentIndex;
      }
    }
  }

  // Init
  loadState();
  if (!words || words.length === 0) words = RSVP.parseText(textInput.value, defaultText);
  if (words.length > 0) displayWord(words[currentIndex || 0]);
  updateProgress();
  
  // Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const navIndicator = document.getElementById('navIndicator');

  function updateNavIndicator(activeTab) {
    const rect = activeTab.getBoundingClientRect();
    const parentRect = activeTab.parentElement.getBoundingClientRect();
    navIndicator.style.width = `${rect.width}px`;
    navIndicator.style.left = `${rect.left - parentRect.left}px`;
  }

  window.addEventListener('load', () => {
    const active = document.querySelector('.nav-tab.active');
    if (active) updateNavIndicator(active);
  });
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-tab.active');
    if (active) updateNavIndicator(active);
  });

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      if (!AudioSystem.isUnlocked) AudioSystem.init();
      AudioSystem.playUiTick();
      
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
      
      updateNavIndicator(tab);
    });
  });

  // PWA SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registered: ', reg))
        .catch(err => console.log('SW registration failed: ', err));
    });
  }
});
