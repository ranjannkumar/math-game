// src/hooks/useMathGame.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateBeltQuestion, getLearningModuleContent, beltFacts } from '../utils/gameLogic';
import audioManager from '../utils/audioUtils';

const useMathGame = () => {
  const [screen, setScreen] = useState('start');
  const [currentPage, setCurrentPage] = useState('picker');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showLearningModule, setShowLearningModule] = useState(false);
  const [learningModuleContent, setLearningModuleContent] = useState('');
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [showLearningQuestion, setShowLearningQuestion] = useState(false);
  const [learningQuestion, setLearningQuestion] = useState(null);
  const [learningQuestionIndex, setLearningQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizProgress, setQuizProgress] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [slowQuestions, setSlowQuestions] = useState(new Set());
  const [correctCountForCompletion, setCorrectCountForCompletion] = useState(0);
  const [answerSymbols, setAnswerSymbols] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastWhiteBeltNumber, setLastWhiteBeltNumber] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [childName, setChildName] = useState(() => localStorage.getItem('math-child-name') || '');
  const [childAge, setChildAge] = useState(() => localStorage.getItem('math-child-age') || '');
  const [showPreTestPopup, setShowPreTestPopup] = useState(false);
  const [preTestSection, setPreTestSection] = useState('intro');
  const [preTestQuestions, setPreTestQuestions] = useState([]);
  const [preTestCurrentQuestion, setPreTestCurrentQuestion] = useState(0);
  const [preTestScore, setPreTestScore] = useState(0);
  const [preTestInputValue, setPreTestInputValue] = useState('');
  const [preTestTimer, setPreTestTimer] = useState(0);
  const [preTestTimerActive, setPreTestTimerActive] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [preTestResults, setPreTestResults] = useState(null);
  const [completedSections, setCompletedSections] = useState(() => {
    const saved = localStorage.getItem('math-completed-sections');
    return saved ? JSON.parse(saved) : {
      addition: false, subtraction: false, multiplication: false, division: false
    };
  });
  const [isBlackUnlocked, setIsBlackUnlocked] = useState(false);
  const [showBlackBeltDegrees, setShowBlackBeltDegrees] = useState(false);
  const [unlockedDegrees, setUnlockedDegrees] = useState(() => {
    const saved = localStorage.getItem('math-unlocked-degrees');
    return saved ? JSON.parse(saved) : [1];
  });
  const [completedBlackBeltDegrees, setCompletedBlackBeltDegrees] = useState(() => {
    const saved = localStorage.getItem('math-completed-black-belt-degrees');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDegree, setCurrentDegree] = useState(1);
  const [tableProgress, setTableProgress] = useState({});
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [speedTestPopupVisible, setSpeedTestPopupVisible] = useState(false);
  const [speedTestPopupAnimation, setSpeedTestPopupAnimation] = useState('animate-pop-in');
  const [speedTestNumbers, setSpeedTestNumbers] = useState([]);
  const [currentSpeedTestIndex, setCurrentSpeedTestIndex] = useState(-1);
  const [speedTestStartTime, setSpeedTestStartTime] = useState(null);
  const [speedTestTimes, setSpeedTestTimes] = useState([]);
  const [speedTestComplete, setSpeedTestComplete] = useState(false);
  const [speedTestStarted, setSpeedTestStarted] = useState(false);
  const [speedTestCorrectCount, setSpeedTestCorrectCount] = useState(0);
  const [speedTestShowTick, setSpeedTestShowTick] = useState(false);
  const [studentReactionSpeed, setStudentReactionSpeed] = useState(() => 
    parseFloat(localStorage.getItem('math-reaction-speed') || '1.0')
  );
  
  const timeoutRef = useRef(null);
  const questionTimeoutId = useRef(null);
  const answeredQuestions = useRef(new Set());
  const questionStartTimestamp = useRef(0);

  const maxQuestions = selectedDifficulty === 'brown' ? 10 : (selectedDifficulty && selectedDifficulty.startsWith('black')) ? (selectedDifficulty === 'black-7' ? 30 : 20) : 10;
  
  useEffect(() => {
    const today = new Date().toDateString();
    const lastQuizDay = localStorage.getItem('math-last-quiz-day');
    if (lastQuizDay !== today) {
      setPausedTime(0);
      setIsTimerPaused(false);
      localStorage.setItem('math-last-quiz-day', today);
    }
  }, []);
  
  useEffect(() => {
    const loadTableProgress = () => {
      const loadedProgress = {};
      for (let table = 1; table <= 12; table++) {
        loadedProgress[table] = {};
        ['white', 'yellow', 'green', 'blue', 'red', 'brown'].forEach(belt => {
          const key = `math-table-progress-${table}-${belt}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed?.perfectPerformance === true) {
                loadedProgress[table][belt] = parsed;
              }
            } catch (error) {
              if (saved === 'completed') {
                loadedProgress[table][belt] = { completed: true, perfectPerformance: false };
              } else if (saved === 'perfect') {
                loadedProgress[table][belt] = { completed: true, perfectPerformance: true };
              }
            }
          }
        });
      }
      setTableProgress(loadedProgress);
    };
    loadTableProgress();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('math-completed-sections', JSON.stringify(completedSections));
  }, [completedSections]);
  
  useEffect(() => {
    localStorage.setItem('math-unlocked-degrees', JSON.stringify(unlockedDegrees));
  }, [unlockedDegrees]);
  
  useEffect(() => {
    localStorage.setItem('math-completed-black-belt-degrees', JSON.stringify(completedBlackBeltDegrees));
  }, [completedBlackBeltDegrees]);


  const handleNextQuestion = useCallback(() => {
    if (answeredQuestions.current.size >= maxQuestions) {
      setShowResult(true);
      if (correctCount === maxQuestions) {
          audioManager.playCompleteSound();
          if (selectedDifficulty && selectedDifficulty.startsWith('black')) {
            const currentDegree = parseInt(selectedDifficulty.split('-')[1]);
            const nextDegree = currentDegree + 1;
            if (nextDegree <= 7 && !unlockedDegrees.includes(nextDegree)) {
              setUnlockedDegrees(prev => [...prev, nextDegree]);
            }
            if (!completedBlackBeltDegrees.includes(currentDegree)) {
              setCompletedBlackBeltDegrees(prev => [...prev, currentDegree]);
            }
            if (currentDegree === 7) {
              // Move to next level
              const nextLevel = selectedTable + 1;
              localStorage.setItem('math-unlocked-level', nextLevel);
              setTimeout(() => {
                setCurrentPage('picker');
                setScreen('main');
              }, 5000);
            }
          } else {
            const currentTableProgress = tableProgress[selectedTable] || {};
            const nextBeltIndex = ['white', 'yellow', 'green', 'blue', 'red', 'brown'].indexOf(selectedDifficulty) + 1;
            const nextBelt = ['white', 'yellow', 'green', 'blue', 'red', 'brown'][nextBeltIndex];
            if (nextBelt) {
              localStorage.setItem(`math-table-progress-${selectedTable}-${nextBelt}`, JSON.stringify({ perfectPerformance: true, completed: true }));
              setTableProgress(prev => ({ ...prev, [selectedTable]: { ...prev[selectedTable], [nextBelt]: { perfectPerformance: true, completed: true } } }));
            }
          }
      }
      return;
    }
    
    let newQuestion;
    const currentQuestionCount = answeredQuestions.current.size;
    
    if (beltFacts[selectedDifficulty] && currentQuestionCount < beltFacts[selectedDifficulty].length * 2) {
      const factIndex = Math.floor(currentQuestionCount / 2);
      const fact = beltFacts[selectedDifficulty][factIndex];
      newQuestion = {
        question: fact.question,
        correctAnswer: fact.correctAnswer,
        answers: generateAnswers(fact.correctAnswer)
      };
    } else {
      const allQuestions = Object.values(beltFacts).flat();
      const availableQuestions = allQuestions.filter(q => !answeredQuestions.current.has(q.question));
      
      let attempts = 0;
      do {
        newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        attempts++;
      } while (newQuestion.question === lastQuestion && attempts < 100);
    }
    
    setCurrentQuestion(newQuestion);
    answeredQuestions.current.add(newQuestion.question);
    setLastQuestion(newQuestion.question);
    questionStartTimestamp.current = Date.now();
    startQuestionTimer();
  }, [selectedDifficulty, maxQuestions, correctCount, unlockedDegrees, completedBlackBeltDegrees, selectedTable, tableProgress, lastQuestion]);

  const handleTimeout = useCallback(() => {
    if (!currentQuestion) return;
    setWrongCount(prev => prev + 1);
    audioManager.playWrongSound();
    
    setAnswerSymbols(prev => [...prev, { symbol: '❌', isCorrect: false, timeTaken: 5 }]);
    
    setIsTimerPaused(true);
    setPausedTime(Date.now());

    // Show Learning Module on inactivity
    const content = getLearningModuleContent(selectedDifficulty, selectedTable);
    setLearningModuleContent(content);
    setPendingDifficulty(selectedDifficulty);
    setShowLearningModule(true);
    
  }, [currentQuestion, selectedDifficulty, selectedTable]);

  const startQuestionTimer = useCallback(() => {
    if (questionTimeoutId.current) {
      clearTimeout(questionTimeoutId.current);
    }
    questionTimeoutId.current = setTimeout(() => {
      handleTimeout();
    }, 5000);
  }, [handleTimeout]);
  
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

  const completeSpeedTest = useCallback(() => {
    const avgTime = speedTestTimes.slice(0, 5).reduce((sum, time) => sum + time, 0) / 5;
    const normalizedSpeed = Math.max(0.5, Math.min(1.5, avgTime / 1.5));
    localStorage.setItem('math-reaction-speed', normalizedSpeed.toFixed(2));
    setStudentReactionSpeed(normalizedSpeed);
    setSpeedTestComplete(true);
    audioManager.playCompleteSound();
    setSpeedTestShowTick(true);
    setTimeout(() => {
      setSpeedTestPopupAnimation('animate-pop-out');
      setTimeout(() => {
        setShowSpeedTest(false);
        setSpeedTestPopupVisible(false);
      }, 500);
    }, 3000);
  }, [speedTestTimes, setStudentReactionSpeed, setSpeedTestComplete, setSpeedTestShowTick, setSpeedTestPopupAnimation, setShowSpeedTest, setSpeedTestPopupVisible]);

  const handleSpeedTestInput = useCallback((number) => {
    if (!speedTestStarted || speedTestComplete) return;
    const currentTime = Date.now();
    if (number === speedTestNumbers[currentSpeedTestIndex]) {
      const reactionTime = (currentTime - speedTestStartTime) / 1000;
      setSpeedTestTimes(prev => [...prev, reactionTime]);
      const newCorrectCount = speedTestCorrectCount + 1;
      setSpeedTestCorrectCount(newCorrectCount);
      if (newCorrectCount < 5) {
        setCurrentSpeedTestIndex(prev => prev + 1);
        setSpeedTestStartTime(Date.now());
        audioManager.playCorrectSound();
      } else {
        completeSpeedTest();
      }
    } else {
      setSpeedTestTimes(prev => [...prev, 3.0]);
      audioManager.playWrongSound();
      setCurrentSpeedTestIndex(prev => prev + 1);
      setSpeedTestStartTime(Date.now());
    }
  }, [speedTestStarted, speedTestComplete, speedTestNumbers, currentSpeedTestIndex, speedTestStartTime, speedTestCorrectCount, completeSpeedTest]);


  const handleAnswer = useCallback((selectedAnswer, answerIdx) => {
    if (isAnimating || showResult) return;
    if (questionTimeoutId.current) {
      clearTimeout(questionTimeoutId.current);
      questionTimeoutId.current = null;
    }
    if (!currentQuestion) return;
    setIsAnimating(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeTaken = (Date.now() - questionStartTimestamp.current) / 1000;
    
    setQuestionTimes(times => [...times, timeTaken]);

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      audioManager.playCorrectSound();
      setQuizProgress(prev => Math.min(prev + (100 / maxQuestions), 100));

      if (timeTaken <= 1.5) {
        setAnswerSymbols(prev => [...prev, { symbol: '⚡', isCorrect: true, timeTaken }]);
      } else if (timeTaken <= 2) {
        setAnswerSymbols(prev => [...prev, { symbol: '⭐', isCorrect: true, timeTaken }]);
      } else if (timeTaken <= 5) {
        setAnswerSymbols(prev => [...prev, { symbol: '✓', isCorrect: true, timeTaken }]);
      } else {
        setAnswerSymbols(prev => [...prev, { symbol: '❌', isCorrect: true, timeTaken }]);
      }

    } else {
      setWrongCount(w => w + 1);
      audioManager.playWrongSound();
      setAnswerSymbols(prev => [...prev, { symbol: '❌', isCorrect: false, timeTaken }]);
      setIsTimerPaused(true);
      setPausedTime(Date.now());
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      handleNextQuestion();
    }, 500);

    if (isCorrect) {
      setIsTimerPaused(false);
      setQuizStartTime(prev => prev + (Date.now() - pausedTime));
    }
  }, [currentQuestion, isAnimating, showResult, questionStartTimestamp, handleNextQuestion, maxQuestions, pausedTime]);

  const startActualQuiz = useCallback((difficulty, table) => {
    setSelectedDifficulty(difficulty);
    setSelectedTable(table);
    setShowDifficultyPicker(false);
    setCurrentPage('quiz');
    setShowLearningModule(false);
    setCorrectCount(0);
    setWrongCount(0);
    setShowResult(false);
    setIsAnimating(false);
    setSlowQuestions(new Set());
    setCorrectCountForCompletion(0);
    setAnswerSymbols([]);
    setElapsedTime(0);
    setQuizStartTime(Date.now());
    setPausedTime(0);
    setIsTimerPaused(false);
    setLastQuestion('');
    answeredQuestions.current = new Set();
    const firstQuestion = generateBeltQuestion(difficulty, 0, answeredQuestions.current, '', table);
    setCurrentQuestion(firstQuestion);
    answeredQuestions.current.add(firstQuestion.question);
    setLastQuestion(firstQuestion.question);
    questionStartTimestamp.current = Date.now();
    startQuestionTimer();
  }, [setAnswerSymbols, setCorrectCountForCompletion, setElapsedTime, setLastQuestion, setPausedTime, setQuizStartTime, setShowDifficultyPicker, setShowLearningModule, setShowResult, setSelectedDifficulty, setSelectedTable, startQuestionTimer]);
  
  const startQuizWithDifficulty = useCallback((difficulty) => {
    const newContent = getLearningModuleContent(difficulty, selectedTable);
    setLearningModuleContent(newContent);
    setPendingDifficulty(difficulty);
    setShowLearningModule(true);
  }, [selectedTable]);

  const handleResetProgress = useCallback(() => {
    localStorage.clear();
    setScreen('start');
    setCurrentPage('picker');
    setSelectedTable(null);
    setSelectedDifficulty(null);
    setTableProgress({});
    setCompletedSections({});
  }, []);

  const handleConfirmQuit = useCallback(() => {
    setShowQuitModal(false);
    setScreen('start');
  }, []);

  const handleCancelQuit = useCallback(() => {
    setShowQuitModal(false);
  }, []);
  
  const handleNameSubmit = useCallback((e) => {
    e.preventDefault();
    if (childName.trim()) {
      localStorage.setItem('math-child-name', childName.trim());
      setScreen('theme');
    }
  }, [childName, setScreen]);

  const handleBackToThemePicker = useCallback(() => {
    setScreen('theme');
  }, [setScreen]);

  const handleBackToNameForm = useCallback(() => {
    setScreen('name');
  }, [setScreen]);
  
  const openSpeedTest = useCallback(() => {
    const numbers = Array.from({ length: 15 }, () => Math.floor(Math.random() * 9) + 1);
    setSpeedTestNumbers(numbers);
    setCurrentSpeedTestIndex(-1);
    setSpeedTestTimes([]);
    setSpeedTestComplete(false);
    setSpeedTestStartTime(null);
    setSpeedTestStarted(false);
    setSpeedTestCorrectCount(0);
    setSpeedTestShowTick(false);
    setSpeedTestPopupVisible(true);
    setSpeedTestPopupAnimation('animate-pop-in');
    setShowSpeedTest(true);
    audioManager.playButtonClick();
  }, []);

  return {
    screen, setScreen,
    currentPage, setCurrentPage,
    selectedTable, setSelectedTable,
    selectedDifficulty, setSelectedDifficulty,
    showDifficultyPicker, setShowDifficultyPicker,
    showLearningModule, setShowLearningModule,
    learningModuleContent, setLearningModuleContent,
    showLearningQuestion, setShowLearningQuestion,
    learningQuestion, setLearningQuestion,
    learningQuestionIndex, setLearningQuestionIndex,
    isAnimating, setIsAnimating,
    showResult, setShowResult,
    quizProgress, setQuizProgress,
    correctCount, setCorrectCount,
    wrongCount, setWrongCount,
    questionTimes, setQuestionTimes,
    slowQuestions, setSlowQuestions,
    correctCountForCompletion, setCorrectCountForCompletion,
    answerSymbols, setAnswerSymbols,
    currentQuestion, setCurrentQuestion,
    lastQuestion, setLastQuestion,
    lastWhiteBeltNumber, setLastWhiteBeltNumber,
    quizStartTime, setQuizStartTime,
    elapsedTime, setElapsedTime,
    pausedTime, setPausedTime,
    isTimerPaused, setIsTimerPaused,
    countdown, setCountdown,
    showSettings, setShowSettings,
    showQuitModal, setShowQuitModal,
    selectedTheme, setSelectedTheme,
    childName, setChildName,
    childAge, setChildAge,
    showPreTestPopup, setShowPreTestPopup,
    preTestSection, setPreTestSection,
    preTestQuestions, setPreTestQuestions,
    preTestCurrentQuestion, setPreTestCurrentQuestion,
    preTestScore, setPreTestScore,
    preTestInputValue, setPreTestInputValue,
    preTestTimer, setPreTestTimer,
    preTestTimerActive, setPreTestTimerActive,
    showResultsModal, setShowResultsModal,
    preTestResults, setPreTestResults,
    completedSections, setCompletedSections,
    handleConfirmQuit, handleCancelQuit,
    startQuizWithDifficulty, startActualQuiz,
    handleAnswer, handleResetProgress,
    handleBackToThemePicker, handleBackToNameForm,
    handleNameSubmit,
    isBlackUnlocked, setIsBlackUnlocked,
    showBlackBeltDegrees, setShowBlackBeltDegrees,
    unlockedDegrees, setUnlockedDegrees,
    completedBlackBeltDegrees, setCompletedBlackBeltDegrees,
    currentDegree, setCurrentDegree,
    tableProgress, setTableProgress,
    showSpeedTest, setShowSpeedTest,
    speedTestPopupVisible, setSpeedTestPopupVisible,
    speedTestPopupAnimation, setSpeedTestPopupAnimation,
    speedTestNumbers, setSpeedTestNumbers,
    currentSpeedTestIndex, setCurrentSpeedTestIndex,
    speedTestStartTime, setSpeedTestStartTime,
    speedTestTimes, setSpeedTestTimes,
    speedTestComplete, setSpeedTestComplete,
    speedTestStarted, setSpeedTestStarted,
    speedTestCorrectCount, setSpeedTestCorrectCount,
    speedTestShowTick, setSpeedTestShowTick,
    studentReactionSpeed, setStudentReactionSpeed,
    openSpeedTest,
    handleSpeedTestInput,
    completeSpeedTest
  };
};

export default useMathGame;