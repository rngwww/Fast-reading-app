export const AudioSystem = {
  ctx: null,
  isUnlocked: false,
  isMuted: false,
  volume: 0.3,
  profile: 'woodblock',

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  },

  playTick(wpm) {
    if (!this.ctx || !this.isUnlocked || this.isMuted || this.volume === 0) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    // Dynamic sound profile routing
    if (this.profile === 'marimba') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + ((wpm - 350) * 0.1), t);
      gainNode.gain.setValueAtTime(this.volume, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    } else if (this.profile === 'cyber_pulse') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200 + ((wpm - 350) * 0.2), t);
      gainNode.gain.setValueAtTime(this.volume * 0.5, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    } else if (this.profile === 'sub_bass') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, t);
      gainNode.gain.setValueAtTime(this.volume * 1.5, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    } else {
      // Default Woodblock
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(Math.max(200, 850 + ((wpm - 350) * 0.15)), t);
      gainNode.gain.setValueAtTime(this.volume, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    }
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  },

  playUiTick() {
    if (!this.ctx || !this.isUnlocked || this.isMuted || this.volume === 0) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    gainNode.gain.setValueAtTime(this.volume * 0.5, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  },

  playCountdownBeep(highPitch = false) {
    if (!this.ctx || !this.isUnlocked || this.isMuted || this.volume === 0) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(highPitch ? 1200 : 600, t);
    gainNode.gain.setValueAtTime(this.volume, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + (highPitch ? 0.2 : 0.1));
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (highPitch ? 0.2 : 0.1));
  },

  playSuccessChime() {
    if (!this.ctx || !this.isUnlocked || this.isMuted || this.volume === 0) return;
    const t = this.ctx.currentTime;
    
    const freqs = [440, 554.37, 659.25, 880]; // A Major Arpeggio
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + (i * 0.1));
      
      gainNode.gain.setValueAtTime(0, t + (i * 0.1));
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.6, t + (i * 0.1) + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + (i * 0.1) + 0.6);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start(t + (i * 0.1));
      osc.stop(t + (i * 0.1) + 0.7);
    });
  }
};
