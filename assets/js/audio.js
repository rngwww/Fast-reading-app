// TACHYON Ultra-High-Fidelity Audio Engine — WebHaptics & Physical Acoustic Suite
// Engineered with ultra-short transients, material-specific acoustic cavity damping,
// zero playback latency, and zero digital fatigue.

export const AudioSystem = {
  ctx: null,
  isUnlocked: false,
  volume: 0.3,
  isMuted: false,
  uiSoundsEnabled: true,
  profile: 'organic_pop', // default (Lochie Haptic)
  noiseBuffer: null,

  init() {
    if (this.isUnlocked && this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      // Unlock on mobile & desktop browsers
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
      this.isUnlocked = true;

      this.createNoiseBuffer();
    } catch (e) {
      console.warn("AudioContext unlock failed:", e);
    }
  },

  createNoiseBuffer() {
    if (this.noiseBuffer || !this.ctx) return this.noiseBuffer;
    // 4ms exponential noise buffer modeled on web-haptics / Lochie.me
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.004);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
    }
    this.noiseBuffer = buffer;
    return this.noiseBuffer;
  },

  canPlay() {
    if (this.isMuted) return false;
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  },

  canPlayUi() {
    if (!this.uiSoundsEnabled) return false;
    return this.canPlay();
  },

  // Helper: Play high-precision transient noise pulse
  playNoiseTransient(intensity = 0.5, freq = 3200) {
    if (!this.canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      const count = Math.floor(this.ctx.sampleRate * 0.004);
      const buf = this.ctx.createBuffer(1, count, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < count; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
      }

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.15), t);
      filter.Q.setValueAtTime(8.0, t);

      const gain = this.ctx.createGain();
      const currentVol = (this.volume !== undefined ? this.volume : 0.3) / 0.3;
      gain.gain.setValueAtTime(0.45 * intensity * currentVol, t);

      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.onended = () => src.disconnect();
      src.start(t);
    } catch (e) {
      console.warn("playNoiseTransient error:", e);
    }
  },

  // --------------------------------------------------------------------------
  // The 6 Core RSVP Speed-Reading Profiles (Physical Acoustic Tickers)
  // --------------------------------------------------------------------------
  playTick(wpm = 350) {
    if (!this.canPlay()) return;
    const t = this.ctx.currentTime;
    // Tempo Scaling: At high WPM (400-800), sound tightens and softens automatically
    const speedFactor = Math.max(0.45, Math.min(1.0, 1.0 - (wpm - 250) / 1200));
    const currentVol = (this.volume !== undefined ? this.volume : 0.3) / 0.3;
    const finalVolume = currentVol * speedFactor;

    switch (this.profile) {
      // ----------------------------------------------------------------------
      // 1. Haptic (Lochie Signature Selection Micro-Tick)
      // ----------------------------------------------------------------------
      case 'haptic':
      case 'organic_pop': {
        this.playNoiseTransient(0.38 * speedFactor, 2800);
        break;
      }

      // ----------------------------------------------------------------------
      // 2. Ceramic (Fine Glazed Porcelain Tap)
      // ----------------------------------------------------------------------
      case 'ceramic':
      case 'crystal_drop': {
        this.playNoiseTransient(0.18 * speedFactor, 4200);

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, t);
        filter.Q.setValueAtTime(3.5, t);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1320, t); // E6
        osc1.frequency.exponentialRampToValueAtTime(1100, t + 0.016 * speedFactor);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2640, t); // E7 harmonic
        osc2.frequency.exponentialRampToValueAtTime(2200, t + 0.012 * speedFactor);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.32 * finalVolume, t + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016 * speedFactor);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.018 * speedFactor);
        osc2.stop(t + 0.018 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 3. Mechanical (Lubed Mechanical Switch Thock)
      // ----------------------------------------------------------------------
      case 'mechanical':
      case 'mechanical_click': {
        this.playNoiseTransient(0.3 * speedFactor, 2400);

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, t);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.015 * speedFactor);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.38 * finalVolume, t + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016 * speedFactor);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.018 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 4. Wood (Rosewood Marimba Clave Block)
      // ----------------------------------------------------------------------
      case 'wood':
      case 'soft_marimba': {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(640, t);
        filter.Q.setValueAtTime(2.2, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t); // A4 wood fundamental
        osc.frequency.exponentialRampToValueAtTime(280, t + 0.022 * speedFactor);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.48 * finalVolume, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022 * speedFactor);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.024 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 5. Pulse (Deep Focus Sub-Bass Heartbeat)
      // ----------------------------------------------------------------------
      case 'pulse':
      case 'deep_focus': {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, t);
        osc.frequency.exponentialRampToValueAtTime(36, t + 0.038 * speedFactor);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.65 * finalVolume, t + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04 * speedFactor);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.045 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 6. Vinyl (Warm Analog Turntable Stylus Micro-Tick)
      // ----------------------------------------------------------------------
      case 'vinyl':
      case 'warm_vinyl': {
        this.playNoiseTransient(0.18 * speedFactor, 1300);

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.018 * speedFactor);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.35 * finalVolume, t + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02 * speedFactor);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.022 * speedFactor);
        break;
      }

      default: {
        this.playNoiseTransient(0.35 * speedFactor, 2800);
        break;
      }
    }
  },

  // --------------------------------------------------------------------------
  // UI & System Sound Suite
  // --------------------------------------------------------------------------

  // Tactile Button Press
  playButtonPress() {
    if (!this.canPlayUi()) return;
    this.playNoiseTransient(0.45, 2600);
  },

  // Preset Select / Micro-tick (Sliders, Steppers)
  playPresetSelect() {
    if (!this.canPlayUi()) return;
    this.playNoiseTransient(0.32, 2800);
  },

  playSelectionSound() {
    this.playPresetSelect();
  },

  playUiTick() {
    this.playPresetSelect();
  },

  // Sliding Tab Navigation (Slide-and-Lock Snap)
  playTabSwitch() {
    if (!this.canPlayUi()) return;
    this.playNoiseTransient(0.35, 2200);
    setTimeout(() => this.playNoiseTransient(0.7, 3400), 25);
  },

  // Appearance Themes (Obsidian, Graphite, Parchment, Vellum)
  playThemeSound(theme) {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;
    const playTone = (freq, dur, vol) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * (this.volume / 0.3), t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    };

    if (theme === 'obsidian') {
      this.playNoiseTransient(0.85, 1800);
      playTone(140, 0.035, 0.45);
    } else if (theme === 'graphite') {
      this.playNoiseTransient(0.7, 2500);
      playTone(210, 0.028, 0.35);
    } else if (theme === 'parchment') {
      this.playNoiseTransient(0.6, 3300);
      playTone(340, 0.024, 0.28);
    } else if (theme === 'vellum') {
      this.playNoiseTransient(0.45, 2900);
      setTimeout(() => {
        this.playNoiseTransient(0.9, 4400);
        playTone(480, 0.02, 0.25);
      }, 30);
    } else {
      this.playButtonPress();
    }
  },

  // 1:1 Synced Countdown (3, 2, 1, GO!)
  playCountdownStep(step) {
    if (!this.canPlay()) return;
    if (step === 3) this.playNoiseTransient(0.45, 2500);
    else if (step === 2) this.playNoiseTransient(0.55, 2900);
    else if (step === 1) this.playNoiseTransient(0.65, 3400);
  },

  playCountdownLaunch() {
    if (!this.canPlay()) return;
    this.playNoiseTransient(0.7, 3400);
    setTimeout(() => this.playNoiseTransient(0.85, 4100), 45);
    setTimeout(() => this.playNoiseTransient(1.0, 4800), 90);
  },

  playCountdownBeep(isFinal = false) {
    if (isFinal) {
      this.playCountdownLaunch();
    } else {
      this.playCountdownStep(3);
    }
  },

  // Celebratory Reading Completion Fanfare
  playReadingCompletion() {
    if (!this.canPlay()) return;
    // Phase 1: Lochie Success double-tap motif
    this.playNoiseTransient(0.55, 3000);
    setTimeout(() => this.playNoiseTransient(0.9, 4000), 60);
    // Phase 2: Triumphant achievement bloom
    setTimeout(() => {
      this.playNoiseTransient(0.75, 4600);
      setTimeout(() => this.playNoiseTransient(1.0, 5200), 55);
    }, 150);
  },

  playSuccessChime() {
    this.playReadingCompletion();
  },

  // Lochie.me Website "Success" Sound
  playLochieSuccess() {
    if (!this.canPlay()) return;
    this.playNoiseTransient(0.5, 3000);
    setTimeout(() => this.playNoiseTransient(1.0, 4200), 60);
  },

  // Loading Book from Library (Paper flutter + success confirmation)
  playBookLoad() {
    if (!this.canPlay()) return;
    this.playNoiseTransient(0.2, 1800);
    setTimeout(() => this.playNoiseTransient(0.25, 2000), 35);
    setTimeout(() => this.playNoiseTransient(0.3, 2200), 70);
    setTimeout(() => this.playNoiseTransient(0.35, 2400), 105);
    setTimeout(() => this.playLochieSuccess(), 180);
  },

  // Scratchpad Typing Sound
  playKey(e) {
    if (!this.canPlayUi()) return;
    const key = typeof e === 'string' ? e : (e ? e.key : '');
    if (key === ' ') {
      this.playNoiseTransient(0.55, 2100); // Deep spacebar
    } else if (key === 'Backspace' || key === 'Delete') {
      this.playNoiseTransient(0.6, 3200); // Crisp delete
    } else if (key === 'Enter') {
      this.playNoiseTransient(0.75, 2800); // Solid confirm
    } else {
      this.playNoiseTransient(0.35, 2700); // Standard key tap
    }
  },

  // Modal Open & Close
  playModalOpen() {
    if (!this.canPlayUi()) return;
    this.playNoiseTransient(0.4, 2600);
    setTimeout(() => this.playNoiseTransient(0.7, 3600), 40);
  },

  playModalClose() {
    if (!this.canPlayUi()) return;
    this.playNoiseTransient(0.6, 3000);
    setTimeout(() => this.playNoiseTransient(0.35, 2000), 35);
  },

  // Skip & Rewind Jump
  playJump(isForward = true) {
    if (!this.canPlayUi()) return;
    if (isForward) {
      this.playNoiseTransient(0.4, 2600);
      setTimeout(() => this.playNoiseTransient(0.6, 3400), 30);
    } else {
      this.playNoiseTransient(0.6, 3400);
      setTimeout(() => this.playNoiseTransient(0.4, 2600), 30);
    }
  },

  playTapSound() {
    this.playButtonPress();
  }
};
