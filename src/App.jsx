// src/App.jsx
import React, { useEffect, createContext } from 'react';
import useMathGame from './hooks/useMathGame.jsx';
import StartScreen from './components/StartScreen.jsx';
import NameForm from './components/NameForm.jsx';
import ThemePicker from './components/ThemePicker.jsx';
import TablePicker from './components/TablePicker.jsx';
import DifficultyPicker from './components/DifficultyPicker.jsx';
import QuizScreen from './components/QuizScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import LearningModule from './components/LearningModule.jsx';
import SpeedTestScreen from './components/ui/SpeedTestScreen.jsx';
import PreTestPopup from './components/PreTestPopup.jsx';
import PreTestScreen from './components/PreTestScreen.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { clearShootingStars } from './utils/mathGameLogic.js';
import audioManager from './utils/audioUtils.js';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

export const MathGameContext = createContext({});

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
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
    pendingDifficulty, setPendingDifficulty,
    maxQuestions,
    getQuizTimeLimit,
    resumeQuizAfterIntervention,
  } = useMathGame();

  useEffect(() => () => clearShootingStars(), []);

  // FIX: don’t throw if stopAll isn't present
  useEffect(() => {
    if (location.pathname !== '/quiz' && location.pathname !== '/learning') {
      audioManager.stopAll?.();
    }
  }, [location.pathname]);

  return (
    <MathGameContext.Provider value={{
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
      pendingDifficulty, setPendingDifficulty,
      maxQuestions,
      getQuizTimeLimit,
      navigate,
      resumeQuizAfterIntervention,
    }}>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/name" element={<NameForm />} />
        <Route path="/pre-test-popup" element={<PreTestPopup />} />
        <Route path="/pre-test" element={<PreTestScreen />} />
        <Route path="/theme" element={<ThemePicker />} />
        <Route path="/levels" element={<TablePicker />} />
        <Route path="/belts" element={<DifficultyPicker />} />
        <Route path="/learning" element={<LearningModule />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>

      {showLearningQuestion && learningQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-blue-200/30 popup-zoom-in">
            <div className="text-center mb-6">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-500 mb-6">
                {learningQuestion.question} =
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {learningQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  className="font-bold py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-2xl sm:text-3xl"
                  onClick={() => {
                    if (answer === learningQuestion.correctAnswer) {
                      audioManager.playCorrectSound();
                      setShowLearningQuestion(false);
                      resumeQuizAfterIntervention();
                    } else {
                      audioManager.playWrongSound();
                      setShowLearningQuestion(false);
                      navigate('/learning');
                    }
                  }}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSpeedTest && <SpeedTestScreen />}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full flex flex-col items-center animate-pop-in">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to quit?</h2>
            <button
              className="kid-btn bg-red-400 hover:bg-red-500 text-white mb-4"
              onClick={handleConfirmQuit}
            >
              Quit
            </button>
            <button
              className="kid-btn bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={handleCancelQuit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </MathGameContext.Provider>
  );
};

export default App;
