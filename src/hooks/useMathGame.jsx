// src/hooks/useMathGame.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { buildQuizForBelt, getLearningModuleContent } from '../utils/mathGameLogic.js';
import audioManager from '../utils/audioUtils.js';
import { useNavigate } from 'react-router-dom';

const useMathGame = () => {
  const navigate = useNavigate();

  // ---------- global nav/state ----------
  const [screen, setScreen] = useState('start');
  const [currentPage, setCurrentPage] = useState('picker');
  const [selectedTable, setSelectedTable] = useState(null); // level (1..6)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null); // belt or black-x
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  // Learning module
  const [showLearningModule, setShowLearningModule] = useState(false);
  const [learningModuleContent, setLearningModuleContent] = useState('');
  const [showLearningQuestion, setShowLearningQuestion] = useState(false);
  const [learningQuestion, setLearningQuestion] = useState(null);
  const [learningQuestionIndex, setLearningQuestionIndex] = useState(0);

  // Quiz/result UI
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastWhiteBeltNumber, setLastWhiteBeltNumber] = useState(null);

  // Timers
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Misc UI
  const [countdown, setCountdown] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [childName, setChildName] = useState(() => localStorage.getItem('math-child-name') || '');
  const [childAge, setChildAge] = useState(() => localStorage.getItem('math-child-age') || '');

  // Pre-test
  const [showPreTestPopup, setShowPreTestPopup] = useState(false);
  const [preTestSection, setPreTestSection] = useState('addition');
  const [preTestQuestions, setPreTestQuestions] = useState([]);
  const [preTestCurrentQuestion, setPreTestCurrentQuestion] = useState(0);
  const [preTestScore, setPreTestScore] = useState(0);
  const [preTestInputValue, setPreTestInputValue] = useState('');
  const [preTestTimer, setPreTestTimer] = useState(0);
  const [preTestTimerActive, setPreTestTimerActive] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [preTestResults, setPreTestResults] = useState(null);
  const [completedSections, setCompletedSections] = useState({});

  // Black belt
  const [isBlackUnlocked, setIsBlackUnlocked] = useState(false);
  const [showBlackBeltDegrees, setShowBlackBeltDegrees] = useState(false);
  const [unlockedDegrees, setUnlockedDegrees] = useState(() => {
    const saved = localStorage.getItem('math-unlocked-degrees');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [completedBlackBeltDegrees, setCompletedBlackBeltDegrees] = useState(() => {
    const saved = localStorage.getItem('math-completed-black-belt-degrees');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentDegree, setCurrentDegree] = useState(1);

  // Belt progress (levels → belts)
  const [tableProgress, setTableProgress] = useState({});

  // Speed test
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

  // Learning / intervention
  const [pendingDifficulty, setPendingDifficulty] = useState(null);

  // ---------- quiz control ----------
  const questionTimeoutId = useRef(null);
  const questionStartTimestamp = useRef(null);
  const answeredQuestions = useRef(new Set());
  const quizQuestions = useRef([]); // built questions

  const maxQuestions =
    selectedDifficulty && selectedDifficulty.startsWith('black')
      ? (selectedDifficulty.endsWith('7') ? 30 : 20)
      : 10;

  // Load belt progress from localStorage once (FIXED try/catch)
  useEffect(() => {
    const loadedProgress = {};
    for (let table = 1; table <= 12; table++) {
      loadedProgress[table] = {};
      ['white', 'yellow', 'green', 'blue', 'red', 'brown'].forEach((belt) => {
        const key = `math-table-progress-${table}-${belt}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
              loadedProgress[table][belt] = {
                completed: !!parsed.completed,
                perfectPerformance: !!parsed.perfectPerformance,
              };
            }
          } catch {
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
  }, []);

  // persist smaller bits
  useEffect(() => {
    localStorage.setItem('math-completed-sections', JSON.stringify(completedSections));
  }, [completedSections]);

  useEffect(() => {
    localStorage.setItem('math-unlocked-degrees', JSON.stringify(unlockedDegrees));
  }, [unlockedDegrees]);

  useEffect(() => {
    localStorage.setItem(
      'math-completed-black-belt-degrees',
      JSON.stringify(completedBlackBeltDegrees)
    );
  }, [completedBlackBeltDegrees]);

  // ----- HARD RESET of quiz state (helper) -----
  const hardResetQuizState = useCallback(() => {
    // progress / meta
    setQuizProgress(0);
    setAnswerSymbols([]);
    setCorrectCount(0);
    setWrongCount(0);
    setQuestionTimes([]);
    setSlowQuestions(new Set());
    setCorrectCountForCompletion(0);

    // questions & indices
    quizQuestions.current = [];
    answeredQuestions.current = new Set();
    setCurrentQuestion(null);
    setCurrentQuestionIndex(0);
    setLastQuestion('');

    // timers
    setQuizStartTime(null);
    setElapsedTime(0);
    setPausedTime(0);
    setIsTimerPaused(false);

    // flags
    setShowResult(false);
    setIsAnimating(false);
    setShowLearningQuestion(false);
  }, []);

  // Launch learning sequence BEFORE quiz — also reset progress here (fixes stale progress bar)
  const startQuizWithDifficulty = useCallback(
    (difficulty) => {
      hardResetQuizState(); // ← ensure progress bar & symbols reset

      setSelectedDifficulty(difficulty);
      setLearningQuestionIndex(0);
      const content = getLearningModuleContent(difficulty, selectedTable);
      setLearningModuleContent(content);
      setPendingDifficulty(difficulty);
      setShowLearningModule(true);
      navigate('/learning');
    },
    [navigate, selectedTable, hardResetQuizState]
  );

  // Start actual quiz (after learning) — resets again (double guard)
  const startActualQuiz = useCallback(
    (difficulty, table) => {
      hardResetQuizState(); // ← guard second time in case of bouncing

      setSelectedDifficulty(difficulty);
      setSelectedTable(table);

      // Build questions and start
      quizQuestions.current = buildQuizForBelt(table, difficulty);
      if (quizQuestions.current.length === 0) {
        quizQuestions.current = buildQuizForBelt(1, 'white');
      }
      setCurrentQuestionIndex(0);
      const first = quizQuestions.current[0];
      setCurrentQuestion(first);
      answeredQuestions.current.add(first.question);

      setQuizStartTime(Date.now());
      questionStartTimestamp.current = Date.now();
    },
    [hardResetQuizState]
  );

  const handleNextQuestion = useCallback(() => {
    const total = Math.min(maxQuestions, quizQuestions.current.length);

    if (currentQuestionIndex + 1 >= total) {
      setShowResult(true);
      navigate('/results');
      return;
    }

    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    const nextQ = quizQuestions.current[nextIdx];
    setCurrentQuestion(nextQ);
    answeredQuestions.current.add(nextQ.question);
    setLastQuestion(nextQ.question);

    questionStartTimestamp.current = Date.now();
    setIsTimerPaused(false);
    setPausedTime(0);
  }, [currentQuestionIndex, maxQuestions, navigate]);

  // Timer
  useEffect(() => {
    let timer;
    if (!isTimerPaused && quizStartTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerPaused, quizStartTime]);

  const handleNameSubmit = useCallback(() => {
    if (childName.trim()) {
      localStorage.setItem('math-child-name', childName.trim());
      navigate('/pre-test-popup');
    }
  }, [childName, navigate]);

  const handleAnswer = useCallback(
    (selectedAnswer) => {
      if (isAnimating || showResult) return;
      if (questionTimeoutId.current) {
        clearTimeout(questionTimeoutId.current);
        questionTimeoutId.current = null;
      }
      if (!currentQuestion) return;
      setIsAnimating(true);

      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      const timeTaken = (Date.now() - questionStartTimestamp.current) / 1000;

      setQuestionTimes((times) => [...times, timeTaken]);

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        audioManager.playCorrectSound();
        setQuizProgress((prev) => Math.min(prev + 100 / maxQuestions, 100));
        setCorrectCountForCompletion((prev) => prev + 1);

        const today = new Date().toLocaleDateString();
        const currentDailyCorrect = parseInt(
          localStorage.getItem(`math-daily-correct-${today}`) || '0',
          10
        );
        localStorage.setItem(`math-daily-correct-${today}`, currentDailyCorrect + 1);

        if (timeTaken <= 1.5) {
          setAnswerSymbols((prev) => [...prev, { symbol: '⚡', isCorrect: true, timeTaken }]);
        } else if (timeTaken <= 2) {
          setAnswerSymbols((prev) => [...prev, { symbol: '⭐', isCorrect: true, timeTaken }]);
        } else if (timeTaken <= 5) {
          setAnswerSymbols((prev) => [...prev, { symbol: '✓', isCorrect: true, timeTaken }]);
        } else {
          setAnswerSymbols((prev) => [...prev, { symbol: '❌', isCorrect: true, timeTaken }]);
          setSlowQuestions((prev) => new Set(prev).add(currentQuestion.question));
        }
      } else {
        setWrongCount((w) => w + 1);
        audioManager.playWrongSound();
        setAnswerSymbols((prev) => [...prev, { symbol: '❌', isCorrect: false, timeTaken }]);
        // Pause + show learning overlay; resume will happen after practice
        setIsTimerPaused(true);
        setPausedTime(Date.now());
        setPendingDifficulty(selectedDifficulty);
        navigate('/learning');
      }

      setTimeout(() => {
        setIsAnimating(false);
        if (isCorrect) {
          handleNextQuestion();
        }
      }, 500);

      if (isCorrect) {
        setIsTimerPaused(false);
        setQuizStartTime((prev) => (prev ? prev + (Date.now() - pausedTime) : prev));
      }
    },
    [
      currentQuestion,
      isAnimating,
      showResult,
      maxQuestions,
      pausedTime,
      selectedDifficulty,
      navigate,
      handleNextQuestion,
    ]
  );

  const handleBackToThemePicker = useCallback(() => {
    navigate('/theme');
  }, [navigate]);

  const handleBackToNameForm = useCallback(() => {
    navigate('/name');
  }, [navigate]);

  // Resume quiz after an intervention practice correct answer
  const resumeQuizAfterIntervention = useCallback(() => {
    setIsTimerPaused(false);
    if (pausedTime && quizStartTime) {
      setQuizStartTime((prev) => (prev ? prev + (Date.now() - pausedTime) : prev));
    }
    handleNextQuestion();
  }, [handleNextQuestion, pausedTime, quizStartTime]);

  const handleConfirmQuit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCancelQuit = useCallback(() => {
    setShowQuitModal(false);
  }, []);

  const handleResetProgress = useCallback(() => {
    localStorage.clear();
    setScreen('start');
    setCurrentPage('picker');
    setSelectedTable(null);
    setSelectedDifficulty(null);
    setTableProgress({});
    setCompletedSections({});
    hardResetQuizState();
    navigate('/');
  }, [navigate, hardResetQuizState]);

  const handleNameChange = useCallback((e) => setChildName(e.target.value), []);
  const handleAgeChange = useCallback((e) => setChildAge(e.target.value), []);

  const getQuizTimeLimit = useCallback(() => {
    if (!selectedDifficulty) return 0;
    if (selectedDifficulty.startsWith('black')) {
      return selectedDifficulty.endsWith('7') ? 30 : 60;
    }
    return 0;
  }, [selectedDifficulty]);

  return {
    // nav/state
    currentPage, setCurrentPage,
    selectedTable, setSelectedTable,
    selectedDifficulty, setSelectedDifficulty,
    showDifficultyPicker, setShowDifficultyPicker,

    // learning
    showLearningModule, setShowLearningModule,
    learningModuleContent, setLearningModuleContent,
    showLearningQuestion, setShowLearningQuestion,
    learningQuestion, setLearningQuestion,
    learningQuestionIndex, setLearningQuestionIndex,
    pendingDifficulty, setPendingDifficulty,

    // UI & progress
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
    currentQuestionIndex, setCurrentQuestionIndex,
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

    // pre-test
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

    // actions
    startQuizWithDifficulty,
    startActualQuiz,
    handleAnswer,
    handleResetProgress,
    handleBackToThemePicker,
    handleBackToNameForm,
    handleConfirmQuit,
    handleCancelQuit,
    resumeQuizAfterIntervention,

    // black belt
    isBlackUnlocked, setIsBlackUnlocked,
    showBlackBeltDegrees, setShowBlackBeltDegrees,
    unlockedDegrees, setUnlockedDegrees,
    completedBlackBeltDegrees, setCompletedBlackBeltDegrees,
    currentDegree, setCurrentDegree,

    // speed test
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

    // misc
    tableProgress, setTableProgress,
    maxQuestions,
    getQuizTimeLimit,

    // router
    navigate,
  };
};

export default useMathGame;
