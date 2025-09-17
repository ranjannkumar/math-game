// src/utils/mathGameLogic.js
import audioManager from './audioUtils';
import { users } from './userData';

// ===== Add near the top (below imports) =====
const BELT_ORDER = ['white','yellow','green','blue','red','brown'];

export function normalizeDifficulty(difficulty) {
  if (difficulty == null) return null;
  if (typeof difficulty === 'number') return BELT_ORDER[difficulty - 1] || null;
  if (typeof difficulty === 'string') {
    const d = difficulty.trim().toLowerCase();
    if (/^\d+$/.test(d)) return BELT_ORDER[parseInt(d, 10) - 1] || null; // "2" -> "yellow"
    return d;
  }
  return null;
}


// Shooting Stars
export const showShootingStars = () => {
  console.log('🎆 Shooting stars function called!');
  const leftStarSpeeds = [550, 500, 450, 575, 525];
  const rightStarSpeeds = [550, 500, 450, 575, 525];
  const starColors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#ffd700',
    '#96ceb4'
  ];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.background = starColors[i];
      star.style.filter = `drop-shadow(0 0 15px ${starColors[i]})`;
      star.style.left = '20px';
      star.style.bottom = '20px';
      const speed = leftStarSpeeds[i];
      const duration = 3;
      const customAnimation = `
        @keyframes customShootLeft${i} {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 1;
          }
          14% {
            transform: translate(${speed}px, -${speed/2}px) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translate(${speed}px, -${speed/3}px) rotate(45deg);
            opacity: 0;
          }
        }
      `;
      const style = document.createElement('style');
      style.textContent = customAnimation;
      document.head.appendChild(style);
      star.style.animation = `customShootLeft${i} ${duration}s ease-out forwards`;
      const randomDelay = Math.random() * 0.2;
      star.style.animationDelay = (i * 0.15 + randomDelay) + 's';
      document.body.appendChild(star);
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, (duration + 1) * 1000);
    }, i * 80);
  }

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.background = starColors[i];
      star.style.filter = `drop-shadow(0 0 15px ${starColors[i]})`;
      star.style.right = '20px';
      star.style.bottom = '20px';
      const speed = rightStarSpeeds[i];
      const duration = 3;
      const customAnimation = `
        @keyframes customShootRight${i} {
          0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
          }
          14% {
            transform: translate(-${speed}px, -${speed/2}px) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-${speed}px, -${speed/3}px) rotate(-45deg);
            opacity: 0;
          }
        }
      `;
      const style = document.createElement('style');
      style.textContent = customAnimation;
      document.head.appendChild(style);
      star.style.animation = `customShootRight${i} ${duration}s ease-out forwards`;
      const randomDelay = Math.random() * 0.2;
      star.style.animationDelay = (i * 0.15 + randomDelay) + 's';
      document.body.appendChild(star);
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, (duration + 1) * 1000);
    }, i * 80);
  }
};

export const clearShootingStars = () => document.querySelectorAll('.shooting-star').forEach(star => star.remove());

