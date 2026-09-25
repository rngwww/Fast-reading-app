// TACHYON Modern Audio Engine — Console & iOS Inspired UI Sound System
// Designed after the acoustic signatures of PlayStation 5, Xbox Series X/One, and iPhone Taptic Engine.
// Ultra-short transients, acoustic cavity damping, zero-latency, and zero digital fatigue.

export const AudioSystem = {
  ctx: null,
  isUnlocked: false,
  volume: 0.3,
  isMuted: false,
  uiSoundsEnabled: true,
  profile: 'organic_pop', // default (iPhone Taptic)
  noiseBuffer: null,

  init() {
    if (this.isUnlocked && this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      // Unlock on mobile / desktop browsers
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
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05); // 50ms buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
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

  // --------------------------------------------------------------------------
  // Core RSVP Speed-Reading Ticks (Ultra-Short Tactile Impulses: 8ms - 22ms)
  // --------------------------------------------------------------------------
  playTick(wpm = 350) {
    if (!this.canPlay()) return;

    // Tempo Scaling: At high WPM (400-800), sound tightens and softens automatically
    const speedFactor = Math.max(0.35, Math.min(1.0, 1.0 - (wpm - 250) / 1200));
    const finalVolume = this.volume * speedFactor;
    const t = this.ctx.currentTime;

    switch (this.profile) {
      // ----------------------------------------------------------------------
      // 1. iPhone Taptic Click (organic_pop)
      // Authentic iOS keyboard / haptic impulse: 1.5ms noise burst + 12ms damped cavity (380Hz)
      // ----------------------------------------------------------------------
      case 'organic_pop': {
        // Layer A: Micro-transient click
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(3200, t);
          bandpass.Q.setValueAtTime(4.0, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.22 * finalVolume, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.005);

          noise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(this.ctx.destination);
          noise.start(t);
          noise.stop(t + 0.006);
        }

        // Layer B: Damped haptic resonance (iPhone taptic enclosure)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.014 * speedFactor);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.55 * finalVolume, t + 0.0015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016 * speedFactor);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.018 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 2. PlayStation 5 Ceramic Tap (crystal_drop)
      // Clean, muted ceramic/glass tap inspired by the PS5 interface:
      // Rounded 587Hz (D5) + 880Hz overtone with soft 2200Hz lowpass filter
      // ----------------------------------------------------------------------
      case 'crystal_drop': {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, t);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, t); // D5
        osc1.frequency.exponentialRampToValueAtTime(440, t + 0.02 * speedFactor);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, t); // A5 (harmonic fifth)
        osc2.frequency.exponentialRampToValueAtTime(587, t + 0.012 * speedFactor);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.38 * finalVolume, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022 * speedFactor);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.024 * speedFactor);
        osc2.stop(t + 0.024 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 3. Xbox Tactile Switch (mechanical_click)
      // Xbox controller D-pad microswitch: crisp 1.6kHz tactile snap + 220Hz shell resonance
      // ----------------------------------------------------------------------
      case 'mechanical_click': {
        if (this.noiseBuffer) {
          const snap = this.ctx.createBufferSource();
          snap.buffer = this.noiseBuffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1600, t);
          filter.Q.setValueAtTime(3.2, t);

          const snapGain = this.ctx.createGain();
          snapGain.gain.setValueAtTime(0.26 * finalVolume, t);
          snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);

          snap.connect(filter);
          filter.connect(snapGain);
          snapGain.connect(this.ctx.destination);
          snap.start(t);
          snap.stop(t + 0.007);
        }

        const thump = this.ctx.createOscillator();
        const thumpGain = this.ctx.createGain();
        thump.type = 'triangle';
        thump.frequency.setValueAtTime(240, t);
        thump.frequency.exponentialRampToValueAtTime(100, t + 0.018 * speedFactor);

        thumpGain.gain.setValueAtTime(0, t);
        thumpGain.gain.linearRampToValueAtTime(0.42 * finalVolume, t + 0.001);
        thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02 * speedFactor);

        thump.connect(thumpGain);
        thumpGain.connect(this.ctx.destination);
        thump.start(t);
        thump.stop(t + 0.022 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 4. Studio Percussion Wood (soft_marimba)
      // Minimal, warm, unhyped acoustic woodblock: 480Hz fundamental + 1200Hz harmonic
      // ----------------------------------------------------------------------
      case 'soft_marimba': {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(680, t);
        filter.Q.setValueAtTime(2.0, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.024 * speedFactor);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5 * finalVolume, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028 * speedFactor);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.03 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 5. Sub Haptic Pulse (deep_focus)
      // Ultra-low frequency chest/earphone pulse: 55Hz sine with zero treble click.
      // Felt as a gentle rhythm rather than heard as a sound.
      // ----------------------------------------------------------------------
      case 'deep_focus': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(58, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.035 * speedFactor);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.65 * finalVolume, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04 * speedFactor);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.045 * speedFactor);
        break;
      }

      // ----------------------------------------------------------------------
      // 6. Warm Vinyl Tick (warm_vinyl)
      // Nostalgic, ultra-damped vintage turntable stylus micro-tick:
      // Bandpassed warm vinyl crackle + 260Hz organic wooden plinth body.
      // Zero high-frequency harshness for fatigue-free long reading sessions.
      // ----------------------------------------------------------------------
      case 'warm_vinyl': {
        // Layer A: Micro-dusted analog needle transit (soft low-pass burst)
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(1400, t);
          bandpass.Q.setValueAtTime(2.2, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.16 * finalVolume, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);

          noise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(this.ctx.destination);
          noise.start(t);
          noise.stop(t + 0.007);
        }

        // Layer B: Warm acoustic vinyl plinth / wood resonance
        const osc = this.ctx.createOscillator();
        const lowpass = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(850, t);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.016 * speedFactor);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.46 * finalVolume, t + 0.0012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018 * speedFactor);

        osc.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.02 * speedFactor);
        break;
      }

      default: {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.015);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5 * finalVolume, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.02);
        break;
      }
    }
  },

  // --------------------------------------------------------------------------
  // Console & iOS Inspired UI Sound Palette
  // --------------------------------------------------------------------------

  // UI Micro-Tick (Slider detents / toggles)
  playUiTick() {
    this.playPresetSelect();
  },

  // Tactile Button Press (Xbox 'A' / PS5 Cross Button / iOS Tap / Vinyl Tap)
  // Dual-transient: 2.2kHz contact transient + 180Hz damped bottom-out (30ms)
  playButtonPress() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;

    if (this.profile === 'warm_vinyl') {
      // Warm Vinyl Button Tap: mellow analog needle-drop click + deep warm thump
      if (this.noiseBuffer) {
        const click = this.ctx.createBufferSource();
        click.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1200, t);
        bp.Q.setValueAtTime(2.5, t);

        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(0.18 * this.volume, t);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

        click.connect(bp);
        bp.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        click.start(t);
        click.stop(t + 0.009);
      }

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.028);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.38 * this.volume, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
      return;
    }

    // Default Tactile Button Press (Xbox 'A' / PS5 Cross Button / iOS Tap)
    // Transient click
    if (this.noiseBuffer) {
      const click = this.ctx.createBufferSource();
      click.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2400, t);
      bp.Q.setValueAtTime(4.0, t);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.24 * this.volume, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);

      click.connect(bp);
      bp.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      click.start(t);
      click.stop(t + 0.007);
    }

    // Acoustic body thump
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.026);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4 * this.volume, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.035);
  },

  // Sliding Tab Navigation (Xbox Dashboard / PS5 Home Bar Tile Slide / Vinyl Sleeve)
  // Airy aerodynamic swish + subtle landing pop (28ms)
  playTabSwitch() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;

    if (this.profile === 'warm_vinyl') {
      // Soft vinyl sleeve slide & gentle landing
      if (this.noiseBuffer) {
        const whoosh = this.ctx.createBufferSource();
        whoosh.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, t);
        filter.frequency.exponentialRampToValueAtTime(400, t + 0.035);

        const whooshGain = this.ctx.createGain();
        whooshGain.gain.setValueAtTime(0, t);
        whooshGain.gain.linearRampToValueAtTime(0.12 * this.volume, t + 0.005);
        whooshGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

        whoosh.connect(filter);
        filter.connect(whooshGain);
        whooshGain.connect(this.ctx.destination);
        whoosh.start(t);
        whoosh.stop(t + 0.038);
      }

      const tap = this.ctx.createOscillator();
      const tapGain = this.ctx.createGain();
      tap.type = 'sine';
      tap.frequency.setValueAtTime(220, t + 0.008);
      tap.frequency.exponentialRampToValueAtTime(120, t + 0.03);

      tapGain.gain.setValueAtTime(0, t + 0.008);
      tapGain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.012);
      tapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      tap.connect(tapGain);
      tapGain.connect(this.ctx.destination);
      tap.start(t + 0.008);
      tap.stop(t + 0.038);
      return;
    }

    // Aerodynamic airy whoosh
    if (this.noiseBuffer) {
      const whoosh = this.ctx.createBufferSource();
      whoosh.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1900, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + 0.028);
      filter.Q.setValueAtTime(1.8, t);

      const whooshGain = this.ctx.createGain();
      whooshGain.gain.setValueAtTime(0, t);
      whooshGain.gain.linearRampToValueAtTime(0.14 * this.volume, t + 0.004);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

      whoosh.connect(filter);
      filter.connect(whooshGain);
      whooshGain.connect(this.ctx.destination);
      whoosh.start(t);
      whoosh.stop(t + 0.03);
    }

    // Gentle tactile landing tap
    const tap = this.ctx.createOscillator();
    const tapGain = this.ctx.createGain();
    tap.type = 'sine';
    tap.frequency.setValueAtTime(320, t + 0.008);
    tap.frequency.exponentialRampToValueAtTime(180, t + 0.028);

    tapGain.gain.setValueAtTime(0, t + 0.008);
    tapGain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.012);
    tapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

    tap.connect(tapGain);
    tapGain.connect(this.ctx.destination);
    tap.start(t + 0.008);
    tap.stop(t + 0.035);
  },

  // Directional Skip & Rewind 10 Words (PS5 / Xbox Menu Bump)
  // Forward: crisp ascending double-pulse (16ms) | Rewind: soft descending double-pulse (16ms)
  playJump(isForward = true) {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;
    const f1 = isForward ? 520 : 680;
    const f2 = isForward ? 740 : 460;

    [f1, f2].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = idx * 0.018;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, t + delay + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.016);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + delay);
      osc.stop(t + delay + 0.02);
    });
  },

  // Rotary Notch Steppers (iOS Digital Crown / Picker Wheel Click)
  // Ultra-crisp 7ms high-precision mechanical tick
  playPresetSelect() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;

    if (this.noiseBuffer) {
      const click = this.ctx.createBufferSource();
      click.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2600, t);
      bp.Q.setValueAtTime(6.0, t);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.3 * this.volume, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.007);

      click.connect(bp);
      bp.connect(g);
      g.connect(this.ctx.destination);
      click.start(t);
      click.stop(t + 0.008);
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.008);

    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.009);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.01);
  },

  // Zen Focus Mode (PS5 System Suspend / Xbox Guide Atmosphere)
  // Enter: Cinematic sub-bass ambient drop (2000Hz -> 50Hz) | Exit: Crisp airy release
  playZenToggle(isEntering = true) {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;

    if (isEntering) {
      // Cinematic vacuum drop: sub-bass dive while lowpass filter smoothly seals shut
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, t);
      filter.frequency.exponentialRampToValueAtTime(60, t + 0.24);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4 * this.volume, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    } else {
      // Crisp airy release (console resume sensation)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.12);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    }
  },

  // Modal Dialog Open (PS5 Notification / Xbox Card Slide-in)
  // Subtle two-tone glass acoustic interval: E5 (659Hz) -> B5 (987Hz) with warm 2.2kHz filter (70ms)
  playModalOpen() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;
    const notes = [659.25, 987.77]; // E5, B5 (pure fifth)

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const delay = idx * 0.024;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t + delay);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + delay + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.09);
    });
  },

  // Modal Dialog Close (PS5 Circle / Xbox 'B' Back Button)
  // Understated descending release tap (20ms)
  playModalClose() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.02);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  },

  // Sample Chip Select (iOS Haptic Peek / Pop)
  // Double micro-tick (420Hz and 640Hz, 12ms each)
  playSampleSelect() {
    if (!this.canPlayUi()) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(420, t);
    osc2.frequency.setValueAtTime(640, t + 0.016);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2 * this.volume, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t + 0.016);
    osc1.stop(t + 0.045);
    osc2.stop(t + 0.045);
  },

  // Countdown Beep (PS5 Ready / Launch Prompt)
  playCountdownBeep(isFinal = false) {
    if (!this.canPlay()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 587.33, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25 * this.volume, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  },

  // Session Completion Fanfare (PS5 Trophy / Xbox Achievement chime)
  // Warm crystalline shimmer chord: A4 (440Hz), E5 (659Hz), C#6 (1108Hz) with soft analog bloom
  playSuccessChime() {
    if (!this.canPlay()) return;
    const t = this.ctx.currentTime;
    const chord = [440.0, 659.25, 1108.73]; // A Major triad in open voicing

    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const delay = i * 0.035;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, t + delay);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, t + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.6);
    });
  }
};
