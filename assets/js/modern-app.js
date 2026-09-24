import { Storage } from './storage.js?v=22';
import { AudioSystem } from './audio.js?v=22';
import { RSVP } from './rsvp.js?v=22';
import { Quotes, PreloadedLibrary } from './data.js?v=22';

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
  const btnZenToggle = document.getElementById('btnZenToggle');
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
  const countdownNumber = document.getElementById('countdownNumber');
  const ringActive = document.getElementById('ringActive');
  const countdownAffirmation = document.getElementById('countdownAffirmation');

  // Scrubber
  const progressScrubber = document.getElementById('progressScrubber');
  const scrubberWordPos = document.getElementById('scrubberWordPos');
  const scrubberWordTotal = document.getElementById('scrubberWordTotal');
  const scrubberPct = document.getElementById('scrubberPct');

  // Primary Controls
  const btnRewind10 = document.getElementById('btnRewind10');
  const btnPlayHero = document.getElementById('btnPlayHero');
  const btnPlayHeroText = document.getElementById('btnPlayHeroText');
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

  // Text Input Panel & Sample Chips
  const textInput = document.getElementById('textInput');
  const textareaQuoteHint = document.getElementById('textareaQuoteHint');
  const btnPasteClipboard = document.getElementById('btnPasteClipboard');
  const btnClearText = document.getElementById('btnClearText');
  const readingEstimate = document.getElementById('readingEstimate');
  const tierWordLimitLabel = document.getElementById('tierWordLimitLabel');
  const returnScratchBtnWrap = document.getElementById('returnScratchBtnWrap');
  const returnScratchBtn = document.getElementById('returnScratchBtn');
  const sampleChips = document.querySelectorAll('.sample-chip');

  // Navigation
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const navSlidingPill = document.getElementById('navSlidingPill');

  // Library
  const libraryGrid = document.getElementById('libraryGrid');
  const btnAddBook = document.getElementById('btnAddBook');

  // Modals
  const shortcutsModal = document.getElementById('shortcutsModal');
  const btnOpenShortcuts = document.getElementById('btnOpenShortcuts');
  const btnCloseShortcutsModal = document.getElementById('btnCloseShortcutsModal');
  const btnCloseShortcutsBtn = document.getElementById('btnCloseShortcutsBtn');

  const addBookModal = document.getElementById('addBookModal');
  const bookModalTitle = document.getElementById('bookModalTitle');
  const editBookTitleInput = document.getElementById('editBookTitleInput');
  const editBookAuthorInput = document.getElementById('editBookAuthorInput');
  const editBookContentInput = document.getElementById('editBookContentInput');
  const btnCloseAddModal = document.getElementById('btnCloseAddModal');
  const btnCancelAddModal = document.getElementById('btnCancelAddModal');
  const btnSaveAddModal = document.getElementById('btnSaveAddModal');
  const modalColorDots = document.querySelectorAll('#modalColorDots .accent-dot');

  const launchModal = document.getElementById('launchModal');
  const launchTitle = document.getElementById('launchTitle');
  const launchAuthor = document.getElementById('launchAuthor');
  const launchTotalWords = document.getElementById('launchTotalWords');
  const launchProgressPct = document.getElementById('launchProgressPct');
  const launchStartSlider = document.getElementById('launchStartSlider');
  const launchSliderLabel = document.getElementById('launchSliderLabel');
  const btnLaunchRead = document.getElementById('btnLaunchRead');
  const btnLaunchResetProg = document.getElementById('btnLaunchResetProg');
  const btnCloseLaunchModal = document.getElementById('btnCloseLaunchModal');

  const completionModal = document.getElementById('completionModal');
  const statWordsRead = document.getElementById('statWordsRead');
  const statTimeSaved = document.getElementById('statTimeSaved');
  const completionQuote = document.getElementById('completionQuote');
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
    colorPalette: 'red',
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
  let selectedModalColor = 'red';
  let pendingLaunchDoc = null;
  let lastTapTime = 0;
  let lastTapSide = null;
  let isZenMode = false;

  const defaultWelcomeText = "Welcome to TACHYON modern focus edition. Keep your gaze centered on the colored focal point. Let the concepts form naturally in your mind. Read faster than thought.";

  // Sample texts database
  const sampleTexts = {
    lore: "TACHYON eliminates eye saccades and reduces subvocalization. At speeds above 400 words per minute, your inner auditory voice dissolves into pure, direct comprehension. The mind absorbs thought at optical velocity.",
    aurelius: "Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself. For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul, particularly when he has within him such thoughts that by looking into them he is immediately in perfect tranquility.",
    einstein: "Geometry sets out from certain conceptions such as plane, point, and straight line, with which we are able to associate more or less definite ideas, and from certain simple propositions which we are inclined to accept as true. Then, on the basis of a logical process, all remaining propositions are shown to follow from those axioms. Geometrical ideas correspond to more or less exact objects in nature.",
    holmes: "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions were abhorrent to his cold, precise but admirably balanced mind."
  };

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
  function applyTheme() {
    const root = document.documentElement;
    const theme = state.appTheme || 'obsidian';
    const accent = state.colorPalette || 'red';

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
      tierStatusBadge.style.color = '#ffd700';
      if (tierWordLimitLabel) tierWordLimitLabel.textContent = 'Unlimited (Prime Active)';
      if (btnStartTrial) {
        btnStartTrial.textContent = 'Prime Member Active';
        btnStartTrial.style.opacity = '0.6';
        btnStartTrial.style.pointerEvents = 'none';
      }
    } else {
      tierStatusBadge.textContent = 'Free Starter';
      tierStatusBadge.style.color = 'var(--text-secondary)';
      if (tierWordLimitLabel) tierWordLimitLabel.textContent = 'Max 500 words on Free';
      if (btnStartTrial) {
        btnStartTrial.textContent = 'Start 7-Day Free Trial';
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
    btnToggleUiSounds.style.color = enabled ? 'var(--accent)' : 'var(--text-secondary)';
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
    navSlidingPill.style.width = `${activeBtn.offsetWidth}px`;
    navSlidingPill.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
  }

  navTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSystem.playTabSwitch();
      navTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateNavPill(btn);

      const targetId = btn.dataset.target;
      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
      });

      if (targetId === 'tabLibrary') {
        renderLibrary();
      }
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
      const title = currentBookMeta ? currentBookMeta.title : 'Scratchpad';
      stageBookBadge.innerHTML = `<span>📖 ${escapeHtml(title)}</span>`;
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
      btnPlayHeroText.textContent = 'Pause';
      btnPlayHeroIcon.innerHTML = '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';
      btnPlayHero.style.background = 'var(--bg-surface-elevated)';
      btnPlayHero.style.border = '1px solid var(--border-strong)';
      btnPlayHero.style.color = 'var(--text-primary)';
      if (tempoLed) tempoLed.classList.add('active');
      if (isZenMode) modernApp.classList.add('zen-mode');
    } else {
      btnPlayHeroText.textContent = 'Play';
      btnPlayHeroIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      btnPlayHero.style.background = 'var(--accent)';
      btnPlayHero.style.border = 'none';
      btnPlayHero.style.color = '#fff';
      if (tempoLed) tempoLed.classList.remove('active');
      modernApp.classList.remove('zen-mode');
    }
  }

  async function play() {
    if (!currentBookMeta) {
      await prepareScratchpad();
    }
    if (!currentBookMeta || currentBookMeta.totalWords === 0) return;

    // Free tier limitation check
    if (!state.isPro && currentBookMeta.totalWords > 500) {
      alert("This text exceeds the 500-word limit for the Free tier. Switch to Tachyon Prime in Settings or upgrade in the Prime tab to read full books!");
      return;
    }

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
      clearInterval(countdownIntervalId);
      isCountingDown = false;
      countdownHud.classList.remove('active');
    }

    if (currentBookMeta) {
      await Storage.updateBookProgress(currentBookMeta.id, currentBookMeta.currentIndex);
    }
  }

  // --------------------------------------------------------------------------
  // Countdown Ring (3, 2, 1, Lock In)
  // --------------------------------------------------------------------------
  function startCountdown(onComplete) {
    if (isCountingDown) return;
    isCountingDown = true;
    countdownHud.classList.add('active');

    let count = 3;
    countdownNumber.textContent = count;
    ringActive.style.strokeDashoffset = 0;
    countdownAffirmation.textContent = Quotes.countdown[Math.floor(Math.random() * Quotes.countdown.length)] || 'Lock In';
    AudioSystem.playCountdownBeep(false);

    const circumference = 283;
    ringActive.style.transition = 'stroke-dashoffset 1s linear';
    ringActive.style.strokeDashoffset = (circumference * (3 - count + 1)) / 3;

    countdownIntervalId = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumber.textContent = count;
        ringActive.style.strokeDashoffset = (circumference * (3 - count + 1)) / 3;
        AudioSystem.playCountdownBeep(false);
      } else {
        clearInterval(countdownIntervalId);
        isCountingDown = false;
        countdownHud.classList.remove('active');
        AudioSystem.playCountdownBeep(true);
        if (onComplete) onComplete();
      }
    }, 900);
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
    if (e.target.closest('.hud-actions') || e.target.closest('button') || e.target.closest('.stage-top-toolbar')) return;

    const rect = readerStage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftSide = clickX < rect.width / 2;
    const now = Date.now();

    // Check for double-tap
    if (now - lastTapTime < 320 && lastTapSide === isLeftSide) {
      if (isLeftSide) {
        await jumpWords(-10);
        triggerGestureFeedback('left', '↺ -10 Words');
      } else {
        await jumpWords(10);
        triggerGestureFeedback('right', '↻ +10 Words');
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

  // Zen Mode Toggle
  btnZenToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isZenMode = !isZenMode;
    btnZenToggle.classList.toggle('active', isZenMode);
    if (isPlaying) {
      modernApp.classList.toggle('zen-mode', isZenMode);
    }
    AudioSystem.playZenToggle(isZenMode);
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
  // Media Controls (Rewind, Play, Skip, Reset)
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
    triggerGestureFeedback('left', '↺ -10 Words');
  });

  btnSkip10.addEventListener('click', async () => {
    await jumpWords(10);
    triggerGestureFeedback('right', '↻ +10 Words');
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
  // Text Input, Clipboard & Sample Chips
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

    readingEstimate.textContent = `${wordsCount.toLocaleString()} words • ~${timeStr} at ${wpm} WPM`;
  }

  async function prepareScratchpad() {
    const text = textInput.value.trim() || defaultWelcomeText;
    const words = RSVP.parseText(text, defaultWelcomeText);
    await Storage.saveBook('scratchpad', 'Scratchpad', 'User Input', words, state.colorPalette || 'red');
    currentBookMeta = await Storage.getBookMeta('scratchpad');
    currentChunkIndex = 0;
    currentChunkWords = await Storage.getBookChunk('scratchpad', 0);
    displayWord(currentChunkWords[0] || '');
    updateScrubberAndStats();
    updateStageBookBadge();
  }

  textInput.addEventListener('input', async () => {
    textareaQuoteHint.style.opacity = textInput.value.length > 0 ? '0' : '0.7';
    updateReadingEstimate();
    if (!isPlaying) {
      await prepareScratchpad();
    }
  });

  btnPasteClipboard.addEventListener('click', async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) {
        textInput.value = clipText.trim();
        textareaQuoteHint.style.opacity = '0';
        updateReadingEstimate();
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
    textareaQuoteHint.style.opacity = '0.7';
    updateReadingEstimate();
    await prepareScratchpad();
  });

  // Sample Text Chips
  sampleChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      const sampleKey = chip.dataset.sample;
      const sampleContent = sampleTexts[sampleKey];
      if (sampleContent) {
        AudioSystem.playSampleSelect();
        textInput.value = sampleContent;
        textareaQuoteHint.style.opacity = '0';
        updateReadingEstimate();
        await prepareScratchpad();
      }
    });
  });

  returnScratchBtn.addEventListener('click', async () => {
    AudioSystem.playButtonPress();
    state.activeDocId = 'scratchpad';
    await Storage.saveSettings(state);
    returnScratchBtnWrap.style.display = 'none';
    textInput.style.display = 'block';
    await prepareScratchpad();
  });

  // Quote rotation
  let quoteIndex = 0;
  setInterval(() => {
    if (!textInput.value.trim()) {
      quoteIndex = (quoteIndex + 1) % Quotes.emptyState.length;
      textareaQuoteHint.style.opacity = '0';
      setTimeout(() => {
        if (!textInput.value.trim()) {
          textareaQuoteHint.textContent = Quotes.emptyState[quoteIndex];
          textareaQuoteHint.style.opacity = '0.7';
        }
      }, 400);
    }
  }, 7000);

  // --------------------------------------------------------------------------
  // Keyboard Shortcuts (Space, Arrows, Z, M, R)
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', async (e) => {
    const activeEl = document.activeElement;
    const isEditing = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    if (isEditing) return;

    if (e.code === 'Space') {
      e.preventDefault();
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
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      await jumpWords(-5);
      triggerGestureFeedback('left', '↺ -5 Words');
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      await jumpWords(5);
      triggerGestureFeedback('right', '↻ +5 Words');
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      AudioSystem.playPresetSelect();
      setWpm(state.wpm + 25);
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      AudioSystem.playPresetSelect();
      setWpm(state.wpm - 25);
    } else if (e.code === 'KeyZ') {
      btnZenToggle.click();
    } else if (e.code === 'KeyM') {
      btnMute.click();
    } else if (e.code === 'KeyR') {
      btnReset.click();
    }
  });

  // Shortcuts Modal
  btnOpenShortcuts.addEventListener('click', () => {
    AudioSystem.playModalOpen();
    shortcutsModal.classList.add('active');
  });
  btnCloseShortcutsModal.addEventListener('click', () => {
    AudioSystem.playModalClose();
    shortcutsModal.classList.remove('active');
  });
  btnCloseShortcutsBtn.addEventListener('click', () => {
    AudioSystem.playModalClose();
    shortcutsModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // Library Management with SVG Circular Progress Rings
  // --------------------------------------------------------------------------
  async function ensurePreloadedBooks() {
    const existing = await Storage.getLibraryMeta();
    if (existing.length === 0) {
      for (const item of PreloadedLibrary) {
        const words = RSVP.parseText(item.content, '');
        await Storage.saveBook(item.id, item.title, item.author, words, 'red');
      }
    }
  }

  async function renderLibrary() {
    await ensurePreloadedBooks();
    const metaList = await Storage.getLibraryMeta();
    libraryGrid.innerHTML = '';

    metaList.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.style.setProperty('--card-color', `var(--palette-${book.color || 'red'})`);

      const pct = book.totalWords > 0 ? ((book.currentIndex / book.totalWords) * 100).toFixed(0) : 0;
      const isComplete = pct >= 100;
      const ringOffset = 88 - (88 * (pct / 100));

      card.innerHTML = `
        <div class="book-info">
          <div class="book-title">${escapeHtml(book.title)}</div>
          <div class="book-meta">
            <span>${escapeHtml(book.author || 'Unknown')}</span>
            <span>•</span>
            <span>${book.totalWords.toLocaleString()} words</span>
            <span>•</span>
            <span style="color: var(--accent); font-weight: 700;">${isComplete ? 'Finished' : `${pct}% completed`}</span>
          </div>
        </div>
        <div class="book-actions-group">
          <!-- Circular Progress Ring -->
          <div class="book-ring-wrap" title="${pct}% read">
            <svg viewBox="0 0 36 36">
              <circle class="book-ring-bg" cx="18" cy="18" r="14"></circle>
              <circle class="book-ring-prog" cx="18" cy="18" r="14" stroke-dasharray="88" stroke-dashoffset="${ringOffset}"></circle>
            </svg>
            <span class="book-ring-val">${pct}%</span>
          </div>
          <button class="btn-read-launch" data-id="${book.id}">Read</button>
          <button class="btn-icon-book edit" data-id="${book.id}" title="Edit Book">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          ${book.id !== 'scratchpad' ? `
            <button class="btn-icon-book delete" data-id="${book.id}" title="Delete Book">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          ` : ''}
        </div>
      `;

      // Read Launch Click
      card.querySelector('.btn-read-launch').addEventListener('click', (e) => {
        e.stopPropagation();
        openLaunchModal(book);
      });

      card.querySelector('.book-info').addEventListener('click', () => {
        openLaunchModal(book);
      });

      // Edit Click
      card.querySelector('.btn-icon-book.edit').addEventListener('click', async (e) => {
        e.stopPropagation();
        await openEditModal(book.id);
      });

      // Delete Click
      const delBtn = card.querySelector('.btn-icon-book.delete');
      if (delBtn) {
        delBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          AudioSystem.playButtonPress();
          if (confirm(`Remove "${book.title}" from your library?`)) {
            await Storage.deleteBook(book.id);
            if (state.activeDocId === book.id) {
              await loadBook('scratchpad');
            }
            renderLibrary();
          }
        });
      }

      libraryGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  async function loadBook(bookId) {
    state.activeDocId = bookId;
    await Storage.saveSettings(state);

    currentBookMeta = await Storage.getBookMeta(bookId);
    if (!currentBookMeta) return;

    currentChunkIndex = Math.floor(currentBookMeta.currentIndex / 1000);
    currentChunkWords = await Storage.getBookChunk(bookId, currentChunkIndex);

    if (bookId !== 'scratchpad') {
      textInput.style.display = 'none';
      returnScratchBtnWrap.style.display = 'block';
    } else {
      textInput.style.display = 'block';
      returnScratchBtnWrap.style.display = 'none';
    }

    const indexInChunk = currentBookMeta.currentIndex % 1000;
    displayWord(currentChunkWords[indexInChunk] || '');
    updateScrubberAndStats();
    updateStageBookBadge();

    // Switch to Reader tab
    const readerTab = document.querySelector('[data-target="tabReader"]');
    if (readerTab) readerTab.click();
  }

  // --------------------------------------------------------------------------
  // Launch Modal (with scrub slider)
  // --------------------------------------------------------------------------
  function openLaunchModal(book) {
    AudioSystem.playModalOpen();
    pendingLaunchDoc = book;
    launchTitle.textContent = book.title;
    launchAuthor.textContent = book.author || 'Unknown';
    launchTotalWords.textContent = book.totalWords.toLocaleString();

    const pct = book.totalWords > 0 ? ((book.currentIndex / book.totalWords) * 100).toFixed(0) : 0;
    launchProgressPct.textContent = `${pct}%`;
    launchStartSlider.value = pct;
    launchSliderLabel.textContent = `Word ${book.currentIndex.toLocaleString()} (${pct}%)`;

    launchModal.classList.add('active');
  }

  launchStartSlider.addEventListener('input', (e) => {
    if (!pendingLaunchDoc) return;
    const pct = parseFloat(e.target.value);
    const wordIndex = Math.floor((pct / 100) * pendingLaunchDoc.totalWords);
    launchSliderLabel.textContent = `Word ${wordIndex.toLocaleString()} (${pct.toFixed(0)}%)`;
  });

  btnLaunchRead.addEventListener('click', async () => {
    if (!pendingLaunchDoc) return;
    AudioSystem.playModalClose();
    const pct = parseFloat(launchStartSlider.value);
    const targetWordIndex = Math.floor((pct / 100) * pendingLaunchDoc.totalWords);

    pendingLaunchDoc.currentIndex = targetWordIndex;
    await Storage.updateBookProgress(pendingLaunchDoc.id, targetWordIndex);
    launchModal.classList.remove('active');
    await loadBook(pendingLaunchDoc.id);
  });

  btnLaunchResetProg.addEventListener('click', async () => {
    if (!pendingLaunchDoc) return;
    AudioSystem.playButtonPress();
    launchStartSlider.value = 0;
    launchSliderLabel.textContent = 'Word 0 (0%)';
    launchProgressPct.textContent = '0%';
    await Storage.updateBookProgress(pendingLaunchDoc.id, 0);
  });

  btnCloseLaunchModal.addEventListener('click', () => {
    AudioSystem.playModalClose();
    launchModal.classList.remove('active');
    pendingLaunchDoc = null;
  });

  // --------------------------------------------------------------------------
  // Add / Edit Book Modal
  // --------------------------------------------------------------------------
  btnAddBook.addEventListener('click', () => {
    AudioSystem.playModalOpen();
    editingBookId = null;
    bookModalTitle.textContent = 'Add Book to Library';
    editBookTitleInput.value = '';
    editBookAuthorInput.value = '';
    editBookContentInput.value = '';
    selectedModalColor = 'red';
    modalColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === 'red'));
    addBookModal.classList.add('active');
  });

  async function openEditModal(bookId) {
    AudioSystem.playModalOpen();
    editingBookId = bookId;
    const book = await Storage.getBookMeta(bookId);
    if (!book) return;

    bookModalTitle.textContent = 'Edit Book';
    editBookTitleInput.value = book.title || '';
    editBookAuthorInput.value = book.author || '';

    let fullWords = [];
    const totalChunks = Math.ceil(book.totalWords / 1000);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = await Storage.getBookChunk(bookId, i);
      fullWords.push(...chunk);
    }
    editBookContentInput.value = fullWords.join(' ');

    selectedModalColor = book.color || 'red';
    modalColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === selectedModalColor));
    addBookModal.classList.add('active');
  }

  modalColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      AudioSystem.playButtonPress();
      modalColorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedModalColor = dot.dataset.color;
    });
  });

  btnSaveAddModal.addEventListener('click', async () => {
    const title = editBookTitleInput.value.trim() || 'Untitled Book';
    const author = editBookAuthorInput.value.trim() || 'Unknown';
    const content = editBookContentInput.value.trim();

    if (!content) {
      alert("Please enter or paste book text.");
      return;
    }

    const words = RSVP.parseText(content, '');
    const id = editingBookId || `doc_${Date.now()}`;

    await Storage.saveBook(id, title, author, words, selectedModalColor);
    addBookModal.classList.remove('active');
    renderLibrary();
    AudioSystem.playSuccessChime();
  });

  btnCancelAddModal.addEventListener('click', () => {
    AudioSystem.playModalClose();
    addBookModal.classList.remove('active');
  });

  btnCloseAddModal.addEventListener('click', () => {
    AudioSystem.playModalClose();
    addBookModal.classList.remove('active');
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
      AudioSystem.playButtonPress();
      state.colorPalette = dot.dataset.color;
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
      btnStartTrial.textContent = 'Unlocking Prime...';
      AudioSystem.init();
      setTimeout(() => {
        state.isPro = true;
        Storage.saveSettings(state);
        applyTierMode();
        AudioSystem.playSuccessChime();
        btnStartTrial.textContent = 'Prime Member Active';

        const readerTab = document.querySelector('[data-target="tabReader"]');
        if (readerTab) readerTab.click();
      }, 1000);
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
    statTimeSaved.textContent = `${timeSavedSeconds} seconds`;
    completionQuote.textContent = Quotes.completion[Math.floor(Math.random() * Quotes.completion.length)] || "Knowledge absorbed.";

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

  // Load active book or scratchpad
  try {
    if (state.activeDocId && state.activeDocId !== 'scratchpad') {
      await loadBook(state.activeDocId);
    } else {
      await prepareScratchpad();
    }
  } catch (err) {
    console.warn("Could not load book/scratchpad, showing welcome text:", err);
    displayWord("READY");
  }

  updateReadingEstimate();
}

// Reliable boot trigger (handles deferred modules where DOMContentLoaded already fired)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