export const themeConfigs = {
  animals: {
    bg: 'from-green-300 via-yellow-200 to-green-500',
    image: '/animals.jpg',
    tableEmojis: ['🐶', '🐱', '🦁', '🐯', '🐵', '🐸', '🐧', '🐼', '🐨', '🦊', '🐻', '🐰'],
    tableNames: ['Dog', 'Cat', 'Lion', 'Tiger', 'Monkey', 'Frog', 'Penguin', 'Panda', 'Koala', 'Fox', 'Bear', 'Rabbit'],
    tableColors: ['bg-green-400 border-green-600', 'bg-yellow-300 border-yellow-500', 'bg-orange-300 border-orange-500', 'bg-pink-300 border-pink-500', 'bg-blue-300 border-blue-500', 'bg-purple-300 border-purple-500', 'bg-gray-300 border-gray-500', 'bg-red-300 border-red-500', 'bg-teal-300 border-teal-500', 'bg-lime-300 border-lime-500', 'bg-amber-300 border-amber-500', 'bg-cyan-300 border-cyan-500']
  },
  candyland: {
    bg: 'from-pink-200 via-yellow-100 to-pink-400',
    image: '/candyland.jpg',
    tableEmojis: ['🍬', '🍭', '🍫', '🍩', '🍪', '🧁', '🍰', '🍦', '🥧', '🍮', '🍯', '🍨'],
    tableNames: ['Candy', 'Lollipop', 'Chocolate', 'Donut', 'Cookie', 'Cupcake', 'Cake', 'Ice Cream', 'Pie', 'Pudding', 'Honey', 'Gelato'],
    tableColors: ['bg-pink-300 border-pink-500', 'bg-yellow-200 border-yellow-400', 'bg-orange-200 border-orange-400', 'bg-purple-200 border-purple-400', 'bg-blue-200 border-blue-400', 'bg-green-200 border-green-400', 'bg-red-200 border-red-400', 'bg-amber-200 border-amber-400', 'bg-lime-200 border-lime-400', 'bg-cyan-200 border-cyan-400', 'bg-fuchsia-200 border-fuchsia-400', 'bg-rose-200 border-rose-400']
  },
  fairytales: {
    bg: 'from-pink-300 via-purple-200 to-blue-200',
    image: '/fairytales.jpg',
    tableEmojis: ['🧚', '🦄', '🐉', '👸', '🧙', '🧞', '🧜', '🦸', '🧝', '🧟', '🧚', '🦄'],
    tableNames: ['Fairy', 'Unicorn', 'Dragon', 'Princess', 'Wizard', 'Genie', 'Mermaid', 'Hero', 'Elf', 'Zombie', 'Sprite', 'Pegasus'],
    tableColors: ['bg-pink-400 border-pink-600', 'bg-purple-300 border-purple-500', 'bg-blue-300 border-blue-500', 'bg-yellow-300 border-yellow-500', 'bg-green-300 border-green-500', 'bg-red-300 border-red-500', 'bg-orange-300 border-orange-500', 'bg-cyan-300 border-cyan-500', 'bg-lime-300 border-lime-500', 'bg-amber-300 border-amber-500', 'bg-fuchsia-300 border-fuchsia-500', 'bg-rose-300 border-rose-400']
  },
  farm: {
    bg: 'from-yellow-200 via-green-200 to-yellow-400',
    image: '/farm.jpg',
    tableEmojis: ['🐮', '🐷', '🐔', '🐴', '🐑', '🦆', '🦃', '🐐', '🐓', '🐇', '🐕', '🐈'],
    tableNames: ['Cow', 'Pig', 'Chicken', 'Horse', 'Sheep', 'Duck', 'Turkey', 'Goat', 'Rooster', 'Rabbit', 'Dog', 'Cat'],
    tableColors: ['bg-yellow-300 border-yellow-500', 'bg-green-300 border-green-500', 'bg-orange-300 border-orange-500', 'bg-pink-300 border-pink-500', 'bg-blue-300 border-blue-500', 'bg-purple-300 border-purple-500', 'bg-gray-300 border-gray-500', 'bg-red-300 border-red-500', 'bg-teal-300 border-teal-600', 'bg-lime-300 border-lime-500', 'bg-amber-300 border-amber-500', 'bg-cyan-300 border-cyan-500']
  },
  dinosaurs: {
    bg: 'from-green-400 via-yellow-200 to-green-700',
    image: '/dinosaur.jpg',
    tableEmojis: ['🦕', '🦖', '🐊', '🐢', '🦎', '🐍', '🦦', '🦥', '🦨', '🦡', '🦔', '🦋'],
    tableNames: ['Brontosaurus', 'T-Rex', 'Crocodile', 'Turtle', 'Lizard', 'Snake', 'Otter', 'Sloth', 'Skunk', 'Badger', 'Hedgehog', 'Butterfly'],
    tableColors: ['bg-green-500 border-green-700', 'bg-yellow-400 border-yellow-600', 'bg-orange-400 border-orange-600', 'bg-pink-400 border-pink-600', 'bg-blue-400 border-blue-600', 'bg-purple-400 border-purple-600', 'bg-gray-400 border-gray-600', 'bg-red-400 border-red-600', 'bg-teal-400 border-teal-600', 'bg-lime-400 border-lime-600', 'bg-amber-400 border-amber-600', 'bg-cyan-400 border-cyan-600']
  },
  underwater: {
    bg: 'from-blue-200 via-cyan-200 to-blue-400',
    image: '/underwater.jpg',
    tableEmojis: ['🐠', '🐟', '🐬', '🐳', '🦈', '🦑', '🐙', '🦀', '🦐', '🦞', '🐡', '🐚'],
    tableNames: ['Fish', 'Goldfish', 'Dolphin', 'Whale', 'Shark', 'Squid', 'Octopus', 'Crab', 'Shrimp', 'Lobster', 'Puffer', 'Shell'],
    tableColors: ['bg-blue-300 border-blue-500', 'bg-cyan-300 border-cyan-500', 'bg-teal-300 border-teal-600', 'bg-green-300 border-green-500', 'bg-yellow-300 border-yellow-500', 'bg-purple-300 border-purple-600', 'bg-gray-300 border-gray-500', 'bg-red-300 border-red-500', 'bg-amber-300 border-amber-500', 'bg-lime-300 border-lime-500', 'bg-fuchsia-300 border-fuchsia-500', 'bg-rose-300 border-rose-400']
  }
};

