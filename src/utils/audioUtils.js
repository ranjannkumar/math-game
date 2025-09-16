// Audio utility functions for the math quiz app
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playCorrectSound() {
    // Play a pleasant ascending chord
    this.playTone(523.25, 0.2, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine', 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.3, 'sine', 0.2), 200); // G5
  }

  playWrongSound() {
    // Play a different sound for wrong answers - lower pitch with different waveform
    this.playTone(330, 0.2, 'triangle', 0.12); // E4
    setTimeout(() => this.playTone(294, 0.2, 'triangle', 0.12), 100); // D4
    setTimeout(() => this.playTone(262, 0.3, 'triangle', 0.12), 200); // C4
  }

  playCompleteSound() {
    // Play a victory fanfare
    this.playTone(523.25, 0.2, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine', 0.2), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.2), 300); // G5
    setTimeout(() => this.playTone(1046.50, 0.2, 'sine', 0.2), 450); // C6
    setTimeout(() => this.playTone(1318.51, 0.4, 'sine', 0.25), 600); // E6
  }

  playButtonClick() {
    // Play a short click sound
    this.playTone(800, 0.1, 'square', 0.1);
  }

  // Resume audio context if suspended (needed for some browsers)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager; 