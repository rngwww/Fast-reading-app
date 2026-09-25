import { Storage } from './storage.js?v=28';
import { AudioSystem } from './audio.js?v=28';
import { RSVP } from './rsvp.js?v=28';
import { PreloadedLibrary, Quotes } from './data.js?v=28';

async function initApp() {
  // Main Container & Stage
  const modernApp = document.getElementById('modernApp');
  const readerStage = document.getElementById('readerStage');
  const wordPre = document.getElementById('wordPre');
  const wordFocal = document.getElementById('wordFocal');
  const wordPost = document.getElementById('wordPost');
  const gestureFeedbackLeft = document.getElementById('gestureFeedbackLeft');
  const gestureFeedbackRight = document.getElementById('gestureFeedbackRight');
  const stageBookBadge = document.getElementById('stageBookBadge');
  const stageBookTitle = document.getElementById('stageBookTitle');
  const tempoLed = document.getElementById('tempoLed');

  // Overlays
  const pauseHud = document.getElementById('pauseHud');
  const hudWordPos = document.getElementById('hudWordPos');
  const hudWordTotal = document.getElementById('hudWordTotal');
  const hudWpm = document.getElementById('hudWpm');
  const hudProgress = document.getElementById('hudProgress');
  const hudJumpBackBtn = document.getElementById('hudJumpBackBtn');
  const hudResumeBtn = document.getElementById('hudResumeBtn');

  const countdownHud = document.getElementById('countdownHud');
  const countdownCircleProg = document.getElementById('countdownCircleProg');
  const countdownNumber = document.getElementById('countdownNumber');
  const countdownAffirmation = document.getElementById('countdownAffirmation');

  // Scrubber
  const progressScrubber = document.getElementById('progressScrubber');
  const scrubberWordPos = document.getElementById('scrubberWordPos');
  const scrubberWordTotal = document.getElementById('scrubberWordTotal');
  const scrubberPct = document.getElementById('scrubberPct');

  // Primary Controls (YouTube Style Icon Only)
  const btnRewind10 = document.getElementById('btnRewind10');
  const btnPlayHero = document.getElementById('btnPlayHero');
  const btnPlayHeroIcon = document.getElementById('btnPlayHeroIcon');
  const btnSkip10 = document.getElementById('btnSkip10');
  const btnReset = document.getElementById('btnReset');

  // Speed Controls
  const speedBadgeVal = document.getElementById('speedBadgeVal');
  const btnSpeedMinus = document.getElementById('btnSpeedMinus');
  const btnSpeedPlus = document.getElementById('btnSpeedPlus');
  const speedPresetBtns = document.querySelectorAll('.speed-preset-btn');

  // Audio Controls
  const btnMute = document.getElementById('btnMute');
  const volIconSvg = document.getElementById('volIconSvg');
  const volSlider = document.getElementById('volSlider');

  // Text Input Panel & Motivational Quotes Overlay
  const textInput = document.getElementById('textInput');
  const quoteOverlay = document.getElementById('quoteOverlay');
  const quoteText = document.getElementById('quoteText');
  const btnPasteClipboard = document.getElementById('btnPasteClipboard');
  const btnClearText = document.getElementById('btnClearText');
  const readingEstimate = document.getElementById('readingEstimate');
  const tierWordLimitLabel = document.getElementById('tierWordLimitLabel');
  const returnScratchBtnWrap = document.getElementById('returnScratchBtnWrap');
  const returnScratchBtn = document.getElementById('returnScratchBtn');

  // Navigation
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const navSlidingPill = document.getElementById('navSlidingPill');

  // Library
  const libraryGrid = document.getElementById('libraryGrid');
  const btnAddBook = document.getElementById('btnAddBook');

  // Unified Book Details Modal (Read & Progress + Edit Tabs)
  const bookDetailModal = document.getElementById('bookDetailModal');
  const bookModalTitle = document.getElementById('bookModalTitle');
  const bookModalAuthor = document.getElementById('bookModalAuthor');
  const btnCloseBookDetailModal = document.getElementById('btnCloseBookDetailModal');
  const bookModalTabsNav = document.getElementById('bookModalTabsNav');
  const btnBookTabRead = document.getElementById('btnBookTabRead');
  const btnBookTabEdit = document.getElementById('btnBookTabEdit');
  const bookModalTabsSlider = document.getElementById('bookModalTabsSlider');
  const bookModalReadPanel = document.getElementById('bookModalReadPanel');
  const bookModalEditPanel = document.getElementById('bookModalEditPanel');

  // Read & Progress Panel Elements
  const launchTotalWords = document.getElementById('launchTotalWords');
  const launchProgressPct = document.getElementById('launchProgressPct');
  const launchEstTime = document.getElementById('launchEstTime');
  const launchProgressBar = document.getElementById('launchProgressBar');
  const needlePosLabel = document.getElementById('needlePosLabel');
  const needlePreviewBox = document.getElementById('needlePreviewBox');
  const btnLaunchResetProg = document.getElementById('btnLaunchResetProg');
  const btnLaunchRead = document.getElementById('btnLaunchRead');

  // Edit Details Panel Elements
  const editBookTitleInput = document.getElementById('editBookTitleInput');
  const editBookAuthorInput = document.getElementById('editBookAuthorInput');
  const editBookContentInput = document.getElementById('editBookContentInput');
  const modalColorDots = document.querySelectorAll('#modalColorDots .accent-dot');
  const btnSaveAddModal = document.getElementById('btnSaveAddModal');
  const btnDeleteCurrentBook = document.getElementById('btnDeleteCurrentBook');

  // About Modal & Brand Trigger
  const brandLockup = document.getElementById('brandLockup');
  const btnOpenAbout = document.getElementById('btnOpenAbout');
  const aboutModal = document.getElementById('aboutModal');
  const btnCloseAboutModal = document.getElementById('btnCloseAboutModal');

  const completionModal = document.getElementById('completionModal');
  const statWordsRead = document.getElementById('statWordsRead');
  const statTimeSaved = document.getElementById('statTimeSaved');
  const btnCloseCompletion = document.getElementById('btnCloseCompletion');

  // Settings
  const fontChoiceBtns = document.querySelectorAll('.font-choice-btn');
  const soundChips = document.querySelectorAll('.sound-chip');
  const themePickerCards = document.querySelectorAll('.theme-picker-card');
  const accentDots = document.querySelectorAll('#accentDots .accent-dot');
  const tierStatusBadge = document.getElementById('tierStatusBadge');
  const btnSwitchTier = document.getElementById('btnSwitchTier');
  const btnToggleUiSounds = document.getElementById('btnToggleUiSounds');

  // Prime
  const btnStartTrial = document.getElementById('btnStartTrial');
  const planCards = document.querySelectorAll('.plan-card');

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  let state = {
    wpm: 350,
    masterVolume: 0.3,
    isMuted: false,
    isPro: false,
    soundProfile: 'organic_pop',
    colorPalette: 'white',
    activeDocId: null,
    rsvpFont: 'sans',
    uiSoundsEnabled: true,
    appTheme: 'obsidian'
  };
  let currentBookMeta = null;
  let currentChunkWords = [];
  let currentChunkIndex = 0;
  let isPlaying = false;
  let timerId = null;
  let isCountingDown = false;
  let countdownIntervalId = null;
  let editingBookId = null;
  let selectedModalColor = 'white';
  let pendingLaunchDoc = null;
  let lastTapTime = 0;
  let lastTapSide = null;

  const defaultWelcomeText = "Welcome to TACHYON. Keep your gaze centered on the colored focal point. Let the words flow naturally.";

  // Unlock Web Audio immediately on first user interaction anywhere
  document.body.addEventListener('pointerdown', () => AudioSystem.init(), { once: true });
  document.body.addEventListener('keydown', () => AudioSystem.init(), { once: true });

  // Set default audio parameters synchronously so sound works right away
  AudioSystem.profile = state.soundProfile;
  AudioSystem.volume = state.masterVolume;
  AudioSystem.isMuted = state.isMuted;
  AudioSystem.uiSoundsEnabled = state.uiSoundsEnabled;

  // --------------------------------------------------------------------------
  // Theming, Font & Accent System
  // --------------------------------------------------------------------------
  function updateFocalColorAvailability() {
    const theme = state.appTheme || 'obsidian';
    const isDarkTheme = (theme === 'obsidian' || theme === 'graphite');
    const isLightTheme = (theme === 'vellum');

    // Rule: Cannot select black focal color with obsidian or graphite
    // Rule: Cannot select white focal color with Light mode (vellum)
    accentDots.forEach(dot => {
      const color = dot.dataset.color;
      let disabled = false;

      if (color === 'black' && isDarkTheme) {
        disabled = true;
      } else if (color === 'white' && isLightTheme) {
        disabled = true;
      }

      dot.classList.toggle('disabled', disabled);
      if (disabled) {
        dot.setAttribute('aria-disabled', 'true');
        dot.setAttribute('title', color === 'black' ? 'Black unavailable in dark themes' : 'White unavailable in light theme');
      } else {
        dot.removeAttribute('aria-disabled');
        dot.setAttribute('title', color.charAt(0).toUpperCase() + color.slice(1));
      }
    });

    // Auto-adjust if the user's active color clashes with the newly chosen theme
    if (state.colorPalette === 'black' && isDarkTheme) {
      state.colorPalette = 'white';
      Storage.saveSettings(state);
    } else if (state.colorPalette === 'white' && isLightTheme) {
      state.colorPalette = 'black';
      Storage.saveSettings(state);
    }
  }

  function applyTheme() {
    const root = document.documentElement;
    const theme = state.appTheme || 'obsidian';

    updateFocalColorAvailability();

    const accent = state.colorPalette || (theme === 'vellum' ? 'black' : 'white');

    document.body.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', `var(--palette-${accent})`);
    root.style.setProperty('--accent-glow', `color-mix(in srgb, var(--palette-${accent}) 35%, transparent)`);
    root.style.setProperty('--accent-soft', `color-mix(in srgb, var(--palette-${accent}) 14%, transparent)`);

    themePickerCards.forEach(card => {
      card.classList.toggle('active', card.dataset.theme === theme);
    });

    accentDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.color === accent);
    });
  }

  function applyFont(fontKey) {
    const root = document.documentElement;
    let selectedFont = 'var(--font-main)';
    if (fontKey === 'serif') selectedFont = 'var(--font-serif)';
    if (fontKey === 'mono') selectedFont = 'var(--font-mono)';

    root.style.setProperty('--rsvp-font', selectedFont);
    state.rsvpFont = fontKey;
    Storage.saveSettings(state);

    fontChoiceBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.font === fontKey);
    });
  }

  function applyTierMode() {
    if (state.isPro) {
      tierStatusBadge.textContent = 'TACHYON PRIME';
      tierStatusBadge.style.color = '#FFFFFF';
      if (tierWordLimitLabel) tierWordLimitLabel.textContent = 'Unlimited (Prime)';
      if (btnStartTrial) {
        btnStartTrial.textContent = 'Prime Member Active';
        btnStartTrial.style.opacity = '0.6';
        btnStartTrial.style.pointerEvents = 'none';
      }
    } else {
      tierStatusBadge.textContent = 'Free Starter';
      tierStatusBadge.style.color = 'var(--text-secondary)';
      if (tierWordLimitLabel) tierWordLimitLabel.textContent = 'Free Starter';
      if (btnStartTrial) {
        btnStartTrial.textContent = 'Start Free Trial';
        btnStartTrial.style.opacity = '1';
        btnStartTrial.style.pointerEvents = 'auto';
      }
    }
  }

  function updateUiSoundsBtn() {
    if (!btnToggleUiSounds) return;
    const enabled = state.uiSoundsEnabled !== false;
    AudioSystem.uiSoundsEnabled = enabled;
    btnToggleUiSounds.textContent = enabled ? 'Enabled' : 'Muted';
    btnToggleUiSounds.style.color = enabled ? 'var(--text-primary)' : 'var(--text-secondary)';
  }

  if (btnToggleUiSounds) {
    btnToggleUiSounds.addEventListener('click', () => {
      state.uiSoundsEnabled = !(state.uiSoundsEnabled !== false);
      AudioSystem.uiSoundsEnabled = state.uiSoundsEnabled;
      Storage.saveSettings(state);
      updateUiSoundsBtn();
      if (state.uiSoundsEnabled) {
        AudioSystem.playButtonPress();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Navigation & Sliding Pill Indicator
  // --------------------------------------------------------------------------
  function updateNavPill(activeBtn) {
    if (!activeBtn || !navSlidingPill) return;
    const container = activeBtn.parentElement;
    if (!container) return;
    const btnRect = activeBtn.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const l = btnRect.left - contRect.left;
    const w = btnRect.width;
    navSlidingPill.style.width = `${w}px`;
    navSlidingPill.style.transform = `translateX(${l}px)`;
  }

  function switchTab(targetId) {
    if (!targetId) return;
    try {
      AudioSystem.playTabSwitch();
    } catch (e) {
      console.warn("Tab switch audio failed:", e);
    }

    navTabBtns.forEach(b => {
      const isMatch = b.dataset.target === targetId;
      b.classList.toggle('active', isMatch);
    });

    const targetBtn = document.querySelector(`.nav-tab-btn[data-target="${targetId}"]`);
    if (targetBtn) {
      updateNavPill(targetBtn);
    }

    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === targetId);
    });

    if (targetId === 'tabLibrary') {
      try {
        renderLibrary();
      } catch (err) {
        console.warn("renderLibrary error:", err);
      }
    }
  }

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-tab-btn.active');
    if (active) updateNavPill(active);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const active = document.querySelector('.nav-tab-btn.active');
      if (active) updateNavPill(active);
    }, 120);
  });

  navTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      switchTab(targetId);
    });
  });

  // --------------------------------------------------------------------------
  // RSVP Word Rendering & Progress
  // --------------------------------------------------------------------------
  function displayWord(rawWord) {
    if (!rawWord || rawWord.trim() === '') {
      wordPre.textContent = '';
      wordFocal.textContent = '—';
      wordPost.textContent = '';
      return;
    }
    const formatted = RSVP.formatWord(rawWord);
    wordPre.textContent = formatted.start;
    wordFocal.textContent = formatted.focal;
    wordPost.textContent = formatted.end;
  }

  function updateScrubberAndStats() {
    if (!currentBookMeta) {
      scrubberWordPos.textContent = '0';
      scrubberWordTotal.textContent = '0';
      scrubberPct.textContent = '0%';
      progressScrubber.value = 0;
      progressScrubber.style.setProperty('--scrub-pct', '0%');
      return;
    }

    const currentPos = currentBookMeta.currentIndex || 0;
    const total = currentBookMeta.totalWords || 1;
    const pct = Math.min(100, Math.max(0, ((currentPos / total) * 100)));

    scrubberWordPos.textContent = currentPos.toLocaleString();
    scrubberWordTotal.textContent = total.toLocaleString();
    scrubberPct.textContent = `${pct.toFixed(0)}%`;
    progressScrubber.value = pct;
    progressScrubber.style.setProperty('--scrub-pct', `${pct}%`);

    // HUD sync
    hudWordPos.textContent = currentPos.toLocaleString();
    hudWordTotal.textContent = total.toLocaleString();
    hudWpm.textContent = state.wpm;
    hudProgress.textContent = `${pct.toFixed(0)}%`;
  }

  function updateStageBookBadge() {
    if (stageBookBadge) {
      if (currentBookMeta && currentBookMeta.id !== 'scratchpad' && currentBookMeta.title) {
        stageBookBadge.style.display = 'inline-flex';
        if (stageBookTitle) {
          stageBookTitle.textContent = currentBookMeta.title;
        } else {
          stageBookBadge.innerHTML = `<span>${escapeHtml(currentBookMeta.title)}</span>`;
        }
      } else {
        stageBookBadge.style.display = 'none';
      }
    }
  }

  // --------------------------------------------------------------------------
  // Playback Loop & Dynamic RSVP Pacing
  // --------------------------------------------------------------------------
  async function tick() {
    if (!isPlaying || !currentBookMeta) return;

    if (currentBookMeta.currentIndex >= currentBookMeta.totalWords) {
      await stop();
      showCompletionModal();
      return;
    }

    const neededChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
    if (neededChunkIndex !== currentChunkIndex || currentChunkWords.length === 0) {
      currentChunkIndex = neededChunkIndex;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, neededChunkIndex);
    }

    const indexInChunk = currentBookMeta.currentIndex % 1000;
    const currentWord = currentChunkWords[indexInChunk] || '';

    displayWord(currentWord);
    AudioSystem.playTick(state.wpm);

    currentBookMeta.currentIndex++;
    updateScrubberAndStats();

    // Periodic progress save
    if (currentBookMeta.currentIndex % 20 === 0) {
      await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
    }

    const delay = RSVP.calculateDelay(currentWord, state.wpm);
    timerId = setTimeout(tick, delay);
  }

  function setPlayButtonVisual(playing) {
    if (playing) {
      // Pause icon (two vertical bars)
      btnPlayHeroIcon.innerHTML = '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>';
      btnPlayHero.style.background = '#FFFFFF';
      btnPlayHero.style.color = '#000000';
    } else {
      // Play icon (triangle)
      btnPlayHeroIcon.innerHTML = '<polygon points="7 5 19 12 7 19 7 5" fill="currentColor"></polygon>';
      btnPlayHero.style.background = '#FFFFFF';
      btnPlayHero.style.color = '#000000';
    }
  }

  async function play() {
    if (!currentBookMeta) {
      await prepareScratchpad();
    }
    if (!currentBookMeta || currentBookMeta.totalWords === 0) return;

    if (currentBookMeta.currentIndex >= currentBookMeta.totalWords) {
      currentBookMeta.currentIndex = 0;
    }

    AudioSystem.init();
    isPlaying = true;
    setPlayButtonVisual(true);
    pauseHud.classList.remove('active');
    tick();
  }

  async function stop() {
    isPlaying = false;
    clearTimeout(timerId);
    setPlayButtonVisual(false);

    if (isCountingDown) {
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      isCountingDown = false;
      countdownHud.classList.remove('active');
    }

    if (currentBookMeta) {
      await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
    }
  }

  // --------------------------------------------------------------------------
  // 3-Second Resume Countdown Sequence (3, 2, 1, Read!) with iOS 14 Spinner
  // --------------------------------------------------------------------------
  function startCountdown(onComplete) {
    if (isCountingDown) return;
    isCountingDown = true;
    countdownHud.classList.add('active');

    let count = 3;
    const updateCountdownView = (step) => {
      if (countdownNumber) {
        countdownNumber.textContent = step;
        countdownNumber.classList.remove('pulse');
        void countdownNumber.offsetWidth;
        countdownNumber.classList.add('pulse');
      }
      if (countdownAffirmation) {
        if (step === 3) countdownAffirmation.textContent = 'Ready...';
        else if (step === 2) countdownAffirmation.textContent = 'Focus...';
        else if (step === 1) countdownAffirmation.textContent = 'Read!';
      }
      AudioSystem.playCountdownBeep(step === 1);
    };

    updateCountdownView(3);

    countdownIntervalId = setInterval(() => {
      count--;
      if (count > 0) {
        updateCountdownView(count);
      } else {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
        setTimeout(() => {
          isCountingDown = false;
          countdownHud.classList.remove('active');
          if (onComplete) onComplete();
        }, 150);
      }
    }, 1000);
  }

  // --------------------------------------------------------------------------
  // Word Jump Utilities (-10 / +10 words)
  // --------------------------------------------------------------------------
  async function jumpWords(delta) {
    if (!currentBookMeta) return;
    const newIndex = Math.max(0, Math.min(currentBookMeta.totalWords - 1, currentBookMeta.currentIndex + delta));
    currentBookMeta.currentIndex = newIndex;

    const neededChunkIndex = Math.floor(newIndex / 1000);
    if (neededChunkIndex !== currentChunkIndex) {
      currentChunkIndex = neededChunkIndex;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, neededChunkIndex);
    }

    const indexInChunk = newIndex % 1000;
    displayWord(currentChunkWords[indexInChunk] || '');
    updateScrubberAndStats();
    await Storage.updateBookProgress(currentBookMeta.id, newIndex);
    AudioSystem.playJump(delta > 0);
  }

  function triggerGestureFeedback(side, text) {
    const el = side === 'left' ? gestureFeedbackLeft : gestureFeedbackRight;
    el.innerHTML = text;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 600);
  }

  // --------------------------------------------------------------------------
  // Reader Stage Tap & Double-Tap Gestures
  // --------------------------------------------------------------------------
  readerStage.addEventListener('click', async (e) => {
    if (e.target.closest('.hud-actions') || e.target.closest('button')) return;

    const rect = readerStage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftSide = clickX < rect.width / 2;
    const now = Date.now();

    // Check for double-tap
    if (now - lastTapTime < 320 && lastTapSide === isLeftSide) {
      if (isLeftSide) {
        await jumpWords(-10);
        triggerGestureFeedback('left', '↺ -10');
      } else {
        await jumpWords(10);
        triggerGestureFeedback('right', '↻ +10');
      }
      lastTapTime = 0;
      return;
    }

    lastTapTime = now;
    lastTapSide = isLeftSide;

    // Single tap toggles play/pause
    setTimeout(async () => {
      if (Date.now() - lastTapTime >= 300 && lastTapTime !== 0) {
        if (isPlaying) {
          AudioSystem.playButtonPress();
          await stop();
          pauseHud.classList.add('active');
        } else if (pauseHud.classList.contains('active')) {
          pauseHud.classList.remove('active');
          startCountdown(() => play());
        } else {
          startCountdown(() => play());
        }
        lastTapTime = 0;
      }
    }, 310);
  });

  // HUD buttons
  hudJumpBackBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await jumpWords(-10);
  });

  hudResumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioSystem.playButtonPress();
    pauseHud.classList.remove('active');
    startCountdown(() => play());
  });

  // --------------------------------------------------------------------------
  // Interactive Progress Scrubber
  // --------------------------------------------------------------------------
  progressScrubber.addEventListener('input', async (e) => {
    if (!currentBookMeta || currentBookMeta.totalWords === 0) return;
    const pct = parseFloat(e.target.value);
    const targetIndex = Math.floor((pct / 100) * currentBookMeta.totalWords);
    currentBookMeta.currentIndex = Math.max(0, Math.min(currentBookMeta.totalWords - 1, targetIndex));

    const neededChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
    if (neededChunkIndex !== currentChunkIndex) {
      currentChunkIndex = neededChunkIndex;
      currentChunkWords = await Storage.getBookChunk(currentBookMeta.id, neededChunkIndex);
    }

    const indexInChunk = currentBookMeta.currentIndex % 1000;
    displayWord(currentChunkWords[indexInChunk] || '');
    updateScrubberAndStats();
  });

  progressScrubber.addEventListener('change', async () => {
    if (currentBookMeta) {
      await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
      AudioSystem.playUiTick();
    }
  });

  // --------------------------------------------------------------------------
  // Media Controls (YouTube Style Icon Only)
  // --------------------------------------------------------------------------
  btnPlayHero.addEventListener('click', async () => {
    AudioSystem.playButtonPress();
    if (isPlaying) {
      await stop();
      pauseHud.classList.add('active');
    } else if (pauseHud.classList.contains('active')) {
      pauseHud.classList.remove('active');
      startCountdown(() => play());
    } else {
      startCountdown(() => play());
    }
  });

  btnRewind10.addEventListener('click', async () => {
    await jumpWords(-10);
    triggerGestureFeedback('left', '↺ -10');
  });

  btnSkip10.addEventListener('click', async () => {
    await jumpWords(10);
    triggerGestureFeedback('right', '↻ +10');
  });

  btnReset.addEventListener('click', async () => {
    AudioSystem.playButtonPress();
    await stop();
    if (currentBookMeta) {
      currentBookMeta.currentIndex = 0;
      await Storage.updateBookProgress(currentBookMeta.id, 0);
      const firstChunk = await Storage.getBookChunk(currentBookMeta.id, 0);
      displayWord(firstChunk[0] || '');
      updateScrubberAndStats();
    }
    pauseHud.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // Speed Stepper & Presets
  // --------------------------------------------------------------------------
  function setWpm(newWpm) {
    const clamped = Math.max(100, Math.min(1200, Math.round(newWpm)));
    state.wpm = clamped;
    speedBadgeVal.textContent = clamped;

    const beatDuration = (60 / clamped).toFixed(2);
    document.documentElement.style.setProperty('--tempo-duration', `${beatDuration}s`);

    Storage.saveSettings(state);

    speedPresetBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.wpm, 10) === clamped);
    });

    updateReadingEstimate();
  }

  btnSpeedMinus.addEventListener('click', () => {
    AudioSystem.playPresetSelect();
    setWpm(state.wpm - 25);
  });

  btnSpeedPlus.addEventListener('click', () => {
    AudioSystem.playPresetSelect();
    setWpm(state.wpm + 25);
  });

  speedPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSystem.playPresetSelect();
      setWpm(parseInt(btn.dataset.wpm, 10));
    });
  });

  // --------------------------------------------------------------------------
  // Volume & Audio Controls
  // --------------------------------------------------------------------------
  function updateMuteVisual() {
    if (AudioSystem.isMuted || AudioSystem.volume === 0) {
      volIconSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      btnMute.style.opacity = '0.5';
    } else {
      volIconSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      btnMute.style.opacity = '1';
    }
  }

  volSlider.value = state.masterVolume !== undefined ? state.masterVolume : 0.3;
  updateMuteVisual();

  volSlider.addEventListener('input', (e) => {
    AudioSystem.init();
    const val = parseFloat(e.target.value);
    AudioSystem.volume = val;
    AudioSystem.isMuted = val === 0;
    state.masterVolume = val;
    state.isMuted = AudioSystem.isMuted;
    Storage.saveSettings(state);
    updateMuteVisual();
  });

  btnMute.addEventListener('click', () => {
    AudioSystem.init();
    AudioSystem.isMuted = !AudioSystem.isMuted;
    state.isMuted = AudioSystem.isMuted;
    Storage.saveSettings(state);
    updateMuteVisual();
    if (!AudioSystem.isMuted) {
      AudioSystem.playUiTick();
    }
  });

  // --------------------------------------------------------------------------
  // Text Input & Clipboard
  // --------------------------------------------------------------------------
  function updateReadingEstimate() {
    const text = textInput.value.trim();
    if (!text) {
      readingEstimate.textContent = '0 words';
      return;
    }
    const wordsCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const wpm = state.wpm || 350;
    const totalSeconds = Math.ceil((wordsCount / wpm) * 60);

    let timeStr = `${totalSeconds}s`;
    if (totalSeconds >= 60) {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      timeStr = `${mins}m ${secs}s`;
    }

    readingEstimate.textContent = `${wordsCount.toLocaleString()} words • ~${timeStr}`;
  }

  async function prepareScratchpad() {
    const text = textInput.value.trim() || defaultWelcomeText;
    const words = RSVP.parseText(text, defaultWelcomeText);
    await Storage.saveBook('scratchpad', 'Scratchpad', 'User Input', words, state.colorPalette || 'white');
    currentBookMeta = await Storage.getBookMeta('scratchpad');
    currentChunkIndex = 0;
    currentChunkWords = await Storage.getBookChunk('scratchpad', 0);
    displayWord(currentChunkWords[0] || '');
    updateScrubberAndStats();
    updateStageBookBadge();
  }

  // --------------------------------------------------------------------------
  // Scratchpad Motivational Quotes Engine (7-second rotation with fade)
  // --------------------------------------------------------------------------
  let quoteTimerId = null;
  let quoteIndex = 0;

  function updateQuoteDisplay(immediate = false) {
    if (!quoteOverlay || !quoteText) return;
    const isScratchpad = !state.activeDocId || state.activeDocId === 'scratchpad';
    const isEmpty = textInput.value.trim() === '';
    const isFocused = document.activeElement === textInput;

    if (isScratchpad && isEmpty && !isFocused) {
      const quoteList = Quotes && Quotes.emptyState ? Quotes.emptyState : [];
      if (quoteList.length === 0) return;

      if (immediate) {
        quoteText.textContent = quoteList[quoteIndex % quoteList.length];
        quoteOverlay.classList.remove('hidden');
        quoteOverlay.style.display = 'flex';
        quoteOverlay.style.opacity = '1';
      } else {
        quoteOverlay.style.opacity = '0';
        setTimeout(() => {
          const stillScratchpad = !state.activeDocId || state.activeDocId === 'scratchpad';
          if (stillScratchpad && textInput.value.trim() === '' && document.activeElement !== textInput) {
            quoteIndex = (quoteIndex + 1) % quoteList.length;
            quoteText.textContent = quoteList[quoteIndex % quoteList.length];
            quoteOverlay.classList.remove('hidden');
            quoteOverlay.style.display = 'flex';
            quoteOverlay.style.opacity = '1';
          }
        }, 400);
      }
    } else {
      quoteOverlay.style.opacity = '0';
      quoteOverlay.style.display = 'none';
      quoteOverlay.classList.add('hidden');
    }
  }

  function startQuoteRotation() {
    stopQuoteRotation();
    updateQuoteDisplay(true);
    quoteTimerId = setInterval(() => {
      updateQuoteDisplay(false);
    }, 6000);
  }

  function stopQuoteRotation() {
    if (quoteTimerId) {
      clearInterval(quoteTimerId);
      quoteTimerId = null;
    }
  }

  textInput.addEventListener('focus', () => {
    if (quoteOverlay) {
      quoteOverlay.style.opacity = '0';
      quoteOverlay.classList.add('hidden');
    }
    stopQuoteRotation();
  });

  textInput.addEventListener('blur', () => {
    if (textInput.value.trim() === '') {
      startQuoteRotation();
    }
  });

  if (quoteOverlay) {
    quoteOverlay.addEventListener('click', () => {
      textInput.focus();
    });
  }

  textInput.addEventListener('input', async () => {
    updateReadingEstimate();
    if (textInput.value.trim() !== '') {
      if (quoteOverlay) {
        quoteOverlay.style.opacity = '0';
        quoteOverlay.classList.add('hidden');
      }
      stopQuoteRotation();
    } else {
      startQuoteRotation();
    }
    if (!isPlaying) {
      await prepareScratchpad();
    }
  });

  btnPasteClipboard.addEventListener('click', async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) {
        textInput.value = clipText.trim();
        updateReadingEstimate();
        if (quoteOverlay) {
          quoteOverlay.style.opacity = '0';
          quoteOverlay.classList.add('hidden');
        }
        stopQuoteRotation();
        await prepareScratchpad();
        AudioSystem.playButtonPress();
      }
    } catch (err) {
      console.warn("Clipboard access denied or unsupported", err);
      textInput.focus();
    }
  });

  btnClearText.addEventListener('click', async () => {
    AudioSystem.playButtonPress();
    textInput.value = '';
    updateReadingEstimate();
    startQuoteRotation();
    await prepareScratchpad();
  });

  returnScratchBtn.addEventListener('click', async () => {
    AudioSystem.playButtonPress();
    state.activeDocId = 'scratchpad';
    await Storage.saveSettings(state);
    returnScratchBtnWrap.style.display = 'none';
    if (scratchpadWrap) scratchpadWrap.style.display = 'block';
    textInput.style.display = 'block';
    const inputFooter = document.getElementById('inputFooter') || document.querySelector('.input-footer');
    if (inputFooter) inputFooter.style.display = 'flex';
    const inputHeader = document.getElementById('inputHeader') || document.querySelector('.input-header');
    if (inputHeader) inputHeader.style.display = 'flex';

    if (textInput.value.trim() === '') {
      startQuoteRotation();
    } else {
      if (quoteOverlay) {
        quoteOverlay.style.opacity = '0';
        quoteOverlay.style.display = 'none';
        quoteOverlay.classList.add('hidden');
      }
      stopQuoteRotation();
    }
    await prepareScratchpad();
  });

  // --------------------------------------------------------------------------
  // Library Management with Persistent Deletions & Smooth Animations
  // --------------------------------------------------------------------------
  function getDeletedBookIds() {
    try {
      return JSON.parse(localStorage.getItem('tachyon_deleted_book_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  function markBookDeleted(id) {
    const deleted = getDeletedBookIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('tachyon_deleted_book_ids', JSON.stringify(deleted));
    }
    localStorage.setItem('tachyon_library_seeded', 'true');
  }

  async function ensurePreloadedBooks() {
    const isSeeded = localStorage.getItem('tachyon_library_seeded');
    if (isSeeded) return;

    const deletedIds = getDeletedBookIds();
    const existing = await Storage.getLibraryMeta();
    const existingIds = new Set(existing.map(b => b.id));

    for (const item of PreloadedLibrary) {
      if (!deletedIds.includes(item.id) && !existingIds.has(item.id)) {
        const words = RSVP.parseText(item.content, '');
        await Storage.saveBook(item.id, item.title, item.author, words, 'white');
      }
    }
    localStorage.setItem('tachyon_library_seeded', 'true');
  }

  async function renderLibrary() {
    await ensurePreloadedBooks();
    const metaList = await Storage.getLibraryMeta();
    libraryGrid.innerHTML = '';
    const books = metaList.filter(b => b.id !== 'scratchpad');

    if (books.length === 0) {
      libraryGrid.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-secondary);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <div style="font-size: 16px; font-weight: 300; margin-bottom: 4px; color: var(--text-primary);">Your Library is Empty</div>
          <div style="font-size: 13px; font-weight: 200;">Tap "+ Add Book" above to import or paste text.</div>
        </div>
      `;
      return;
    }

    books.forEach(book => {
      const item = document.createElement('div');
      item.className = 'book-card-item';
      item.dataset.id = book.id;

      const pct = book.totalWords > 0 ? Math.min(100, Math.round((book.currentIndex / book.totalWords) * 100)) : 0;
      const isComplete = pct >= 100;
      const ringOffset = 100.5 - (100.5 * (pct / 100));

      item.innerHTML = `
        <div class="book-swipe-delete-bg">
          <button class="btn-swipe-delete" data-id="${book.id}" aria-label="Delete ${escapeHtml(book.title)}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Delete</span>
          </button>
        </div>
        <div class="book-card" style="--card-color: var(--palette-${book.color || 'white'})">
          <div class="book-info">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-meta">
              <span>${escapeHtml(book.author || 'Unknown')}</span>
              <span>•</span>
              <span>${book.totalWords.toLocaleString()} words</span>
              <span>•</span>
              <span style="color: var(--text-primary); font-weight: 700;">${isComplete ? 'Finished' : `${pct}%`}</span>
            </div>
          </div>
          <div class="book-actions-group">
            <div class="book-ring-wrap" title="${pct}% read">
              <svg viewBox="0 0 40 40">
                <circle class="book-ring-bg" cx="20" cy="20" r="16"></circle>
                <circle class="book-ring-prog" cx="20" cy="20" r="16" stroke-dasharray="100.5" stroke-dashoffset="${ringOffset}"></circle>
              </svg>
              <span class="book-ring-val">${pct}%</span>
            </div>
          </div>
        </div>
      `;

      const cardEl = item.querySelector('.book-card');
      const deleteBtn = item.querySelector('.btn-swipe-delete');

      // Swipe gesture logic (touch & pointer for cross-device support)
      let startX = 0;
      let currentDiff = 0;
      let isSwiping = false;

      function handleSwipeStart(clientX) {
        startX = clientX;
        currentDiff = 0;
        isSwiping = true;
        cardEl.style.transition = 'none';
      }

      function handleSwipeMove(clientX) {
        if (!isSwiping) return;
        const diff = clientX - startX;
        if (diff < -12) {
          // Swiping left to reveal delete button - only show red background when swiped past threshold
          item.classList.add('is-swiping');
          currentDiff = Math.max(-90, diff);
          cardEl.style.transform = `translateX(${currentDiff}px)`;
        } else if (cardEl.classList.contains('swiped')) {
          item.classList.add('is-swiping');
          currentDiff = Math.min(0, -88 + diff);
          cardEl.style.transform = `translateX(${currentDiff}px)`;
        }
      }

      function handleSwipeEnd() {
        if (!isSwiping) return;
        isSwiping = false;
        cardEl.style.transition = 'transform 0.25s var(--spring-bouncy)';
        if (currentDiff < -45) {
          cardEl.style.transform = 'translateX(-88px)';
          cardEl.classList.add('swiped');
          item.classList.add('is-swiping');
        } else {
          cardEl.style.transform = 'translateX(0px)';
          cardEl.classList.remove('swiped');
          item.classList.remove('is-swiping');
        }
      }

      // Touch events (Mobile Safari / iOS)
      cardEl.addEventListener('touchstart', (e) => handleSwipeStart(e.touches[0].clientX), { passive: true });
      cardEl.addEventListener('touchmove', (e) => handleSwipeMove(e.touches[0].clientX), { passive: true });
      cardEl.addEventListener('touchend', handleSwipeEnd);

      // Pointer events (PC & mouse dragging)
      cardEl.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;
        handleSwipeStart(e.clientX);
        const onPointerMove = (pe) => handleSwipeMove(pe.clientX);
        const onPointerUp = () => {
          handleSwipeEnd();
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });

      // Tap on delete button smoothly collapses and removes book
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        AudioSystem.playButtonPress();
        item.classList.add('deleting');
        markBookDeleted(book.id);
        setTimeout(async () => {
          await Storage.deleteBook(book.id);
          if (state.activeDocId === book.id) {
            await loadBook('scratchpad');
          }
          renderLibrary();
        }, 280);
      });

      // Tap on card opens the unified book modal (Read from here & Edit details)
      cardEl.addEventListener('click', (e) => {
        if (e.target.closest('.btn-swipe-delete')) return;
        if (cardEl.classList.contains('swiped')) {
          cardEl.style.transform = 'translateX(0px)';
          cardEl.classList.remove('swiped');
          item.classList.remove('is-swiping');
          return;
        }
        openBookDetailModal(book);
      });

      libraryGrid.appendChild(item);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  async function loadBook(bookId) {
    if (isPlaying) {
      await stop();
    }
    pauseHud.classList.remove('active');
    countdownHud.classList.remove('active');
    isCountingDown = false;

    state.activeDocId = bookId;
    await Storage.saveSettings(state);

    currentBookMeta = await Storage.getBookMeta(bookId);
    if (!currentBookMeta) return;

    currentChunkIndex = Math.floor((currentBookMeta.currentIndex || 0) / 1000);
    currentChunkWords = await Storage.getBookChunk(bookId, currentChunkIndex);
    if (!currentChunkWords || currentChunkWords.length === 0) {
      currentChunkIndex = 0;
      currentChunkWords = (await Storage.getBookChunk(bookId, 0)) || [];
    }

    if (bookId !== 'scratchpad') {
      textInput.style.display = 'none';
      if (scratchpadWrap) scratchpadWrap.style.display = 'none';
      stopQuoteRotation();
      if (quoteOverlay) {
        quoteOverlay.style.opacity = '0';
        quoteOverlay.style.display = 'none';
        quoteOverlay.classList.add('hidden');
      }
      const inputFooter = document.getElementById('inputFooter') || document.querySelector('.input-footer');
      if (inputFooter) inputFooter.style.display = 'none';
      const inputHeader = document.getElementById('inputHeader') || document.querySelector('.input-header');
      if (inputHeader) inputHeader.style.display = 'none';
      returnScratchBtnWrap.style.display = 'block';
    } else {
      textInput.style.display = 'block';
      if (scratchpadWrap) scratchpadWrap.style.display = 'block';
      const inputFooter = document.getElementById('inputFooter') || document.querySelector('.input-footer');
      if (inputFooter) inputFooter.style.display = 'flex';
      const inputHeader = document.getElementById('inputHeader') || document.querySelector('.input-header');
      if (inputHeader) inputHeader.style.display = 'flex';
      returnScratchBtnWrap.style.display = 'none';
      if (textInput.value.trim() === '') {
        startQuoteRotation();
      }
    }

    const indexInChunk = (currentBookMeta.currentIndex || 0) % 1000;
    displayWord(currentChunkWords[indexInChunk] || '');
    updateScrubberAndStats();
    updateStageBookBadge();

    // Switch to Reader tab
    switchTab('tabReader');
  }

  // --------------------------------------------------------------------------
  // Launch Modal & Starting Needle Text Selector
  // --------------------------------------------------------------------------
  let pendingNeedleIndex = 0;

  function updateNeedleStats() {
    if (!pendingLaunchDoc) return;
    const total = pendingLaunchDoc.totalWords || 1;
    const pct = Math.min(100, Math.round((pendingNeedleIndex / total) * 100));
    if (launchProgressPct) launchProgressPct.textContent = `${pct}%`;
    if (launchProgressBar) launchProgressBar.style.width = `${pct}%`;
    if (needlePosLabel) {
      needlePosLabel.textContent = `Word ${pendingNeedleIndex.toLocaleString()} (${pct}%)`;
    }
  }

  async function renderNeedlePreview(book) {
    if (!needlePreviewBox) return;
    needlePreviewBox.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 14px;">Loading excerpt...</div>';

    const chunkIdx = Math.floor(pendingNeedleIndex / 1000);
    let words = await Storage.getBookChunk(book.id, chunkIdx);
    if (!words || words.length === 0) {
      words = await Storage.getBookChunk(book.id, 0);
    }
    if (!words || words.length === 0) {
      needlePreviewBox.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 14px;">No preview text available</div>';
      return;
    }

    const chunkBase = chunkIdx * 1000;
    needlePreviewBox.innerHTML = '';
    const fragment = document.createDocumentFragment();

    words.forEach((w, localIdx) => {
      const globalIdx = chunkBase + localIdx;
      const span = document.createElement('span');
      span.className = 'needle-word' + (globalIdx === pendingNeedleIndex ? ' needle-active' : '');
      span.textContent = w + ' ';
      span.dataset.idx = globalIdx;

      span.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioSystem.playButtonPress();
        pendingNeedleIndex = globalIdx;
        needlePreviewBox.querySelectorAll('.needle-word.needle-active').forEach(el => el.classList.remove('needle-active'));
        span.classList.add('needle-active');
        updateNeedleStats();
      });

      fragment.appendChild(span);
    });

    needlePreviewBox.appendChild(fragment);

    setTimeout(() => {
      const activeEl = needlePreviewBox.querySelector('.needle-word.needle-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  // --------------------------------------------------------------------------
  // Unified Book Details Modal (Read & Progress + Edit Tabs)
  // --------------------------------------------------------------------------
  function switchBookModalTab(tabName) {
    if (tabName === 'read') {
      btnBookTabRead.classList.add('active');
      btnBookTabEdit.classList.remove('active');
      if (bookModalTabsSlider) bookModalTabsSlider.classList.remove('show-edit');
    } else {
      btnBookTabEdit.classList.add('active');
      btnBookTabRead.classList.remove('active');
      if (bookModalTabsSlider) bookModalTabsSlider.classList.add('show-edit');
    }
  }

  if (btnBookTabRead) {
    btnBookTabRead.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      switchBookModalTab('read');
    });
  }

  if (btnBookTabEdit) {
    btnBookTabEdit.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      switchBookModalTab('edit');
    });
  }

  if (btnDeleteCurrentBook) {
    btnDeleteCurrentBook.addEventListener('click', async () => {
      if (!pendingLaunchDoc) return;
      const bookId = pendingLaunchDoc.id;
      AudioSystem.playButtonPress();
      markBookDeleted(bookId);
      closeBookDetailModal();

      const card = document.querySelector(`.book-card-item[data-id="${bookId}"]`);
      if (card) {
        card.classList.add('deleting');
      }

      setTimeout(async () => {
        await Storage.deleteBook(bookId);
        if (state.activeDocId === bookId) {
          await loadBook('scratchpad');
        }
        renderLibrary();
      }, 280);
    });
  }

  async function openBookDetailModal(book) {
    AudioSystem.playModalOpen();
    pendingLaunchDoc = book;

    if (book) {
      editingBookId = book.id;
      pendingNeedleIndex = book.currentIndex || 0;

      bookModalTitle.textContent = book.title;
      bookModalAuthor.textContent = book.author || 'Unknown';
      bookModalAuthor.style.display = 'block';

      launchTotalWords.textContent = (book.totalWords || 0).toLocaleString();
      const wpm = state.wpm || 350;
      const estMins = Math.max(1, Math.ceil((book.totalWords || 0) / wpm));
      if (launchEstTime) launchEstTime.textContent = `~${estMins}m`;

      updateNeedleStats();
      await renderNeedlePreview(book);

      editBookTitleInput.value = book.title || '';
      editBookAuthorInput.value = book.author || '';
      editBookContentInput.value = 'Loading book content...';

      selectedModalColor = book.color || 'white';
      modalColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === selectedModalColor));
      btnSaveAddModal.textContent = 'Save Changes';
      if (btnDeleteCurrentBook) btnDeleteCurrentBook.style.display = 'flex';

      bookModalTabsNav.style.display = 'flex';
      switchBookModalTab('read');

      Storage.getAllBookWords(book.id).then(words => {
        if (editingBookId === book.id) {
          editBookContentInput.value = words.join(' ');
        }
      }).catch(err => {
        console.warn("Could not load book text for edit:", err);
        if (editingBookId === book.id) {
          editBookContentInput.value = '';
        }
      });
    } else {
      editingBookId = null;
      pendingNeedleIndex = 0;

      bookModalTitle.textContent = 'Add New Book';
      bookModalAuthor.style.display = 'none';

      editBookTitleInput.value = '';
      editBookAuthorInput.value = '';
      editBookContentInput.value = '';

      selectedModalColor = 'white';
      modalColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === 'white'));
      btnSaveAddModal.textContent = 'Add to Library';
      if (btnDeleteCurrentBook) btnDeleteCurrentBook.style.display = 'none';

      bookModalTabsNav.style.display = 'none';
      switchBookModalTab('edit');
    }

    bookDetailModal.classList.add('active');
  }

  function closeBookDetailModal() {
    AudioSystem.playModalClose();
    bookDetailModal.classList.remove('active');
    pendingLaunchDoc = null;
    editingBookId = null;
  }

  if (btnCloseBookDetailModal) {
    btnCloseBookDetailModal.addEventListener('click', closeBookDetailModal);
  }
  if (bookDetailModal) {
    bookDetailModal.addEventListener('click', (e) => {
      if (e.target === bookDetailModal) closeBookDetailModal();
    });
  }

  btnLaunchResetProg.addEventListener('click', async () => {
    if (!pendingLaunchDoc) return;
    AudioSystem.playButtonPress();
    pendingNeedleIndex = 0;
    updateNeedleStats();
    if (needlePreviewBox) {
      needlePreviewBox.querySelectorAll('.needle-word.needle-active').forEach(el => el.classList.remove('needle-active'));
      const firstWord = needlePreviewBox.querySelector('.needle-word[data-idx="0"]');
      if (firstWord) {
        firstWord.classList.add('needle-active');
        firstWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    await Storage.updateBookProgress(pendingLaunchDoc.id, 0);
  });

  btnLaunchRead.addEventListener('click', async () => {
    if (!pendingLaunchDoc) return;
    AudioSystem.playModalClose();
    pendingLaunchDoc.currentIndex = pendingNeedleIndex;
    await Storage.updateBookProgress(pendingLaunchDoc.id, pendingNeedleIndex);
    bookDetailModal.classList.remove('active');
    await loadBook(pendingLaunchDoc.id);
  });

  // --------------------------------------------------------------------------
  // About Tachyon Modal
  // --------------------------------------------------------------------------
  function openAboutModal() {
    AudioSystem.playModalOpen();
    if (aboutModal) aboutModal.classList.add('active');
  }

  function closeAboutModal() {
    AudioSystem.playModalClose();
    if (aboutModal) aboutModal.classList.remove('active');
  }

  if (brandLockup) brandLockup.addEventListener('click', openAboutModal);
  if (btnOpenAbout) btnOpenAbout.addEventListener('click', openAboutModal);
  if (btnCloseAboutModal) btnCloseAboutModal.addEventListener('click', closeAboutModal);
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeAboutModal();
    });
  }

  btnAddBook.addEventListener('click', () => {
    openBookDetailModal(null);
  });

  modalColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      modalColorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedModalColor = dot.dataset.color;
    });
  });

  btnSaveAddModal.addEventListener('click', async () => {
    const title = editBookTitleInput.value.trim() || 'Untitled';
    const author = editBookAuthorInput.value.trim() || 'Unknown';
    const content = editBookContentInput.value.trim();

    if (!content) {
      alert("Please enter text.");
      return;
    }

    const words = RSVP.parseText(content, '');
    const id = editingBookId || `doc_${Date.now()}`;

    await Storage.saveBook(id, title, author, words, selectedModalColor);

    if (editingBookId) {
      pendingLaunchDoc = await Storage.getBookMeta(id);
      bookModalTitle.textContent = title;
      bookModalAuthor.textContent = author;
      launchTotalWords.textContent = words.length.toLocaleString();
      updateNeedleStats();
      await renderNeedlePreview(pendingLaunchDoc);
      switchBookModalTab('read');

      if (currentBookMeta && currentBookMeta.id === id) {
        await loadBook(id);
      }
    } else {
      closeBookDetailModal();
    }

    renderLibrary();
    AudioSystem.playSuccessChime();
  });

  // --------------------------------------------------------------------------
  // Settings Tab Interactions
  // --------------------------------------------------------------------------
  fontChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      applyFont(btn.dataset.font);
    });
  });

  soundChips.forEach(chip => {
    chip.addEventListener('click', () => {
      soundChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const profile = chip.dataset.profile;
      state.soundProfile = profile;
      AudioSystem.profile = profile;
      Storage.saveSettings(state);

      AudioSystem.init();
      AudioSystem.playTick(state.wpm);
    });
  });

  themePickerCards.forEach(card => {
    card.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      state.appTheme = card.dataset.theme;
      Storage.saveSettings(state);
      applyTheme();
    });
  });

  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.dataset.color;
      const theme = state.appTheme || 'obsidian';
      const isDarkTheme = (theme === 'obsidian' || theme === 'graphite');
      const isLightTheme = (theme === 'vellum');

      if (color === 'black' && isDarkTheme) {
        return; // Prohibited: black with dark theme
      }
      if (color === 'white' && isLightTheme) {
        return; // Prohibited: white with Light mode
      }

      AudioSystem.playButtonPress();
      state.colorPalette = color;
      Storage.saveSettings(state);
      applyTheme();
    });
  });

  btnSwitchTier.addEventListener('click', () => {
    state.isPro = !state.isPro;
    Storage.saveSettings(state);
    applyTierMode();
    AudioSystem.playSuccessChime();
  });

  // --------------------------------------------------------------------------
  // Premium Tab Interactions
  // --------------------------------------------------------------------------
  planCards.forEach(card => {
    card.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      planCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  if (btnStartTrial) {
    btnStartTrial.addEventListener('click', () => {
      btnStartTrial.textContent = 'Unlocking...';
      AudioSystem.init();
      setTimeout(() => {
        state.isPro = true;
        Storage.saveSettings(state);
        applyTierMode();
        AudioSystem.playSuccessChime();
        btnStartTrial.textContent = 'Prime Active';

        const readerTab = document.querySelector('[data-target="tabReader"]');
        if (readerTab) readerTab.click();
      }, 800);
    });
  }

  // --------------------------------------------------------------------------
  // Session Completion Modal
  // --------------------------------------------------------------------------
  function showCompletionModal() {
    AudioSystem.playSuccessChime();
    const wordsAbsorbed = currentBookMeta ? currentBookMeta.totalWords : 0;
    const timeSavedSeconds = Math.round(wordsAbsorbed / 3);

    statWordsRead.textContent = wordsAbsorbed.toLocaleString();
    statTimeSaved.textContent = `${timeSavedSeconds}s`;

    completionModal.classList.add('active');
  }

  btnCloseCompletion.addEventListener('click', () => {
    AudioSystem.playModalClose();
    completionModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // Initial Boot Sequence
  // --------------------------------------------------------------------------
  try {
    await Storage.initDB();
    await ensurePreloadedBooks();
    const saved = await Storage.loadSettings();
    if (saved) {
      state = { ...state, ...saved };
    }
  } catch (err) {
    console.warn("Storage settings load failed, continuing with defaults:", err);
  }

  // Audio setup after settings loaded
  AudioSystem.profile = state.soundProfile || 'organic_pop';
  AudioSystem.volume = state.masterVolume !== undefined ? state.masterVolume : 0.3;
  AudioSystem.isMuted = state.isMuted || false;
  AudioSystem.uiSoundsEnabled = state.uiSoundsEnabled !== false;
  if (volSlider) volSlider.value = AudioSystem.volume;
  updateMuteVisual();

  applyTheme();
  applyTierMode();
  updateUiSoundsBtn();
  applyFont(state.rsvpFont || 'sans');
  setWpm(state.wpm || 350);

  // Active sound chip setup
  soundChips.forEach(c => {
    c.classList.toggle('active', c.dataset.profile === (state.soundProfile || 'organic_pop'));
  });

  // Initial nav pill positioning
  const firstActiveTab = document.querySelector('.nav-tab-btn.active');
  if (firstActiveTab) {
    updateNavPill(firstActiveTab);
    setTimeout(() => updateNavPill(firstActiveTab), 100);
  }

  // Live iOS 14 Status Bar Clock
  const iosStatusTime = document.getElementById('iosStatusTime');
  if (iosStatusTime) {
    function updateIosClock() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      iosStatusTime.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
    updateIosClock();
    setInterval(updateIosClock, 10000);
  }

  // Load active book or scratchpad
  try {
    if (state.activeDocId && state.activeDocId !== 'scratchpad') {
      await loadBook(state.activeDocId);
    } else {
      await prepareScratchpad();
      if (textInput.value.trim() === '') {
        startQuoteRotation();
      }
    }
  } catch (err) {
    console.warn("Could not load book/scratchpad, showing welcome text:", err);
    displayWord("READY");
  }

  updateReadingEstimate();
  window.__appInitialized = true;
  console.log("TACHYON Modern v25 Initialized Successfully!");
}

// Reliable boot trigger
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
