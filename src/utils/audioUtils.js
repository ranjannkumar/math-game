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
    console.error('Web Audio API is not supported in this browser.', e);
  }
};

const playSound = (buffer) => {
  if (!audioContext || !buffer || audioContext.state === 'suspended') {
    console.log('AudioContext is suspended or not initialized.');
    return;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

export default {
  init,
  playCorrectSound: () => playSound(correctSound),
  playWrongSound: () => playSound(wrongSound),
  playCompleteSound: () => playSound(completeSound),
  playButtonClick: () => {
    // Play a simple click sound instantly for UI feedback
    if (audioContext && audioContext.state === 'running') {
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
  },
};