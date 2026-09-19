import { Storage } from './storage.js';
import { AudioSystem } from './audio.js';
import { RSVP } from './rsvp.js';
import { Quotes } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
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
  const jumpBackBtn = document.getElementById('jumpBackBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const countdownHud = document.getElementById('countdownHud');
  const countdownText = document.getElementById('countdownText');
  const ringProgress = document.getElementById('ringProgress');
  const countdownAffirmation = document.getElementById('countdownAffirmation');
  
  const completionModal = document.getElementById('completionModal');
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
  const audioProfileSelect = document.getElementById('audioProfileSelect');
  const colorPaletteSelect = document.getElementById('colorPaletteSelect');
  const libraryList = document.getElementById('libraryList');
  const addDocBtn = document.getElementById('addDocBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');

  // Navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const navIndicator = document.getElementById('navIndicator');

  // State
  let state = Storage.load();
  let words = [];
  let isPlaying = false;
  let timerId = null;
  let editingBookId = null;
  let selectedColor = 'red';
  
  const defaultText = "Think in paragraphs, absorb in words, unlock in seconds.";

  // Utilities
  function getRandomQuote(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Quote Engine
  let emptyQuoteInterval;
  function startEmptyQuoteRotate() {
    emptyQuoteInterval = setInterval(() => {
      if(textInput.value.trim() === '') {
        textInput.placeholder = getRandomQuote(Quotes.emptyState);
      }
    }, 6000);
  }
  startEmptyQuoteRotate();

  // Initialize placeholder
  if (!textInput.value.trim()) {
    textInput.placeholder = getRandomQuote(Quotes.emptyState);
  }


  // Enforce Tier Visuals
  function enforceTierLimits() {
    wpmValue.textContent = wpmSlider.value;
    tierStatusText.textContent = state.isPro ? 'Current: Tachyon Prime' : 'Current: Free Starter';
    applyTheme();
    AudioSystem.profile = state.soundProfile;

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
    root.style.setProperty('--accent-color', `var(--palette-${state.colorPalette})`);
  }

  function showPaywall() {
    const targetTabBtn = document.querySelector('[data-target="tab-premium"]');
    if (targetTabBtn) targetTabBtn.click();
  }

  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      const originalText = upgradeBtn.textContent;
      upgradeBtn.textContent = 'Unlocking...';
      AudioSystem.init(); 
      setTimeout(() => {
        AudioSystem.playSuccessChime();
        state.isPro = true;
        Storage.save(state);
        enforceTierLimits();
        renderLibrary();
        upgradeBtn.textContent = originalText;
        
        const readerTabBtn = document.querySelector('[data-target="tab-reader"]');
        if (readerTabBtn) readerTabBtn.click();
      }, 1200);
    });
  }
  
  function showCompletion() {
    const wordsRead = words.length;
    const avgWpm = parseInt(wpmSlider.value, 10);
    
    // Average reading baseline is ~250 WPM
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
    if (state.currentIndex < words.length) {
      const currentWord = words[state.currentIndex];
      displayWord(currentWord);
      const wpm = parseInt(wpmSlider.value, 10);
      AudioSystem.playTick(wpm);
      
      state.currentIndex++;
      updateProgress();
      
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
    Storage.save(state);
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

  let isCountingDown = false;
  function startCountdown() {
    if (isCountingDown) return;
    isCountingDown = true;
    countdownHud.classList.remove('hidden');
    let count = 3;
    countdownText.textContent = count;
    ringProgress.classList.remove('ring-animating');
    ringProgress.style.strokeDashoffset = '283';
    countdownAffirmation.textContent = getRandomQuote(Quotes.countdown);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ringProgress.style.strokeDashoffset = '';
        ringProgress.classList.add('ring-animating');
      });
    });

    function tickCountdown() {
      if (count > 0) {
        countdownText.textContent = count;
        AudioSystem.playCountdownBeep(false);
        count--;
        setTimeout(tickCountdown, 1000);
      } else {
        countdownText.textContent = "";
        AudioSystem.playCountdownBeep(true);
        setTimeout(() => {
          countdownHud.classList.add('hidden');
          isCountingDown = false;
          play();
        }, 800);
      }
    }
    tickCountdown();
  }

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) stop();
    else if (state.currentIndex > 0 && state.currentIndex < words.length) startCountdown();
    else play();
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
    
    let rawText = textInput.value;
    let newWords = RSVP.parseText(rawText, defaultText);
    
    // Tier Lock: 500 word limit on paste
    if (!state.isPro && newWords.length > 500) {
      newWords = newWords.slice(0, 500);
      rawText = newWords.join(' ') + '... (Free Tier Limit Reached)';
      textInput.value = rawText;
      alert('With free you can only have 500 words max');
    }
    
    state.text = rawText;
    state.currentIndex = 0;
    words = newWords;
    updateProgress();
    
    if(words.length > 0) {
      displayWord(words[0]);
    } else {
      displayWord('');
      textInput.placeholder = getRandomQuote(Quotes.emptyState);
    }
    Storage.save(state);
  });

  wpmSlider.addEventListener('input', (e) => {
    state.wpm = e.target.value;
    enforceTierLimits();
    Storage.save(state);
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
    Storage.save(state);
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
    Storage.save(state);
  });

  tierToggleBtn.addEventListener('click', () => {
    state.isPro = !state.isPro;
    Storage.save(state);
    enforceTierLimits();
    renderLibrary();
    // Simulate toast
    const originalText = tierStatusText.textContent;
    tierStatusText.textContent = state.isPro ? "Simulating Prime" : "Simulating Free";
    tierStatusText.style.color = "var(--accent-color)";
    setTimeout(() => {
      tierStatusText.textContent = originalText;
      tierStatusText.style.color = "var(--text-secondary)";
    }, 1500);
  });

  audioProfileSelect.addEventListener('change', (e) => {
    state.soundProfile = e.target.value;
    AudioSystem.profile = state.soundProfile;
    Storage.save(state);
  });

  colorPaletteSelect.addEventListener('change', (e) => {
    state.colorPalette = e.target.value;
    applyTheme();
    Storage.save(state);
  });

  // Library Book Logic
  function renderLibrary() {
    libraryList.innerHTML = '';
    
    if (state.library.length === 0) {
      libraryList.innerHTML = '<div style="color: var(--text-secondary); font-size: 14px; text-align: center; padding: 20px;">Your library is empty.</div>';
    }
    
    state.library.forEach((doc) => {
      const el = document.createElement('div');
      el.className = 'lib-item';
      el.style.borderLeft = `4px solid var(--palette-${doc.color || 'red'})`;
      el.innerHTML = `
        <div style="flex: 1; padding-right: 12px; overflow: hidden; cursor: pointer;" class="lib-click-area">
          <h4 class="glow-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">${doc.title}</h4>
          <span style="font-size: 12px; color: var(--text-secondary);">${doc.content.split(' ').length} words</span>
        </div>
        <button class="btn secondary edit-btn" style="padding: 6px 12px; font-size: 12px; flex-shrink: 0; background: rgba(255,255,255,0.05); margin-right: 8px;">Edit</button>
      `;
      
      el.querySelector('.lib-click-area').addEventListener('click', () => {
        state.text = doc.content;
        textInput.value = state.text;
        textInput.dispatchEvent(new Event('input'));
        document.querySelector('[data-target="tab-reader"]').click();
      });
      
      el.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(doc.id);
      });
      
      libraryList.appendChild(el);
    });
  }

  addDocBtn.addEventListener('click', () => {
    if (!state.isPro && state.library.length >= 1) {
      alert('With free you can only have 1 book in your library');
      return;
    }
    openEditModal(null); // null means new book
  });

  // Edit Book Modal Logic
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
    });
  });

  function openEditModal(id) {
    if (id) {
      editingBookId = id;
      const book = state.library.find(b => b.id === id);
      editBookTitle.value = book.title;
      editBookContent.value = book.content;
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

  saveBookBtn.addEventListener('click', () => {
    let rawText = editBookContent.value;
    let wordCount = RSVP.parseText(rawText, "").length;
    
    // Tier Lock: 500 word limit on library save
    if (!state.isPro && wordCount > 500) {
      alert('With free you can only have 500 words max');
      rawText = RSVP.parseText(rawText, "").slice(0, 500).join(' ') + '... (Free Tier Limit Reached)';
      editBookContent.value = rawText; // update in modal so they see it
      return;
    }

    if (editingBookId) {
      const book = state.library.find(b => b.id === editingBookId);
      if (book) {
        book.title = editBookTitle.value;
        book.content = rawText;
        book.color = selectedColor;
      }
    } else {
      state.library.push({
        id: 'book_' + Date.now(),
        title: editBookTitle.value || 'Untitled',
        content: rawText,
        color: selectedColor
      });
    }
    
    Storage.save(state);
    renderLibrary();
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
    
    updateMuteIcon();
    

    words = RSVP.parseText(state.text, defaultText);
    enforceTierLimits();
    renderLibrary();
    updateProgress();
    if (words.length > 0) displayWord(words[state.currentIndex || 0]);
  }
  
  init();

  // Demo Video Logic
  const demoAdContainer = document.getElementById('demoAdContainer');
  const demoOverlay = document.getElementById('demoOverlay');
  const demoProgress = document.getElementById('demoProgress');
  const demoWordStart = document.getElementById('demoWordStart');
  const demoFocalPoint = document.getElementById('demoFocalPoint');
  const demoWordEnd = document.getElementById('demoWordEnd');
  
  if (demoAdContainer) {
    let demoWords = RSVP.parseText("You are now reading at five hundred words per minute. Without moving your eyes, your brain can process information at the speed of thought. This is the power of Rapid Serial Visual Presentation. Welcome to the future of reading.", "");
    let demoIndex = 0;
    let demoTimerId = null;
    let demoWpm = 500;
    let isPlayingDemo = false;
    
    const scenes = [
      document.getElementById('scene1'),
      document.getElementById('scene2'),
      document.getElementById('scene3'),
      document.getElementById('scene4'),
      document.getElementById('scene5'),
      document.getElementById('scene6'),
      document.getElementById('scene7'),
      document.getElementById('scene8'),
      document.getElementById('sceneRsvp'),
      document.getElementById('sceneOutro')
    ];
    
    function resetDemoScenes() {
      scenes.forEach(s => {
        if(s) {
          s.classList.remove('active', 'exit');
        }
      });
      demoProgress.style.width = '0%';
    }

    async function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function playScene(sceneIndex, holdTime) {
      const scene = scenes[sceneIndex];
      if(!scene) return;
      scene.classList.add('active');
      await wait(holdTime);
      scene.classList.remove('active');
      scene.classList.add('exit');
      await wait(800); // Wait for exit animation
    }

    async function runDemoSequence() {
      isPlayingDemo = true;
      demoOverlay.style.opacity = '0';
      await wait(500);
      demoOverlay.style.display = 'none';
      resetDemoScenes();
      
      if(!AudioSystem.isUnlocked) AudioSystem.init();

      // Kinetic Typography Sequence
      await playScene(0, 1500); // Meet Tachyon
      await playScene(1, 1500); // Traditional reading is slow
      await playScene(2, 1800); // Eyes waste time
      await playScene(3, 1200); // We fixed that
      await playScene(4, 2000); // Focus on red letter
      
      // Countdown
      AudioSystem.playCountdownBeep(false);
      await playScene(5, 500); // 3
      AudioSystem.playCountdownBeep(false);
      await playScene(6, 500); // 2
      AudioSystem.playCountdownBeep(false);
      await playScene(7, 500); // 1
      AudioSystem.playCountdownBeep(true);
      
      // Start RSVP
      scenes[8].classList.add('active');
      demoIndex = 0;
      runDemoWord();
    }
    
    function runDemoWord() {
      if (demoIndex >= demoWords.length) {
        // Finish RSVP
        scenes[8].classList.remove('active');
        scenes[8].classList.add('exit');
        setTimeout(() => {
          playScene(9, 2500).then(() => {
            // Reset to beginning
            demoOverlay.style.display = 'flex';
            setTimeout(() => demoOverlay.style.opacity = '1', 50);
            isPlayingDemo = false;
          });
        }, 800);
        return;
      }
      
      const word = demoWords[demoIndex];
      const formatted = RSVP.formatWord(word);
      demoWordStart.textContent = formatted.start;
      demoFocalPoint.textContent = formatted.focal;
      demoWordEnd.textContent = formatted.end;
      
      demoProgress.style.width = `${((demoIndex + 1) / demoWords.length) * 100}%`;
      
      const delay = RSVP.calculateDelay(word, demoWpm);
      demoIndex++;
      demoTimerId = setTimeout(runDemoWord, delay);
    }
    
    demoAdContainer.addEventListener('click', () => {
      if(!isPlayingDemo) {
        runDemoSequence();
      }
    });
  }

  // PWA SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }
});
