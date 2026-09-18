export const AudioSystem = {
  ctx: null,
  isUnlocked: false,
  volume: 0.3,
  isMuted: false,
  profile: 'organic_pop', // default

  init() {
    if (this.isUnlocked) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      // Unlock for iOS
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
      this.isUnlocked = true;
    } catch (e) {
      console.warn("AudioContext unlock failed", e);
    }
  },

  playTick(wpm = 350) {
    if (this.isMuted || !this.isUnlocked || !this.ctx) return;
    
    // Compensation for higher WPMs so it doesn't get overwhelming
    const wpmScale = Math.max(0.4, 1 - (wpm - 200) / 2000);
    const finalVolume = this.volume * wpmScale;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Premium, non-robotic synthesis
    switch (this.profile) {
      case 'organic_pop':
        // Soft, muted organic pop (like a soft UI tap)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.05);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.6 * finalVolume, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        break;

      case 'soft_marimba':
        // Warm, woody marimba hit
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5 * finalVolume, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        break;

      case 'crystal_drop':
        // Clear, high-end chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2 * finalVolume, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        break;

      case 'deep_focus':
        // Subtle sub-frequency heartbeat/thump
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.8 * finalVolume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        break;
        
      default:
        // Fallback smooth pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5 * finalVolume, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        break;
    }

    osc.start(t);
    osc.stop(t + 0.2);
  },

  playUiTick() {
    if (this.isMuted || !this.isUnlocked || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2 * this.volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  },

  playCountdownBeep(isFinal) {
    if (this.isMuted || !this.isUnlocked || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    if (isFinal) {
      osc.frequency.setValueAtTime(1200, t);
    } else {
      osc.frequency.setValueAtTime(600, t);
    }
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4 * this.volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  },
  
  playSuccessChime() {
    if (this.isMuted || !this.isUnlocked || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(880, t);
    osc2.frequency.setValueAtTime(1100, t);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3 * this.volume, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1);
    osc2.stop(t + 1);
  }
};