export const ageThemeMap = age => {
  return ['underwater', 'candyland', 'animals', 'farm', 'fairytales', 'dinosaurs'];
};

export const tableEmojis = [
  '🐻',
  '🦄',
  '🐸',
  '🐯',
  '🐰',
  '🦁',
  '🐵',
  '🐶',
  '🦊',
  '🐼',
  '🐨',
  '🐧'
];

export const tableBgColors = [
  'bg-yellow-300 border-yellow-400',
  'bg-pink-300 border-pink-400',
  'bg-green-300 border-green-400',
  'bg-orange-300 border-orange-400',
  'bg-purple-300 border-purple-400',
  'bg-amber-300 border-amber-400',
  'bg-lime-300 border-lime-400',
  'bg-blue-300 border-blue-400',
  'bg-rose-300 border-rose-400',
  'bg-cyan-300 border-cyan-400',
  'bg-teal-300 border-teal-400',
  'bg-indigo-300 border-indigo-400',
];

const generateAnswers = (correctAnswer) => {
  const answers = [correctAnswer];
  while (answers.length < 4) {
    let wrongAnswer;
    if (correctAnswer <= 10) {
      wrongAnswer = correctAnswer + Math.floor(Math.random() * 11) - 5;
    } else {
      wrongAnswer = correctAnswer + Math.floor(Math.random() * 9) - 4;
    }
    if (wrongAnswer !== correctAnswer &&
      wrongAnswer >= 0 &&
      wrongAnswer <= 25 &&
      !answers.includes(wrongAnswer)) {
      answers.push(wrongAnswer);
    }
  }
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
};

