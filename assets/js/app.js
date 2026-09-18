import { Storage } from './storage.js';
import { AudioSystem } from './audio.js';
import { RSVP } from './rsvp.js';
import { Quotes, PreloadedLibrary } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const wpmSlider = document.getElementById('wpmSlider');
  const wpmValue = document.getElementById('wpmValue');
  const freeWpmWarning = document.getElementById('freeWpmWarning');
  const progressBar = document.getElementById('progressBar');
  const muteBtn = document.getElementById('muteBtn');
  const volSlider = document.getElementById('volSlider');
  
  // Modals & HUDs
  const readerCard = document.getElementById('readerCard');
  const pauseHud = document.getElementById('pauseHud');
  const jumpBackBtn = document.getElementById('jumpBackBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const countdownHud = document.getElementById('countdownHud');
  const countdownText = document.getElementById('countdownText');
  const ringProgress = document.getElementById('ringProgress');
  const countdownAffirmation = document.getElementById('countdownAffirmation');
  const emptyQuote = document.getElementById('emptyQuote');
  
  const paywallModal = document.getElementById('paywallModal');
  const closePaywallBtn = document.getElementById('closePaywallBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const paywallQuote = document.getElementById('paywallQuote');
  
  const completionModal = document.getElementById('completionModal');
  const closeCompletionBtn = document.getElementById('closeCompletionBtn');
  const completionQuote = document.getElementById('completionQuote');
  
  // UI Display
  const timerDisplay = document.getElementById('timerDisplay');
  const wordStartEl = document.getElementById('wordStart');
  const focalPointEl = document.getElementById('focalPoint');
  const wordEndEl = document.getElementById('wordEnd');
  
  // Settings & Library
  const tierToggleBtn = document.getElementById('tierToggleBtn');
  const tierStatusText = document.getElementById('tierStatusText');
  const audioProfileSelect = document.getElementById('audioProfileSelect');
  const colorPaletteSelect = document.getElementById('colorPaletteSelect');
  const libraryList = document.getElementById('libraryList');
  const addDocBtn = document.getElementById('addDocBtn');

  // State
  let state = Storage.load();
  let words = [];
  let isPlaying = false;
  let timerId = null;
  let lastTickTime = performance.now();
  let activeReadTime = 0; // tracking for analytics
  
  const defaultText = PreloadedLibrary[0].content;

  // Utilities
  function getRandomQuote(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Quote Engine
  let emptyQuoteInterval;
  function startEmptyQuoteRotate() {
    emptyQuoteInterval = setInterval(() => {
      emptyQuote.classList.add('quote-fade');
      setTimeout(() => {
        emptyQuote.textContent = getRandomQuote(Quotes.emptyState);
        emptyQuote.classList.remove('quote-fade');
      }, 1000);
    }, 8000);
  }
  startEmptyQuoteRotate();

  // Tier Checks
  function enforceTierLimits() {
    // WPM check
    let wpm = parseInt(wpmSlider.value, 10);
    if (!state.isPro && wpm > 400) {
      wpmSlider.value = 400;
      wpm = 400;
      wpmValue.textContent = wpm;
      freeWpmWarning.style.display = 'inline';
      showPaywall();
    } else {
      freeWpmWarning.style.display = 'none';
      wpmValue.textContent = wpm;
    }
    
    // Timer Display
    if (state.isPro) {
      timerDisplay.textContent = 'Tachyon Prime: Unlimited Time';
      timerDisplay.style.color = '#FFD700';
    } else {
      const minutes = Math.floor(state.freeTimeRemaining / 60);
      const seconds = Math.floor(state.freeTimeRemaining % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `Free Tier Time: ${minutes}:${seconds} remaining today`;
      timerDisplay.style.color = 'var(--text-secondary)';
      if (state.freeTimeRemaining <= 0) {
        showPaywall();
        if (isPlaying) stop();
      }
    }
    
    // UI Update
    tierStatusText.textContent = state.isPro ? 'Current: Tachyon Prime' : 'Current: Free Starter';
    
    // Theme & Audio Enforce
    if (!state.isPro) {
      if (state.soundProfile !== 'woodblock') {
        state.soundProfile = 'woodblock';
        audioProfileSelect.value = 'woodblock';
      }
      if (state.colorPalette !== 'crimson') {
        state.colorPalette = 'crimson';
        colorPaletteSelect.value = 'crimson';
      }
    }
    applyTheme();
    AudioSystem.profile = state.soundProfile;
  }

  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', `var(--palette-${state.colorPalette})`);
  }

  // Modals
  function showPaywall() {
    paywallQuote.textContent = getRandomQuote(Quotes.paywall);
    paywallModal.classList.remove('hidden');
  }

  closePaywallBtn.addEventListener('click', () => {
    paywallModal.classList.add('hidden');
  });

  upgradeBtn.addEventListener('click', () => {
    const originalText = upgradeBtn.textContent;
    upgradeBtn.textContent = 'Unlocking...';
    AudioSystem.init(); // ensure unlocked
    setTimeout(() => {
      AudioSystem.playSuccessChime();
      state.isPro = true;
      Storage.save(state);
      enforceTierLimits();
      renderLibrary();
      paywallModal.classList.add('hidden');
      upgradeBtn.textContent = originalText;
      alert('Tachyon Prime Activated. All Limits Unlocked.');
    }, 1200);
  });
  
  function showCompletion() {
    const wordsRead = words.length;
    const avgWpm = parseInt(wpmSlider.value, 10);
    const minsSaved = Math.max(0, (wordsRead / 200) - (wordsRead / avgWpm)).toFixed(1);
    
    document.getElementById('statWords').textContent = wordsRead;
    document.getElementById('statSpeed').textContent = avgWpm;
    document.getElementById('statTime').textContent = minsSaved;
    completionQuote.textContent = getRandomQuote(Quotes.completion);
    
    completionModal.classList.remove('hidden');
  }
  
  closeCompletionBtn.addEventListener('click', () => {
    completionModal.classList.add('hidden');
    resetBtn.click();
  });

  // Audio Init
  function initAudioOnTouch() {
    AudioSystem.init();
  }
  document.body.addEventListener('touchstart', initAudioOnTouch, { once: true, passive: true });
  document.body.addEventListener('click', initAudioOnTouch, { once: true });

  // RSVP Core
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
    const progress = (state.currentIndex / words.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function tick() {
    // Delta time for free tier
    const now = performance.now();
    const delta = (now - lastTickTime) / 1000;
    lastTickTime = now;
    
    if (!state.isPro) {
      state.freeTimeRemaining -= delta;
      if (state.freeTimeRemaining <= 0) {
        state.freeTimeRemaining = 0;
        enforceTierLimits();
        return; // stop execution
      }
    }

    if (state.currentIndex < words.length) {
      const currentWord = words[state.currentIndex];
      displayWord(currentWord);
      const wpm = parseInt(wpmSlider.value, 10);
      AudioSystem.playTick(wpm);
      
      state.currentIndex++;
      updateProgress();
      
      // Every few words, update display (performance opt)
      if (state.currentIndex % 10 === 0 && !state.isPro) {
         timerDisplay.textContent = `Free Tier Time: ${Math.floor(state.freeTimeRemaining / 60)}:${Math.floor(state.freeTimeRemaining % 60).toString().padStart(2, '0')} remaining today`;
      }
      
      const delay = RSVP.calculateDelay(currentWord, wpm);
      timerId = setTimeout(tick, delay);
    } else {
      stop();
      showCompletion();
    }
  }

  function play() {
    if (words.length === 0 || state.currentIndex >= words.length) {
      words = RSVP.parseText(state.text, defaultText);
      state.currentIndex = 0;
    }
    if (words.length === 0) return;
    
    // Tier check
    if (!state.isPro && state.freeTimeRemaining <= 0) {
      showPaywall();
      return;
    }
    
    emptyQuote.style.opacity = '0';
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
    playPauseBtn.classList.remove('primary');
    playPauseBtn.classList.add('secondary');
    
    lastTickTime = performance.now();
    tick();
  }

  function stop() {
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    playPauseBtn.classList.add('primary');
    playPauseBtn.classList.remove('secondary');
    clearTimeout(timerId);
    if(state.text === "") emptyQuote.style.opacity = '1';
    Storage.save(state);
    enforceTierLimits(); // update timer UI accurately
  }

  // HUD Logic
  readerCard.addEventListener('click', (e) => {
    if (e.target.closest('.hud-controls')) return;
    if (isPlaying) {
      stop();
      document.getElementById('hudWordPos').textContent = state.currentIndex;
      document.getElementById('hudWordTotal').textContent = words.length;
      document.getElementById('hudWpm').textContent = state.wpm;
      document.getElementById('hudProgress').textContent = words.length ? Math.floor((state.currentIndex / words.length) * 100) : 0;
      pauseHud.classList.remove('hidden');
    }
  });

  jumpBackBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.currentIndex = Math.max(0, state.currentIndex - 5);
    document.getElementById('hudWordPos').textContent = state.currentIndex;
    document.getElementById('hudProgress').textContent = words.length ? Math.floor((state.currentIndex / words.length) * 100) : 0;
    displayWord(words[state.currentIndex]);
    updateProgress();
    Storage.save(state);
  });

  resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseHud.classList.add('hidden');
    startCountdown();
  });

  function startCountdown() {
    countdownHud.classList.remove('hidden');
    let count = 3;
    ringProgress.style.transition = 'none';
    ringProgress.style.strokeDashoffset = 0;
    countdownAffirmation.textContent = getRandomQuote(Quotes.countdown);
    
    void ringProgress.offsetWidth;
    ringProgress.style.transition = 'stroke-dashoffset 1s linear';

    function tickCountdown() {
      if (count > 0) {
        countdownText.textContent = count;
        ringProgress.style.strokeDashoffset = 283 - ((3 - count + 1) / 3) * 283;
        AudioSystem.playCountdownBeep(false);
        count--;
        setTimeout(tickCountdown, 1000);
      } else {
        countdownText.textContent = "FOCUS";
        ringProgress.style.strokeDashoffset = 283;
        AudioSystem.playCountdownBeep(true);
        setTimeout(() => {
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
      if (state.currentIndex > 0 && state.currentIndex < words.length) {
        startCountdown();
      } else {
        play();
      }
    }
  });

  resetBtn.addEventListener('click', () => {
    stop();
    state.currentIndex = 0;
    words = RSVP.parseText(state.text, defaultText);
    updateProgress();
    if(words.length > 0) displayWord(words[0]);
    Storage.save(state);
  });

  textInput.addEventListener('input', () => {
    if (isPlaying) stop();
    state.text = textInput.value;
    state.currentIndex = 0;
    words = RSVP.parseText(state.text, defaultText);
    updateProgress();
    if(words.length > 0) {
      displayWord(words[0]);
      emptyQuote.style.opacity = '0';
    } else {
      displayWord('');
      emptyQuote.style.opacity = '1';
    }
    Storage.save(state);
  });

  // Settings Events
  wpmSlider.addEventListener('input', (e) => {
    state.wpm = e.target.value;
    enforceTierLimits();
    Storage.save(state);
  });

  muteBtn.addEventListener('click', () => {
    AudioSystem.isMuted = !AudioSystem.isMuted;
    state.isMuted = AudioSystem.isMuted;
    muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted', state.isMuted);
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    Storage.save(state);
  });

  volSlider.addEventListener('input', (e) => {
    AudioSystem.volume = parseFloat(e.target.value);
    state.masterVolume = AudioSystem.volume;
    if (state.masterVolume > 0 && state.isMuted) {
      state.isMuted = false;
      AudioSystem.isMuted = false;
      muteBtn.textContent = '🔊';
      muteBtn.classList.remove('muted');
    }
    if (state.masterVolume === 0 && !state.isMuted) {
      state.isMuted = true;
      AudioSystem.isMuted = true;
      muteBtn.textContent = '🔇';
      muteBtn.classList.add('muted');
    }
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    Storage.save(state);
  });

  tierToggleBtn.addEventListener('click', () => {
    state.isPro = !state.isPro;
    Storage.save(state);
    enforceTierLimits();
    renderLibrary();
    if(!state.isPro) alert("Switched to Free Tier Simulator");
  });

  audioProfileSelect.addEventListener('change', (e) => {
    if (!state.isPro && e.target.value !== 'woodblock') {
      e.target.value = 'woodblock';
      showPaywall();
      return;
    }
    state.soundProfile = e.target.value;
    AudioSystem.profile = state.soundProfile;
    Storage.save(state);
  });

  colorPaletteSelect.addEventListener('change', (e) => {
    if (!state.isPro && e.target.value !== 'crimson') {
      e.target.value = 'crimson';
      showPaywall();
      return;
    }
    state.colorPalette = e.target.value;
    applyTheme();
    Storage.save(state);
  });

  // Library
  function renderLibrary() {
    libraryList.innerHTML = '';
    state.library.forEach((doc, idx) => {
      const isLocked = doc.isLocked && !state.isPro;
      const el = document.createElement('div');
      el.className = 'lib-item' + (isLocked ? ' locked' : '');
      el.innerHTML = `
        <div>
          <h4>${doc.title} ${isLocked ? '🔒' : ''}</h4>
          <span style="font-size: 12px; color: var(--text-secondary);">${doc.author}</span>
        </div>
        <button class="btn secondary" style="padding: 6px 12px; font-size: 12px;">${isLocked ? 'Unlock' : 'Load'}</button>
      `;
      el.addEventListener('click', () => {
        if (isLocked) {
          showPaywall();
        } else {
          state.text = doc.content;
          textInput.value = state.text;
          textInput.dispatchEvent(new Event('input'));
          // Switch to reader tab
          document.querySelector('[data-target="tab-reader"]').click();
        }
      });
      libraryList.appendChild(el);
    });
  }

  addDocBtn.addEventListener('click', () => {
    if (!state.isPro && state.library.length >= 2) {
      showPaywall();
      return;
    }
    // Add dummy document for demo
    state.library.push({
      id: 'doc' + Date.now(),
      title: 'New Custom Document',
      author: 'User',
      isLocked: false,
      content: 'This is a new custom document added to the library.'
    });
    Storage.save(state);
    renderLibrary();
  });

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

  // Initialization Boot
  function init() {
    textInput.value = state.text;
    wpmSlider.value = state.wpm;
    volSlider.value = state.masterVolume;
    audioProfileSelect.value = state.soundProfile;
    colorPaletteSelect.value = state.colorPalette;
    
    AudioSystem.volume = state.masterVolume;
    AudioSystem.profile = state.soundProfile;
    AudioSystem.isMuted = state.isMuted;
    
    muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
    if (state.isMuted) muteBtn.classList.add('muted');
    
    if (state.text) emptyQuote.style.opacity = '0';
    
    words = RSVP.parseText(state.text, defaultText);
    enforceTierLimits();
    renderLibrary();
    updateProgress();
    if (words.length > 0) displayWord(words[state.currentIndex || 0]);
  }
  
  init();

  // PWA SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }
});
