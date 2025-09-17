// src/utils/audioUtils.js
let audioContext = null;
let correctSound = null;
let wrongSound = null;
let completeSound = null;
let isInitialized = false;

const init = async () => {
  if (isInitialized) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const loadSound = async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return audioContext.decodeAudioData(arrayBuffer);
    };

    correctSound = await loadSound('/audio/correct.mp3');
    wrongSound = await loadSound('/audio/wrong.mp3');
    completeSound = await loadSound('/audio/complete.mp3');
    
    isInitialized = true;
  } catch (e) {
    console.error('Web Audio API initialization failed:', e);
    // Fallback or disable audio features if not supported
    isInitialized = false;
  }
};

const playSound = (buffer) => {
  if (!audioContext || !buffer) {
    console.warn('AudioContext or buffer not available.');
    return;
  }

  // Check if AudioContext is suspended and resume it
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    });
  } else {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
};

export default {
  init,
  playCorrectSound: () => playSound(correctSound),
  playWrongSound: () => playSound(wrongSound),
  playCompleteSound: () => playSound(completeSound),
  playButtonClick: () => {
    // Play a simple click sound instantly for UI feedback
    if (audioContext && audioContext.state !== 'closed') {
      // Check if AudioContext is suspended and resume it
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
          oscillator.stop(audioContext.currentTime + 0.1);
        });
      } else {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    }
  },
};