export const beltFacts = {
  'white': [{
    question: '0 + 0',
    correctAnswer: 0,
    multiplier: 0,
    difficulty: 'white'
  }, {
    question: '1 + 1',
    correctAnswer: 2,
    multiplier: 1,
    difficulty: 'white'
  }, {
    question: '0 + 6',
    correctAnswer: 6,
    multiplier: 0,
    difficulty: 'white'
  }, {
    question: '6 + 0',
    correctAnswer: 6,
    multiplier: 6,
    difficulty: 'white'
  }, {
    question: '1 + 6',
    correctAnswer: 7,
    multiplier: 1,
    difficulty: 'white'
  }, {
    question: '6 + 1',
    correctAnswer: 7,
    multiplier: 6,
    difficulty: 'white'
  }, {
    question: '2 + 6',
    correctAnswer: 8,
    multiplier: 2,
    difficulty: 'white'
  }, {
    question: '6 + 2',
    correctAnswer: 8,
    multiplier: 6,
    difficulty: 'white'
  }, {
    question: '3 + 6',
    correctAnswer: 9,
    multiplier: 3,
    difficulty: 'white'
  }, {
    question: '6 + 3',
    correctAnswer: 9,
    multiplier: 6,
    difficulty: 'white'
  }, ],
  'yellow': [{
    question: '0 + 1',
    correctAnswer: 1,
    multiplier: 0,
    difficulty: 'yellow'
  }, {
    question: '1 + 0',
    correctAnswer: 1,
    multiplier: 1,
    difficulty: 'yellow'
  }, {
    question: '1 + 2',
    correctAnswer: 3,
    multiplier: 1,
    difficulty: 'yellow'
  }, {
    question: '2 + 1',
    correctAnswer: 3,
    multiplier: 2,
    difficulty: 'yellow'
  }, {
    question: '0 + 7',
    correctAnswer: 7,
    multiplier: 0,
    difficulty: 'yellow'
  }, {
    question: '7 + 0',
    correctAnswer: 7,
    multiplier: 7,
    difficulty: 'yellow'
  }, {
    question: '1 + 7',
    correctAnswer: 8,
    multiplier: 1,
    difficulty: 'yellow'
  }, {
    question: '7 + 1',
    correctAnswer: 8,
    multiplier: 7,
    difficulty: 'yellow'
  }, {
    question: '2 + 7',
    correctAnswer: 9,
    multiplier: 2,
    difficulty: 'yellow'
  }, {
    question: '7 + 2',
    correctAnswer: 9,
    multiplier: 7,
    difficulty: 'yellow'
  }, {
    question: '3 + 7',
    correctAnswer: 10,
    multiplier: 3,
    difficulty: 'yellow'
  }, {
    question: '7 + 3',
    correctAnswer: 10,
    multiplier: 7,
    difficulty: 'yellow'
  }, ],
  'green': [{
    question: '0 + 2',
    correctAnswer: 2,
    multiplier: 0,
    difficulty: 'green'
  }, {
    question: '2 + 0',
    correctAnswer: 2,
    multiplier: 2,
    difficulty: 'green'
  }, {
    question: '1 + 3',
    correctAnswer: 4,
    multiplier: 1,
    difficulty: 'green'
  }, {
    question: '3 + 1',
    correctAnswer: 4,
    multiplier: 3,
    difficulty: 'green'
  }, {
    question: '0 + 8',
    correctAnswer: 8,
    multiplier: 0,
    difficulty: 'green'
  }, {
    question: '8 + 0',
    correctAnswer: 8,
    multiplier: 8,
    difficulty: 'green'
  }, {
    question: '1 + 8',
    correctAnswer: 9,
    multiplier: 1,
    difficulty: 'green'
  }, {
    question: '8 + 1',
    correctAnswer: 9,
    multiplier: 8,
    difficulty: 'green'
  }, {
    question: '2 + 8',
    correctAnswer: 10,
    multiplier: 2,
    difficulty: 'green'
  }, {
    question: '8 + 2',
    correctAnswer: 10,
    multiplier: 8,
    difficulty: 'green'
  }, {
    question: '4 + 4',
    correctAnswer: 8,
    multiplier: 4,
    difficulty: 'green'
  }, ],
  'blue': [{
    question: '0 + 3',
    correctAnswer: 3,
    multiplier: 0,
    difficulty: 'blue'
  }, {
    question: '3 + 0',
    correctAnswer: 3,
    multiplier: 3,
    difficulty: 'blue'
  }, {
    question: '1 + 4',
    correctAnswer: 5,
    multiplier: 1,
    difficulty: 'blue'
  }, {
    question: '4 + 1',
    correctAnswer: 5,
    multiplier: 4,
    difficulty: 'blue'
  }, {
    question: '0 + 9',
    correctAnswer: 9,
    multiplier: 0,
    difficulty: 'blue'
  }, {
    question: '9 + 0',
    correctAnswer: 9,
    multiplier: 9,
    difficulty: 'blue'
  }, {
    question: '1 + 9',
    correctAnswer: 10,
    multiplier: 1,
    difficulty: 'blue'
  }, {
    question: '9 + 1',
    correctAnswer: 10,
    multiplier: 9,
    difficulty: 'blue'
  }, {
    question: '3 + 3',
    correctAnswer: 6,
    multiplier: 3,
    difficulty: 'blue'
  }, {
    question: '4 + 5',
    correctAnswer: 9,
    multiplier: 4,
    difficulty: 'blue'
  }, {
    question: '5 + 4',
    correctAnswer: 9,
    multiplier: 5,
    difficulty: 'blue'
  }, ],
  'red': [{
    question: '0 + 4',
    correctAnswer: 4,
    multiplier: 0,
    difficulty: 'red'
  }, {
    question: '4 + 0',
    correctAnswer: 4,
    multiplier: 4,
    difficulty: 'red'
  }, {
    question: '2 + 2',
    correctAnswer: 4,
    multiplier: 2,
    difficulty: 'red'
  }, {
    question: '0 + 10',
    correctAnswer: 10,
    multiplier: 0,
    difficulty: 'red'
  }, {
    question: '10 + 0',
    correctAnswer: 10,
    multiplier: 10,
    difficulty: 'red'
  }, {
    question: '2 + 4',
    correctAnswer: 6,
    multiplier: 2,
    difficulty: 'red'
  }, {
    question: '4 + 2',
    correctAnswer: 6,
    multiplier: 4,
    difficulty: 'red'
  }, {
    question: '3 + 4',
    correctAnswer: 7,
    multiplier: 3,
    difficulty: 'red'
  }, {
    question: '4 + 3',
    correctAnswer: 7,
    multiplier: 4,
    difficulty: 'red'
  }, {
    question: '4 + 6',
    correctAnswer: 10,
    multiplier: 4,
    difficulty: 'red'
  }, {
    question: '6 + 4',
    correctAnswer: 10,
    multiplier: 6,
    difficulty: 'red'
  }, ],
  'brown': [{
    question: '0 + 5',
    correctAnswer: 5,
    multiplier: 0,
    difficulty: 'brown'
  }, {
    question: '5 + 0',
    correctAnswer: 5,
    multiplier: 5,
    difficulty: 'brown'
  }, {
    question: '2 + 3',
    correctAnswer: 5,
    multiplier: 2,
    difficulty: 'brown'
  }, {
    question: '3 + 2',
    correctAnswer: 5,
    multiplier: 3,
    difficulty: 'brown'
  }, {
    question: '1 + 5',
    correctAnswer: 6,
    multiplier: 1,
    difficulty: 'brown'
  }, {
    question: '5 + 1',
    correctAnswer: 6,
    multiplier: 5,
    difficulty: 'brown'
  }, {
    question: '2 + 5',
    correctAnswer: 7,
    multiplier: 2,
    difficulty: 'brown'
  }, {
    question: '5 + 2',
    correctAnswer: 7,
    multiplier: 5,
    difficulty: 'brown'
  }, {
    question: '3 + 5',
    correctAnswer: 8,
    multiplier: 3,
    difficulty: 'brown'
  }, {
    question: '5 + 3',
    correctAnswer: 8,
    multiplier: 5,
    difficulty: 'brown'
  }, {
    question: '5 + 5',
    correctAnswer: 10,
    multiplier: 5,
    difficulty: 'brown'
  }, ]
};

