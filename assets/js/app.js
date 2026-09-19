import { Storage } from './storage.js';
import { AudioSystem } from './audio.js';
import { RSVP } from './rsvp.js';
import { Quotes, PreloadedLibrary } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const textInput = document.getElementById('textInput');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const wpmSlider = document.getElementById('wpmSlider');
  const wpmValue = document.getElementById('wpmValue');
  const progressBar = document.getElementById('progressBar');
  const muteBtn = document.getElementById('muteBtn');
  const volSlider = document.getElementById('volSlider');
  
  // Modals & HUDs
  const readerCard = document.getElementById('readerCard');
  const pauseHud = document.getElementById('pauseHud');
  const pauseAnimIcon = document.getElementById('pauseAnimIcon');
  const jumpBackBtn = document.getElementById('jumpBackBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const countdownHud = document.getElementById('countdownHud');
  const countdownText = document.getElementById('countdownText');
  const ringProgress = document.getElementById('ringProgress');
  const countdownAffirmation = document.getElementById('countdownAffirmation');
  
  const completionModal = document.getElementById('completionModal');
  const bookLaunchModal = document.getElementById('bookLaunchModal');
  const launchBookTitle = document.getElementById('launchBookTitle');
  const launchBookAuthor = document.getElementById('launchBookAuthor');
  const launchTotalWords = document.getElementById('launchTotalWords');
  const launchProgressText = document.getElementById('launchProgressText');
  const launchPositionLabel = document.getElementById('launchPositionLabel');
  const launchPositionSlider = document.getElementById('launchPositionSlider');
  const launchReadBtn = document.getElementById('launchReadBtn');
  const launchResetBtn = document.getElementById('launchResetBtn');
  const closeLaunchModalBtn = document.getElementById('closeLaunchModalBtn');
  const closeCompletionBtn = document.getElementById('closeCompletionBtn');
  const completionQuote = document.getElementById('completionQuote');
  
  const editBookModal = document.getElementById('editBookModal');
  const editBookTitle = document.getElementById('editBookTitle');
  const editBookContent = document.getElementById('editBookContent');
  const cancelBookBtn = document.getElementById('cancelBookBtn');
  const saveBookBtn = document.getElementById('saveBookBtn');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  
  // UI Display
  const wordStartEl = document.getElementById('wordStart');
  const focalPointEl = document.getElementById('focalPoint');
  const wordEndEl = document.getElementById('wordEnd');
  
  // Settings & Library & Premium
  const tierToggleBtn = document.getElementById('tierToggleBtn');
  const tierStatusText = document.getElementById('tierStatusText');
  const audioProfileSegments = document.querySelectorAll('#audioProfileSegments .segment');
  const themeCapsules = document.querySelectorAll('.theme-capsule');
  const accentSwatches = document.querySelectorAll('#accentSwatches .color-swatch');
  const volSliderSettings = document.getElementById('volSliderSettings');
  const libraryList = document.getElementById('libraryList');
  const addDocBtn = document.getElementById('addDocBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');

  // Navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const navIndicator = document.getElementById('navIndicator');

  // State
  let state = {};
  let libraryMeta = [];
  let currentBookMeta = null;
  let currentChunkWords = [];
  let pendingLaunchDoc = null;
  let pendingLaunchIndex = 0;
  let currentChunkIndex = 0;
  
  let isPlaying = false;
  let timerId = null;
  let editingBookId = null;
  let selectedColor = 'red';
  let isRamping = false;
  let rampStartTime = 0;
  let countdownIntervalId = null;
  
  const defaultText = "Think in paragraphs, absorb in words, unlock in seconds.";

  // Init DB and Settings
  await Storage.initDB();
  state = await Storage.loadSettings();

  // Utilities
  function getRandomQuote(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const quoteOverlay = document.getElementById('quoteOverlay');

  // Quote Engine
  let emptyQuoteInterval;
  let isTyping = false;
  
  function rotateQuote(immediate = false) {
    if(textInput.value === '' && state.activeDocId === 'scratchpad' && !isTyping) {
      quoteOverlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      if (immediate) {
        quoteOverlay.textContent = getRandomQuote(Quotes.emptyState);
        quoteOverlay.style.opacity = '0.8';
        quoteOverlay.style.transform = 'translateY(0px)';
      } else {
        quoteOverlay.style.opacity = '0';
        quoteOverlay.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          if (textInput.value === '' && !isTyping && state.activeDocId === 'scratchpad') {
            quoteOverlay.textContent = getRandomQuote(Quotes.emptyState);
            quoteOverlay.style.opacity = '0.8';
            quoteOverlay.style.transform = 'translateY(0px)';
          }
        }, 500);
      }
    } else {
      quoteOverlay.style.transition = 'none';
      quoteOverlay.style.opacity = '0';
    }
  }

  function startEmptyQuoteRotate() {
    if (emptyQuoteInterval) clearInterval(emptyQuoteInterval);
    rotateQuote(true); // Initial call
    emptyQuoteInterval = setInterval(rotateQuote, 6000);
  }

  function stopEmptyQuoteRotate() {
    if (emptyQuoteInterval) clearInterval(emptyQuoteInterval);
    emptyQuoteInterval = null;
  }
  
  startEmptyQuoteRotate();

  function enforceTierLimits() {
    wpmValue.textContent = wpmSlider.value;
    tierStatusText.textContent = state.isPro ? 'Current: Tachyon Prime' : 'Current: Free Starter';
    applyTheme();
    AudioSystem.profile = state.soundProfile;
    AudioSystem.volume = state.masterVolume !== undefined ? state.masterVolume : 0.3;
    AudioSystem.isMuted = state.isMuted || false;
    
    if (state.masterVolume !== undefined) volSlider.value = state.masterVolume;
    if (volSliderSettings) volSliderSettings.value = volSlider.value;
    updateMuteIcon();

    if (state.isPro) {
      if (upgradeBtn) {
        upgradeBtn.textContent = 'Already Member';
        upgradeBtn.disabled = true;
        upgradeBtn.style.opacity = '0.5';
        upgradeBtn.style.pointerEvents = 'none';
      }
      const planSelector = document.querySelector('.plan-selector');
      if (planSelector) planSelector.style.display = 'none';
    } else {
      if (upgradeBtn) {
        upgradeBtn.textContent = 'Start 7-Day Free Trial';
        upgradeBtn.disabled = false;
        upgradeBtn.style.opacity = '1';
        upgradeBtn.style.pointerEvents = 'auto';
      }
      const planSelector = document.querySelector('.plan-selector');
      if (planSelector) planSelector.style.display = 'flex';
    }
  }

  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--accent', `var(--palette-${state.colorPalette})`);
    if (state.appTheme) {
      document.body.setAttribute('data-theme', state.appTheme);
    } else {
      document.body.setAttribute('data-theme', 'oled');
    }
  }

  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      const originalText = upgradeBtn.textContent;
      upgradeBtn.textContent = 'Unlocking...';
      AudioSystem.init(); 
      setTimeout(() => {
        AudioSystem.playSuccessChime();
        state.isPro = true;
        Storage.saveSettings(state);
        enforceTierLimits();
        renderLibrary();
        upgradeBtn.textContent = originalText;
        
        const readerTabBtn = document.querySelector('[data-target="tab-reader"]');
        if (readerTabBtn) readerTabBtn.click();
      }, 1200);
    });
  }

  function showCompletion() {
    const wordsRead = currentBookMeta ? currentBookMeta.totalWords : 0;
    const avgWpm = parseInt(wpmSlider.value, 10);
    
    const baselineSeconds = (wordsRead / 250) * 60;
    const tachyonSeconds = (wordsRead / avgWpm) * 60;
    const savedSeconds = Math.max(0, baselineSeconds - tachyonSeconds);
    
    let timeSavedStr = "0 seconds";
    if (savedSeconds > 0) {
      if (savedSeconds < 60) {
        timeSavedStr = `${Math.floor(savedSeconds)} seconds`;
      } else {
        const mins = Math.floor(savedSeconds / 60);
        const secs = Math.floor(savedSeconds % 60);
        timeSavedStr = secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
      }
    }
    
    document.getElementById('statWords').textContent = wordsRead;
    document.getElementById('statTime').textContent = timeSavedStr;
    completionQuote.textContent = getRandomQuote(Quotes.completion);
    
    completionModal.classList.remove('hidden');
  }

  closeCompletionBtn.addEventListener('click', () => {
    completionModal.classList.add('hidden');
    resetBtn.click();
  });

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
    if (!currentBookMeta || currentBookMeta.totalWords === 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (currentBookMeta.currentIndex / currentBookMeta.totalWords) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function renderHUD() {
    if (!currentBookMeta) return;
    document.getElementById('hudWordPos').textContent = currentBookMeta.currentIndex;
    document.getElementById('hudWordTotal').textContent = currentBookMeta.totalWords;
    document.getElementById('hudWpm').textContent = state.wpm;
    document.getElementById('hudProgress').textContent = currentBookMeta.totalWords ? Math.floor((currentBookMeta.currentIndex / currentBookMeta.totalWords) * 100) : 0;
  }

  async function tick() {
    if (!isPlaying) return;
    if (!currentBookMeta) {
      await stop();
      return;
    }
    
    if (currentBookMeta.currentIndex >= currentBookMeta.totalWords) {
      await stop();
      showCompletion();
      return;
    }

    const chunkSize = 1000;
    const targetChunkIndex = Math.floor(currentBookMeta.currentIndex / chunkSize);
    const indexInChunk = currentBookMeta.currentIndex % chunkSize;

    if (targetChunkIndex !== currentChunkIndex || currentChunkWords.length === 0) {
      currentChunkIndex = targetChunkIndex;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, targetChunkIndex);
    }

    const currentWord = currentChunkWords[indexInChunk];
    if (!currentWord) {
      await stop();
      return;
    }

    displayWord(currentWord);
    
    // Ramp logic
    let targetWpm = parseInt(wpmSlider.value, 10);
    let currentWpm = targetWpm;
    if (isRamping) {
      const elapsed = Date.now() - rampStartTime;
      const rampDuration = 2000;
      if (elapsed < rampDuration) {
        const startWpm = targetWpm * 0.6;
        currentWpm = startWpm + ((targetWpm - startWpm) * (elapsed / rampDuration));
      } else {
        isRamping = false;
      }
    }
    
    AudioSystem.playTick(currentWpm);
    
    currentBookMeta.currentIndex++;
    updateProgress();
    
    const delay = RSVP.calculateDelay(currentWord, currentWpm);
    timerId = setTimeout(tick, delay);
  }

  async function play(isResume = false) {
    if (!currentBookMeta) return;
    
    if (currentBookMeta.currentIndex >= currentBookMeta.totalWords) {
      currentBookMeta.currentIndex = 0;
      currentChunkIndex = 0;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, 0);
      updateProgress();
      await Storage.updateBookProgress(currentBookMeta.id, 0);
      isResume = false;
    }
    
    if (isResume) {
      isRamping = true;
      rampStartTime = Date.now();
    } else {
      isRamping = false;
    }
    
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
    playPauseBtn.classList.remove('primary');
    playPauseBtn.classList.add('secondary');
    tick();
  }

  async function stop() {
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    playPauseBtn.classList.add('primary');
    playPauseBtn.classList.remove('secondary');
    clearTimeout(timerId);
    
    if (isCountingDown) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
      isCountingDown = false;
      countdownHud.classList.add('hidden');
    }
    
    if (currentBookMeta) {
      currentBookMeta.currentIndex = Math.max(0, currentBookMeta.currentIndex - 5);
      const targetChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
      
      if (targetChunkIndex !== currentChunkIndex) {
        currentChunkIndex = targetChunkIndex;
        currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, targetChunkIndex);
      }
      
      const indexInChunk = currentBookMeta.currentIndex % 1000;
      displayWord(currentChunkWords[indexInChunk] || '');
      updateProgress();

      await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
      await renderLibrary(); // refresh UI just in case
    }
  }

  function triggerPauseAnimation() {
    if (pauseAnimIcon) {
      pauseAnimIcon.classList.remove('animate');
      void pauseAnimIcon.offsetWidth; // Force reflow
      pauseAnimIcon.classList.add('animate');
    }
  }

  document.addEventListener('keydown', async (e) => {
    const activeEl = document.activeElement;
    const isTextInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    if (e.code === 'Space' && !isTextInput) {
      e.preventDefault();
      if (isPlaying) {
        triggerPauseAnimation();
        await stop();
        renderHUD();
        pauseHud.classList.remove('hidden');
      } else if (!pauseHud.classList.contains('hidden')) {
        pauseHud.classList.add('hidden');
        startCountdown();
      } else if (currentBookMeta && currentBookMeta.currentIndex > 0 && currentBookMeta.currentIndex < currentBookMeta.totalWords) {
        startCountdown();
      } else {
        play();
      }
    }
  });

  readerCard.addEventListener('click', async (e) => {
    if (e.target.closest('.hud-controls')) return;
    if (isPlaying) {
      triggerPauseAnimation();
      await stop();
      renderHUD();
      pauseHud.classList.remove('hidden');
    }
  });

  jumpBackBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!currentBookMeta) return;
    
    currentBookMeta.currentIndex = Math.max(0, currentBookMeta.currentIndex - 5);
    const targetChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
    
    if (targetChunkIndex !== currentChunkIndex) {
      currentChunkIndex = targetChunkIndex;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, targetChunkIndex);
    }
    
    renderHUD();
    const indexInChunk = currentBookMeta.currentIndex % 1000;
    displayWord(currentChunkWords[indexInChunk] || '');
    updateProgress();
    await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
  });

  resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseHud.classList.add('hidden');
    startCountdown();
  });

  let isCountingDown = false;
  function startCountdown() {
    if (isCountingDown) return;
    isCountingDown = true;
    countdownHud.classList.remove('hidden');
    
    ringProgress.style.transition = 'none';
    ringProgress.style.strokeDasharray = '283';
    ringProgress.style.strokeDashoffset = '283';
    
    // Force reflow to guarantee the transition starts from 283
    void ringProgress.offsetWidth;
    
    ringProgress.style.transition = 'stroke-dashoffset 3s linear';
    ringProgress.style.strokeDashoffset = '0';
    
    countdownAffirmation.textContent = getRandomQuote(Quotes.countdown);
    
    let count = 3;
    countdownText.textContent = count;
    AudioSystem.playCountdownBeep(false);

    countdownIntervalId = setInterval(() => {
      count--;
      if (count > 0) {
        countdownText.textContent = count;
        AudioSystem.playCountdownBeep(false);
      } else {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
        countdownText.textContent = "";
        AudioSystem.playCountdownBeep(true);
        countdownHud.classList.add('hidden');
        isCountingDown = false;
        play(true); // Launch RSVP stream seamlessly with ramp
      }
    }, 1000);
  }

  playPauseBtn.addEventListener('click', async () => {
    if (isPlaying) {
      triggerPauseAnimation();
      await stop();
      renderHUD();
      pauseHud.classList.remove('hidden');
    } else if (!pauseHud.classList.contains('hidden')) {
      pauseHud.classList.add('hidden');
      startCountdown();
    } else if (currentBookMeta && currentBookMeta.currentIndex > 0 && currentBookMeta.currentIndex < currentBookMeta.totalWords) {
      startCountdown();
    } else {
      play();
    }
  });

  resetBtn.addEventListener('click', async () => {
    await stop();
    if (currentBookMeta) {
      currentBookMeta.currentIndex = 0;
      currentChunkIndex = 0;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, 0);
      updateProgress();
      renderHUD();
      displayWord(currentChunkWords[0] || '');
      await Storage.updateBookProgress(currentBookMeta.id, 0);
    }
  });

  textInput.addEventListener('focus', () => {
    isTyping = true;
    stopEmptyQuoteRotate();
    if (textInput.value !== '') {
      quoteOverlay.style.transition = 'none';
      quoteOverlay.style.opacity = '0';
    }
  });

  textInput.addEventListener('blur', () => {
    isTyping = false;
    if (textInput.value === '' && state.activeDocId === 'scratchpad') {
      startEmptyQuoteRotate();
    }
  });

  textInput.addEventListener('input', async () => {
    if (isPlaying) await stop();
    
    if (textInput.value === '') {
      quoteOverlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      if (!quoteOverlay.textContent) {
         quoteOverlay.textContent = getRandomQuote(Quotes.emptyState);
      }
      quoteOverlay.style.opacity = '0.8';
      quoteOverlay.style.transform = 'translateY(0px)';
    } else {
      quoteOverlay.style.transition = 'none';
      quoteOverlay.style.opacity = '0';
    }
    
    let rawText = textInput.value;
    let newWords = RSVP.parseText(rawText, "");
    
    if (!state.isPro && newWords.length > 500) {
      newWords = newWords.slice(0, 500);
      rawText = newWords.join(' ') + '... (Free Tier Limit Reached)';
      textInput.value = rawText;
      alert('With free you can only have 500 words max');
    }
    
    await Storage.saveBook('scratchpad', 'Scratchpad', 'User', newWords, 'red');
    await loadBook('scratchpad');
  });

  wpmSlider.addEventListener('input', (e) => {
    state.wpm = e.target.value;
    enforceTierLimits();
    Storage.saveSettings(state);
  });

  function updateMuteIcon() {
    if (state.isMuted) {
      muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    } else {
      muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    }
  }

  muteBtn.addEventListener('click', () => {
    AudioSystem.isMuted = !AudioSystem.isMuted;
    state.isMuted = AudioSystem.isMuted;
    updateMuteIcon();
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    Storage.saveSettings(state);
  });

  volSlider.addEventListener('input', (e) => {
    AudioSystem.volume = parseFloat(e.target.value);
    state.masterVolume = AudioSystem.volume;
    if (state.masterVolume > 0 && state.isMuted) {
      state.isMuted = false;
      AudioSystem.isMuted = false;
      updateMuteIcon();
    }
    if (state.masterVolume === 0 && !state.isMuted) {
      state.isMuted = true;
      AudioSystem.isMuted = true;
      updateMuteIcon();
    }
    if (!AudioSystem.isUnlocked) AudioSystem.init();
    AudioSystem.playTick();
    Storage.saveSettings(state);
  });

  tierToggleBtn.addEventListener('click', () => {
    state.isPro = !state.isPro;
    Storage.saveSettings(state);
    enforceTierLimits();
    renderLibrary();
    const originalText = tierStatusText.textContent;
    tierStatusText.textContent = state.isPro ? "Simulating Prime" : "Simulating Free";
    tierStatusText.style.color = "var(--accent)";
    setTimeout(() => {
      tierStatusText.textContent = originalText;
      tierStatusText.style.color = "var(--text-secondary)";
    }, 1500);
  });

  audioProfileSegments.forEach(segment => {
    segment.addEventListener('click', () => {
      audioProfileSegments.forEach(s => s.classList.remove('active'));
      segment.classList.add('active');
      state.soundProfile = segment.dataset.val;
      AudioSystem.profile = state.soundProfile;
      if (!AudioSystem.isUnlocked) AudioSystem.init();
      AudioSystem.playTick();
      Storage.saveSettings(state);
    });
  });

  themeCapsules.forEach(capsule => {
    capsule.addEventListener('click', () => {
      themeCapsules.forEach(c => c.classList.remove('active'));
      capsule.classList.add('active');
      state.appTheme = capsule.dataset.theme;
      applyTheme();
      Storage.saveSettings(state);
    });
  });

  accentSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      accentSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.colorPalette = swatch.dataset.color;
      applyTheme();
      Storage.saveSettings(state);
    });
  });
  
  if (volSliderSettings) {
    volSliderSettings.addEventListener('input', (e) => {
      volSlider.value = e.target.value; // Sync the main slider
      volSlider.dispatchEvent(new Event('input'));
    });
  }

  async function renderLibrary() {
    libraryMeta = await Storage.getLibraryMeta();
    libraryList.innerHTML = '';
    
    const displayDocs = libraryMeta.filter(m => m.id !== 'scratchpad');
    
    if (displayDocs.length === 0) {
      libraryList.innerHTML = '<div style="color: var(--text-secondary); font-size: 14px; text-align: center; padding: 20px;">Your library is empty.</div>';
    }
    
    const wpm = parseInt(state.wpm, 10) || 350;

    displayDocs.forEach((doc) => {
      const el = document.createElement('div');
      el.className = 'lib-item-container';
      el.style.position = 'relative';
      el.style.borderRadius = '12px';
      el.style.marginBottom = '12px';
      
      const percent = doc.totalWords > 0 ? Math.floor((doc.currentIndex / doc.totalWords) * 100) : 0;
      const remainingWords = Math.max(0, doc.totalWords - doc.currentIndex);
      const remainingMins = Math.ceil(remainingWords / wpm);
      const remainingText = percent === 100 ? 'Completed' : `${remainingMins} min left (${percent}%)`;
      
      el.innerHTML = `
        <div class="swipe-actions" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-color: #FF3B30; border-radius: 12px; display: flex; justify-content: flex-end; align-items: center; padding-right: 20px; color: white; z-index: 1;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </div>
        <div class="lib-item swipe-content" style="position: relative; z-index: 2; background: var(--bg-secondary); border-left: 4px solid var(--palette-${doc.color || 'red'}); border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; touch-action: pan-y;">
          <div style="display: flex; align-items: center; width: 100%;">
            <div style="flex: 1; padding-right: 12px; overflow: hidden; cursor: pointer;" class="lib-click-area">
              <h4 class="glow-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">${doc.title}</h4>
              <div style="font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span>${doc.author} • ${doc.totalWords} words</span>
                <span>${remainingText}</span>
              </div>
            </div>
            <button class="btn secondary edit-btn" style="padding: 6px 12px; font-size: 12px; flex-shrink: 0; background: rgba(255,255,255,0.05); margin-left: 8px;">Edit</button>
          </div>
          <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 4px;">
            <div style="height: 100%; width: ${percent}%; background: var(--palette-${doc.color || 'red'});"></div>
          </div>
        </div>
      `;
      
      const swipeContent = el.querySelector('.swipe-content');
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      let hasVibrated = false;
      
      swipeContent.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        swipeContent.style.transition = 'none';
      }, { passive: true });
      
      swipeContent.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        if (currentX > 0) currentX = 0; // only swipe left
        swipeContent.style.transform = `translateX(${currentX}px)`;
        
        const threshold = -window.innerWidth * 0.75;
        if (currentX < threshold && !hasVibrated) {
          if (navigator.vibrate) navigator.vibrate(50);
          hasVibrated = true;
        } else if (currentX >= threshold) {
          hasVibrated = false;
        }
      }, { passive: true });
      
      swipeContent.addEventListener('touchend', async (e) => {
        if (!isDragging) return;
        isDragging = false;
        const threshold = -window.innerWidth * 0.75;
        
        if (currentX < threshold) {
          swipeContent.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          swipeContent.style.transform = `translateX(-100vw)`;
          
          el.style.transition = 'all 0.3s ease';
          el.style.height = el.offsetHeight + 'px';
          el.style.overflow = 'hidden';
          
          requestAnimationFrame(() => {
            el.style.height = '0px';
            el.style.margin = '0px';
            el.style.opacity = '0';
          });
          
          setTimeout(async () => {
            await Storage.deleteBook(doc.id);
            renderLibrary();
          }, 300);
        } else {
          swipeContent.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          swipeContent.style.transform = `translateX(0px)`;
        }
        currentX = 0;
      });
      
      el.querySelector('.lib-click-area').addEventListener('click', () => {
        openLaunchModal(doc);
      });
      
      el.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(doc.id);
      });
      
      libraryList.appendChild(el);
    });
  }

  addDocBtn.addEventListener('click', () => {
    const displayDocs = libraryMeta.filter(m => m.id !== 'scratchpad');
    if (!state.isPro && displayDocs.length >= 1) {
      alert('With free you can only have 1 book in your library');
      return;
    }
    openEditModal(null);
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
    });
  });

  async function openEditModal(id) {
    if (id) {
      editingBookId = id;
      const book = libraryMeta.find(b => b.id === id);
      editBookTitle.value = book.title;
      
      // Fetch full text for editing
      let fullText = [];
      const totalChunks = Math.ceil(book.totalWords / 1000);
      for(let i=0; i<totalChunks; i++) {
         const chunk = await Storage.getBookChunk(id, i);
         fullText.push(chunk.join(' '));
      }
      editBookContent.value = fullText.join(' ');
      selectedColor = book.color || 'red';
    } else {
      editingBookId = null;
      editBookTitle.value = "New Book";
      editBookContent.value = "";
      selectedColor = "red";
    }
    
    colorSwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color === selectedColor);
    });
    
    editBookModal.classList.remove('hidden');
  }

  cancelBookBtn.addEventListener('click', () => {
    editBookModal.classList.add('hidden');
  });

  saveBookBtn.addEventListener('click', async () => {
    let rawText = editBookContent.value;
    let newWords = RSVP.parseText(rawText, "");
    
    if (!state.isPro && newWords.length > 500) {
      alert('With free you can only have 500 words max');
      newWords = newWords.slice(0, 500);
      rawText = newWords.join(' ') + '... (Free Tier Limit Reached)';
      editBookContent.value = rawText;
      return;
    }

    if (editingBookId) {
      await Storage.saveBook(editingBookId, editBookTitle.value, 'User', newWords, selectedColor);
    } else {
      await Storage.saveBook('book_' + Date.now(), editBookTitle.value || 'Untitled', 'User', newWords, selectedColor);
    }
    
    await renderLibrary();
    editBookModal.classList.add('hidden');
  });

  function updateNavIndicator(activeTab) {
    navIndicator.style.width = `${activeTab.offsetWidth}px`;
    navIndicator.style.left = `${activeTab.offsetLeft}px`;
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
    tab.addEventListener('click', async () => {
      if (tab.classList.contains('active')) return;
      
      if (isPlaying) await stop();
      else if (currentBookMeta) {
        await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
        await renderLibrary();
      }

      if (!AudioSystem.isUnlocked) AudioSystem.init();
      
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
      
      updateNavIndicator(tab);
    });
  });

  async function loadBook(bookId) {
    state.activeDocId = bookId;
    await Storage.saveSettings(state);
    
    currentBookMeta = await Storage.getBookMeta(bookId);
    if (!currentBookMeta) return;

    currentChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
    currentChunkWords = await Storage.getBookChunk(bookId, currentChunkIndex);
    
    if (bookId !== 'scratchpad') {
      textInput.style.display = 'none';
      const inputCard = document.querySelector('.input-card');
      let returnBtn = document.getElementById('returnScratchBtn');
      if (!returnBtn) {
        returnBtn = document.createElement('button');
        returnBtn.id = 'returnScratchBtn';
        returnBtn.className = 'btn secondary';
        returnBtn.style.width = '100%';
        returnBtn.textContent = 'Return to Scratchpad';
        returnBtn.onclick = async () => {
          await loadBook('scratchpad');
        };
        inputCard.appendChild(returnBtn);
      }
      returnBtn.style.display = 'block';
    } else {
      textInput.style.display = 'block';
      let returnBtn = document.getElementById('returnScratchBtn');
      if (returnBtn) returnBtn.style.display = 'none';
      
      // Load scratchpad text into textarea
      let fullText = [];
      const totalChunks = Math.ceil(currentBookMeta.totalWords / 1000);
      for(let i=0; i<totalChunks; i++) {
         const chunk = await Storage.getBookChunk('scratchpad', i);
         fullText.push(chunk.join(' '));
      }
      textInput.value = fullText.join(' ');
    }

    updateProgress();
    renderHUD();
    
    if (currentChunkWords.length > 0) {
      const indexInChunk = currentBookMeta.currentIndex % 1000;
      displayWord(currentChunkWords[indexInChunk] || '');
    } else {
      displayWord('');
    }
  }

  function openLaunchModal(doc) {
    pendingLaunchDoc = doc;
    pendingLaunchIndex = doc.currentIndex;
    
    launchBookTitle.textContent = doc.title;
    launchBookAuthor.textContent = doc.author || 'Unknown Author';
    launchTotalWords.textContent = doc.totalWords.toLocaleString();
    
    const pct = doc.totalWords > 0 ? ((doc.currentIndex / doc.totalWords) * 100).toFixed(1) : 0;
    launchProgressText.textContent = `${pct}%`;
    
    launchPositionSlider.value = pct;
    launchPositionLabel.textContent = `Word ${doc.currentIndex.toLocaleString()} (${pct}%)`;
    
    bookLaunchModal.classList.remove('hidden');
  }
  
  function closeLaunchModal() {
    bookLaunchModal.classList.add('hidden');
    pendingLaunchDoc = null;
  }
  
  closeLaunchModalBtn.addEventListener('click', closeLaunchModal);
  
  launchPositionSlider.addEventListener('input', (e) => {
    if (!pendingLaunchDoc) return;
    const pct = parseFloat(e.target.value);
    let newIndex = Math.floor((pct / 100) * pendingLaunchDoc.totalWords);
    // Boundary check
    newIndex = Math.min(Math.max(0, newIndex), pendingLaunchDoc.totalWords - 1);
    // If book is empty
    if (pendingLaunchDoc.totalWords === 0) newIndex = 0;
    
    pendingLaunchIndex = newIndex;
    launchPositionLabel.textContent = `Word ${pendingLaunchIndex.toLocaleString()} (${pct.toFixed(1)}%)`;
  });
  
  launchResetBtn.addEventListener('click', () => {
    if (!pendingLaunchDoc) return;
    pendingLaunchIndex = 0;
    launchPositionSlider.value = 0;
    launchPositionLabel.textContent = `Word 0 (0.0%)`;
  });
  
  launchReadBtn.addEventListener('click', async () => {
    if (!pendingLaunchDoc) return;
    
    if (pendingLaunchIndex !== pendingLaunchDoc.currentIndex) {
      pendingLaunchDoc.currentIndex = pendingLaunchIndex;
      await Storage.updateBookProgress(pendingLaunchDoc.id, pendingLaunchIndex);
    }
    
    const targetId = pendingLaunchDoc.id;
    closeLaunchModal();
    await loadBook(targetId);
    document.querySelector('[data-target="tab-reader"]').click();
  });

  async function init() {
    wpmSlider.value = state.wpm;
    volSlider.value = state.masterVolume;
    if (volSliderSettings) volSliderSettings.value = state.masterVolume;
    
    audioProfileSegments.forEach(s => s.classList.toggle('active', s.dataset.val === state.soundProfile));
    accentSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === state.colorPalette));
    themeCapsules.forEach(c => c.classList.toggle('active', c.dataset.theme === (state.appTheme || 'oled')));
    
    AudioSystem.volume = state.masterVolume;
    AudioSystem.profile = state.soundProfile;
    AudioSystem.isMuted = state.isMuted;
    
    updateMuteIcon();
    enforceTierLimits();

    // Init Preloaded
    libraryMeta = await Storage.getLibraryMeta();
    if (libraryMeta.length === 0) {
      for (const doc of PreloadedLibrary) {
         const words = RSVP.parseText(doc.content, "");
         await Storage.saveBook(doc.id, doc.title, doc.author, words, 'red');
      }
      libraryMeta = await Storage.getLibraryMeta();
    }

    // Init Scratchpad
    let scratch = await Storage.getBookMeta('scratchpad');
    if (!scratch) {
      const words = [];
      await Storage.saveBook('scratchpad', 'Scratchpad', 'User', words, 'red');
    } else if (scratch.totalWords > 0) {
      const chunk0 = await Storage.getBookChunk('scratchpad', 0);
      const scratchText = chunk0.join(' ');
      const defaultWords = RSVP.parseText(defaultText, "");
      if (scratchText === defaultWords.join(' ')) {
        await Storage.saveBook('scratchpad', 'Scratchpad', 'User', [], 'red');
      }
    }
    
    await renderLibrary();

    if (state.activeDocId) {
      const exists = await Storage.getBookMeta(state.activeDocId);
      if (exists) {
        await loadBook(state.activeDocId);
      } else {
        await loadBook('scratchpad');
      }
    } else {
      await loadBook('scratchpad');
    }
  }
  
  await init();

  // Demo Video Logic
  const demoOverlay = document.getElementById("demoOverlay");
  const iphoneFrame = document.getElementById("demoIphoneFrame");
  
  if (demoOverlay && iphoneFrame) {
    const scenes = {
      lib: document.getElementById("scene1Lib"),
      themes: document.getElementById("scene2Themes"),
      reader: document.getElementById("scene3Reader"),
      scratch: document.getElementById("scene4Scratch"),
      outro: document.getElementById("scene5Outro")
    };

    const callouts = {
      c1: document.getElementById("callout1"),
      c2: document.getElementById("callout2"),
      c3: document.getElementById("callout3"),
      c4: document.getElementById("callout4")
    };

    let isPlayingDemo = false;

    async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function moveCursor(id, top, left, doTap) {
      const c = document.getElementById(id);
      if(!c) return;
      c.style.top = top; c.style.left = left;
      if(doTap) {
        c.classList.add("tap");
        setTimeout(()=>c.classList.remove("tap"), 300);
      }
    }

    async function runDemoSequence() {
      if(isPlayingDemo) return;
      isPlayingDemo = true;
      demoOverlay.style.opacity = "0";
      await wait(500);
      demoOverlay.style.display = "none";

      // Reset all
      Object.values(scenes).forEach(s => s && s.classList.remove("active"));
      Object.values(callouts).forEach(c => c && c.classList.remove("show"));
      iphoneFrame.className = "iphone-mockup zoomed";
      
      // Scene 1
      scenes.lib.classList.add("active");
      callouts.c1.classList.add("show");
      await wait(1000);
      moveCursor("demoCursor1", "120px", "200px", true);
      await wait(200);
      document.getElementById("demoBook1").classList.add("swiped");
      await wait(1000);
      moveCursor("demoCursor1", "250px", "140px", true);
      await wait(200);
      document.getElementById("demoResumeSheet").classList.add("open");
      await wait(2000);
      scenes.lib.classList.remove("active");
      callouts.c1.classList.remove("show");
      await wait(400);

      // Scene 2
      scenes.themes.classList.add("active");
      callouts.c2.classList.add("show");
      await wait(800);
      moveCursor("demoCursor2", "110px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#000";
      document.getElementById("themePreviewText").style.color = "#fff";
      await wait(1000);
      moveCursor("demoCursor2", "160px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#F4EFE6";
      document.getElementById("themePreviewText").style.color = "#4A3F35";
      await wait(1000);
      moveCursor("demoCursor2", "210px", "140px", true);
      await wait(300);
      document.getElementById("demoScenesContainer").style.background = "#1A1A1A";
      document.getElementById("themePreviewText").style.color = "#E0E0E0";
      await wait(1500);
      scenes.themes.classList.remove("active");
      callouts.c2.classList.remove("show");
      await wait(400);

      // Scene 3
      scenes.reader.classList.add("active");
      callouts.c3.classList.add("show");
      document.getElementById("demoCountdown").style.display = "flex";
      document.getElementById("demoRsvpDisplay2").style.display = "none";
      const cText = document.getElementById("demoCountText");
      const cRing = document.getElementById("dRingProg");
      cText.textContent = "3"; cRing.style.strokeDashoffset = "0";
      await wait(500);
      cRing.style.strokeDashoffset = "283";
      await wait(1000);
      cText.textContent = "2"; cRing.style.strokeDashoffset = "0";
      await wait(50); cRing.style.strokeDashoffset = "283";
      await wait(1000);
      cText.textContent = "1"; cRing.style.strokeDashoffset = "0";
      await wait(50); cRing.style.strokeDashoffset = "283";
      await wait(1000);
      
      document.getElementById("demoCountdown").style.display = "none";
      document.getElementById("demoRsvpDisplay2").style.display = "grid";
      
      const words = ["We", "are", "ramping", "up", "the", "speed", "now.", "Focus", "on", "the", "center."];
      for(let w of words) {
         document.getElementById("dFocalPoint").textContent = w;
         await wait(200);
      }
      moveCursor("demoCursor3", "300px", "140px", true);
      await wait(100);
      document.getElementById("demoPauseGlyph").classList.add("show");
      await wait(400);
      document.getElementById("dFocalPoint").textContent = "speed";
      await wait(1500);
      scenes.reader.classList.remove("active");
      callouts.c3.classList.remove("show");
      await wait(400);

      // Scene 4
      scenes.scratch.classList.add("active");
      callouts.c4.classList.add("show");
      document.getElementById("demoQuote").classList.add("rotating");
      await wait(1500);
      moveCursor("demoCursor4", "200px", "140px", true);
      await wait(200);
      document.getElementById("demoQuote").classList.add("hidden");
      document.getElementById("demoPastedText").classList.add("show");
      await wait(2000);
      scenes.scratch.classList.remove("active");
      callouts.c4.classList.remove("show");
      await wait(400);

      // Scene 5
      scenes.outro.classList.add("active");
      iphoneFrame.className = "iphone-mockup zoomed-out";
      await wait(800);
      document.querySelector(".demo-outro-logo").classList.add("show");
      document.querySelector(".demo-outro-tagline").classList.add("show");
      document.querySelector(".demo-outro-badge").classList.add("show");
      
      await wait(4000);
      
      demoOverlay.style.display = "flex";
      setTimeout(() => demoOverlay.style.opacity = "1", 50);
      isPlayingDemo = false;
      iphoneFrame.className = "iphone-mockup";
      document.getElementById("demoScenesContainer").style.background = "var(--bg-color)";
      document.getElementById("demoBook1").classList.remove("swiped");
      document.getElementById("demoResumeSheet").classList.remove("open");
      document.getElementById("demoQuote").className = "demo-placeholder-quote";
      document.getElementById("demoQuote").classList.remove("rotating");
      document.getElementById("demoQuote").classList.remove("hidden");
      document.getElementById("demoPastedText").className = "demo-pasted-text";
      document.querySelector(".demo-outro-logo").classList.remove("show");
      document.querySelector(".demo-outro-tagline").classList.remove("show");
      document.querySelector(".demo-outro-badge").classList.remove("show");
      document.getElementById("demoPauseGlyph").classList.remove("show");
    }

    demoOverlay.addEventListener("click", () => {
      if(!isPlayingDemo) runDemoSequence();
    });
  }
  // PWA SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }
});
