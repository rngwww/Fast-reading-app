export const AudioSystem = {
  ctx: null,
  isUnlocked: false,
  isMuted: false,
  volume: 0.3,

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
    
    osc.type = 'triangle';
    const freq = 850 + ((wpm - 350) * 0.15);
    osc.frequency.setValueAtTime(Math.max(200, freq), t);
    
    gainNode.gain.setValueAtTime(this.volume, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
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
  }
};