const allFacts = Object.values(beltFacts).flat();

export const getQuestionsForLevel = (difficulty, table) => {
  const diff = normalizeDifficulty(difficulty);
  const tbl = typeof table === 'number' ? table : Number(table);
  if (!diff || Number.isNaN(tbl)) return [];

  if (typeof diff === 'string' && diff.startsWith('black')) {
    const degree = parseInt(diff.split('-')[1]);
    const includedLevels = Array.from({ length: degree }, (_, i) => i + 1);

    const allQuestions = [];
    const addQuestions = (qs) => {
      qs.forEach(q => {
        if (!allQuestions.find(eq => eq.question === q.question)) allQuestions.push(q);
      });
    };

    if (includedLevels.includes(1)) addQuestions(beltFacts.white);
    if (includedLevels.includes(2)) addQuestions(beltFacts.yellow);
    if (includedLevels.includes(3)) addQuestions(beltFacts.green);
    if (includedLevels.includes(4)) addQuestions(beltFacts.blue);
    if (includedLevels.includes(5)) addQuestions(beltFacts.red);
    if (includedLevels.includes(6)) addQuestions(beltFacts.brown);

    return allQuestions.filter(q => q.question.split(' + ').map(Number).includes(tbl));
  }

  const newFactsForBelt = (beltFacts[diff] || []).filter(
    q => q.question.split(' + ').map(Number).includes(tbl)
  );
  const newQuestions = newFactsForBelt.slice(0, 2);

  const previousBeltQuestions = [];
  if (diff === 'yellow') previousBeltQuestions.push(...beltFacts.white);
  if (diff === 'green') previousBeltQuestions.push(...beltFacts.white, ...beltFacts.yellow);
  if (diff === 'blue') previousBeltQuestions.push(...beltFacts.white, ...beltFacts.yellow, ...beltFacts.green);
  if (diff === 'red') previousBeltQuestions.push(...beltFacts.white, ...beltFacts.yellow, ...beltFacts.green, ...beltFacts.blue);
  if (diff === 'brown') previousBeltQuestions.push(...beltFacts.white, ...beltFacts.yellow, ...beltFacts.green, ...beltFacts.blue, ...beltFacts.red);

  const remainingQuestions = previousBeltQuestions.sort(() => 0.5 - Math.random());
  const allQuestions = [...newQuestions, ...remainingQuestions];
  return allQuestions.slice(0, 10);
};



