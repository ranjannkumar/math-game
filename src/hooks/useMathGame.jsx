import { useState, useEffect, useRef, useCallback } from 'react';
import { generateBeltQuestion, themeConfigs } from '../utils/gameLogic';
import audioManager from '../utils/audioUtils';

const useMathGame = () => {
  const [screen, setScreen] = useState('start');
  const [currentPage, setCurrentPage] = useState('picker');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showLearningModule, setShowLearningModule] = useState(false);
  const [learningModuleContent, setLearningModuleContent] = useState('');
  const [showLearningQuestion, setShowLearningQuestion] = useState(false);
  const [learningQuestion, setLearningQuestion] = useState(null);
  const [showLearningNextButton, setShowLearningNextButton] = useState(false);
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
  const [unlockedDegrees, setUnlockedDegrees] = useState([1]);
  const [completedBlackBeltDegrees, setCompletedBlackBeltDegrees] = useState([]);
  const [currentDegree, setCurrentDegree] = useState(1);

  const [tableProgress, setTableProgress] = useState({});
  const timeoutRef = useRef(null);
  const questionTimeoutId = useRef(null);
  const answeredQuestions = useRef(new Set());
  const maxQuestions = selectedDifficulty === 'brown' ? 10 : (selectedDifficulty && selectedDifficulty.startsWith('black')) ? 20 : 10;
  
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

  const startQuestionTimer = useCallback(() => {
    if (questionTimeoutId.current) {
      clearTimeout(questionTimeoutId.current);
    }
    questionTimeoutId.current = setTimeout(() => {
      handleTimeout();
    }, 5000);
  }, []);
  
  const handleTimeout = useCallback(() => {
    if (!currentQuestion) return;
    setWrongCount(prev => prev + 1);
    audioManager.playWrongSound();
    // Logic for showing wrong answer/practice popup here
    // For now, let's just move on
    handleNextQuestion();
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    const newTotalQuestions = answeredQuestions.current.size + 1;
    if (newTotalQuestions >= maxQuestions) {
      setShowResult(true);
      audioManager.playCompleteSound();
      return;
    }
    
    // Generate new question based on difficulty and progress
    const newQuestion = generateBeltQuestion(selectedDifficulty, answeredQuestions.current.size, answeredQuestions.current, lastQuestion, selectedTable);
    setCurrentQuestion(newQuestion);
    answeredQuestions.current.add(newQuestion.question);
    setLastQuestion(newQuestion.question);
    startQuestionTimer();
  }, [selectedDifficulty, selectedTable, lastQuestion, maxQuestions, answeredQuestions, startQuestionTimer]);

  const handleAnswer = useCallback((selectedAnswer, answerIdx) => {
    if (isAnimating || showResult) return;

    if (questionTimeoutId.current) {
      clearTimeout(questionTimeoutId.current);
      questionTimeoutId.current = null;
    }

    if (!currentQuestion) return;
    
    setIsAnimating(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const timeTaken = (Date.now() - quizStartTime) / 1000;
    setQuestionTimes(times => [...times, timeTaken]);

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      audioManager.playCorrectSound();
      setQuizProgress(prev => Math.min(prev + (100 / maxQuestions), 100));
    } else {
      setWrongCount(w => w + 1);
      audioManager.playWrongSound();
      // Show practice modal or similar logic
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      handleNextQuestion();
    }, 500);
  }, [currentQuestion, isAnimating, showResult, quizStartTime, handleNextQuestion, maxQuestions]);

  const startActualQuiz = useCallback((difficulty, table) => {
    setSelectedDifficulty(difficulty);
    setSelectedTable(table);
    setShowDifficultyPicker(false);
    setCurrentPage('quiz');
    setShowLearningModule(false);
    
    // Reset all quiz-related state
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
    setAnswerFeedback(null);
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
    
    // Generate first question
    const firstQuestion = generateBeltQuestion(difficulty, 0, answeredQuestions.current, '', table);
    setCurrentQuestion(firstQuestion);
    answeredQuestions.current.add(firstQuestion.question);
    setLastQuestion(firstQuestion.question);
    startQuestionTimer();
  }, [setAnswerSymbols, setCorrectCountForCompletion, setElapsedTime, setLastQuestion, setPausedTime, setQuizStartTime, setShowDifficultyPicker, setShowLearningModule, setShowResult, setSelectedDifficulty, setSelectedTable, startQuestionTimer]);
  
  const startQuizWithDifficulty = useCallback((difficulty) => {
    const newContent = getLearningModuleContent(difficulty, selectedTable);
    setLearningModuleContent(newContent);
    setShowLearningModule(true);
  }, [selectedTable]);

  const handleResetProgress = () => {
    localStorage.clear();
    setScreen('start');
    setCurrentPage('picker');
    setSelectedTable(null);
    setSelectedDifficulty(null);
    setTableProgress({});
    setCompletedSections({});
  };

  const handleConfirmQuit = () => {
    setShowQuitModal(false);
    setScreen('start');
  };

  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };
  
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (childName.trim()) {
      localStorage.setItem('math-child-name', childName.trim());
      setScreen('theme');
      setShowThemePicker(true);
    }
  };

  const handleBackToThemePicker = () => {
    setShowThemePicker(true);
    setCurrentPage('picker');
  };

  const handleBackToNameForm = () => {
    setScreen('name');
    setShowThemePicker(false);
  };
  
  const getLearningModuleContent = (difficulty, table) => {
    // Logic from the original App.js
    if (difficulty === 'white' && table === 1) return '0 + 0 = 0';
    if (difficulty === 'yellow' && table === 1) return '0 + 1 = 1';
    //... add more logic as needed for other belts and levels
    return 'Learning module content not found.';
  };


  return {
    screen, setScreen,
    currentPage, setCurrentPage,
    selectedTable, setSelectedTable,
    selectedDifficulty, setSelectedDifficulty,
    showThemePicker, setShowThemePicker,
    showDifficultyPicker, setShowDifficultyPicker,
    showLearningModule, setShowLearningModule,
    learningModuleContent, setLearningModuleContent,
    showLearningQuestion, setShowLearningQuestion,
    learningQuestion, setLearningQuestion,
    showLearningNextButton, setShowLearningNextButton,
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
    tableProgress, setTableProgress
  };
};

export default useMathGame;