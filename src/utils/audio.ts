/**
 * 8-Bit Web Audio API Sound Synthesizer
 * Fully self-contained, no external asset loading needed.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  private playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration: number = 0.1,
    gainVal: number = 0.1,
    detune: number = 0
  ) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (detune !== 0) {
        osc.detune.setValueAtTime(detune, ctx.currentTime);
      }

      const finalGain = gainVal * this.volume;
      gain.gain.setValueAtTime(finalGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore browser audio errors
    }
  }

  /** Quick subtle mechanical tick as reel rotates */
  public spinTick() {
    this.playTone(340, 'square', 0.035, 0.03);
  }

  /** Heavy solid clunk when reel stops */
  public stopReel(reelIndex: number = 0) {
    // Pitch steps up slightly for reel 1, 2, 3 for anticipation
    const freqs = [480, 580, 720];
    const baseFreq = freqs[reelIndex % 3] || 600;
    this.playTone(baseFreq, 'triangle', 0.14, 0.18);
    this.playTone(baseFreq * 0.5, 'square', 0.08, 0.1);
  }

  /** Sword Slash sound effect */
  public slash() {
    this.playTone(280, 'sawtooth', 0.15, 0.22);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.18, 0.2), 30);
  }

  /** Shield block metalloid clink */
  public shield() {
    this.playTone(420, 'sine', 0.08, 0.2);
    setTimeout(() => this.playTone(660, 'triangle', 0.18, 0.15), 50);
  }

  /** Coin pickup sparkle */
  public coin() {
    this.playTone(988, 'sine', 0.07, 0.14);
    setTimeout(() => this.playTone(1319, 'sine', 0.12, 0.16), 60);
  }

  /** Potion healing gulp */
  public heal() {
    this.playTone(330, 'sine', 0.1, 0.15);
    setTimeout(() => this.playTone(440, 'sine', 0.12, 0.15), 70);
    setTimeout(() => this.playTone(554, 'sine', 0.16, 0.15), 140);
  }

  /** Poison venom hiss */
  public poison() {
    this.playTone(220, 'sawtooth', 0.1, 0.12);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.15, 0.12), 60);
  }

  /** Skull backfire curse hurt */
  public skull() {
    this.playTone(110, 'sawtooth', 0.25, 0.25);
    setTimeout(() => this.playTone(85, 'square', 0.3, 0.22), 70);
  }

  /** Lightning strike */
  public lightning() {
    this.playTone(700, 'sawtooth', 0.1, 0.25);
    setTimeout(() => this.playTone(350, 'square', 0.2, 0.22), 40);
  }

  /** Player hit / Damage taken */
  public hurt() {
    this.playTone(120, 'sawtooth', 0.18, 0.25);
    setTimeout(() => this.playTone(90, 'triangle', 0.25, 0.2), 50);
  }

  /** 3-of-a-kind Jackpot triumphant arcade chime */
  public jackpot() {
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.22, 0.2);
      }, idx * 80);
    });
  }

  /** 2-of-a-kind pair synergy ping */
  public pairSynergy() {
    this.playTone(600, 'sine', 0.1, 0.12);
    setTimeout(() => this.playTone(750, 'sine', 0.12, 0.12), 70);
  }

  /** Victory Fanfare */
  public victory() {
    const notes = [440, 554, 659, 880, 880, 880, 1108];
    const delays = [0, 100, 200, 320, 440, 560, 720];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.28, 0.22);
      }, delays[i]);
    });
  }

  /** Defeat Game Over */
  public defeat() {
    const notes = [330, 311, 293, 261];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.35, 0.2);
      }, i * 180);
    });
  }

  /** Shop purchase ding */
  public buy() {
    this.playTone(784, 'sine', 0.08, 0.15);
    setTimeout(() => this.playTone(1046, 'sine', 0.15, 0.18), 70);
  }

  /** Button click */
  public click() {
    this.playTone(400, 'sine', 0.04, 0.06);
  }
}

export const SFX = new SoundEngine();