export function generateBeltQuestion(difficulty, totalQuestions, askedQuestions, lastQuestion, selectedTable = null) {
  const diff = normalizeDifficulty(difficulty);
  const questionsForLevel = getQuestionsForLevel(diff, selectedTable);

  if (!questionsForLevel || questionsForLevel.length === 0) {
    return { question: '1 + 1', correctAnswer: 2, answers: [1, 2, 3, 4] };
  }

  let nextQuestion = null;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const randomIndex = Math.floor(Math.random() * questionsForLevel.length);
    nextQuestion = questionsForLevel[randomIndex];
    attempts++;
  } while ((nextQuestion.question === lastQuestion || askedQuestions.has(nextQuestion.question)) && attempts < maxAttempts);

  if (!nextQuestion || nextQuestion.question === lastQuestion) {
    const available = questionsForLevel.filter(q => q.question !== lastQuestion && !askedQuestions.has(q.question));
    nextQuestion = available.length ? available[Math.floor(Math.random() * available.length)] : questionsForLevel[0];
  }

  return { ...nextQuestion, answers: generateAnswers(nextQuestion.correctAnswer) };
}

export function getLearningModuleContent(difficulty, selectedTable) {
  const diff = normalizeDifficulty(difficulty);
  const tbl = typeof selectedTable === 'number' ? selectedTable : Number(selectedTable);
  if (!diff || Number.isNaN(tbl)) return '';

  const difficultyFacts = beltFacts[diff];
  if (!difficultyFacts) return '';

  const factsForTable = difficultyFacts.filter(fact => {
    const parts = fact.question.split(' + ').map(Number);
    return parts.includes(tbl);
  });

  return factsForTable.length
    ? factsForTable.map(f => `${f.question} = ${f.correctAnswer}`).join('\n\n\n')
    : '';
}


export function generatePreTestQuestion(askedQuestions) {
  const questions = [
    { question: '1 + 4', correctAnswer: 5 },
    { question: '2 + 3', correctAnswer: 5 },
    { question: '3 + 2', correctAnswer: 5 },
    { question: '4 + 1', correctAnswer: 5 },
    { question: '0 + 5', correctAnswer: 5 },
    { question: '5 + 0', correctAnswer: 5 }
  ];
  const availableQuestions = questions.filter(q => !askedQuestions.has(q.question));
  if (availableQuestions.length === 0) {
    return null;
  }
  const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  return {
    ...nextQuestion,
    answers: generateAnswers(nextQuestion.correctAnswer)
  };
}