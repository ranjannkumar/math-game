// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCog } from 'react-icons/fa';
import Confetti from 'react-confetti';
import useMathGame from './hooks/useMathGame.jsx';
import StartScreen from './components/StartScreen.jsx';
import NameForm from './components/NameForm.jsx';
import ThemePicker from './components/ThemePicker.jsx';
import TablePicker from './components/TablePicker.jsx';
import DifficultyPicker from './components/DifficultyPicker.jsx';
import QuizScreen from './components/QuizScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import LearningModule from './components/LearningModule.jsx';
import SpeedTestScreen from './components/ui/SpeedTestScreen.jsx';
import audioManager from './utils/audioUtils.js';
import { showShootingStars, clearShootingStars } from './utils/gameLogic.js';

const App = () => {
  const {
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
    // Add showSpeedTest and setShowSpeedTest here to resolve the ReferenceError
    showSpeedTest, setShowSpeedTest,
  } = useMathGame();

  const [sessionTimerActive, setSessionTimerActive] = useState(false);
  const [sessionTimerStart, setSessionTimerStart] = useState(null);
  const [sessionTimerPaused, setSessionTimerPaused] = useState(false);
  const [sessionTimerPauseStart, setSessionTimerPauseStart] = useState(null);
  const [sessionTimerAccumulated, setSessionTimerAccumulated] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [blackBeltCountdown, setBlackBeltCountdown] = useState(5);

  const maxQuestions = selectedDifficulty === 'brown' ? 10 : (selectedDifficulty && selectedDifficulty.startsWith('black')) ? 20 : 10;
  
  useEffect(() => {
    if (showResult && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showResult) {
      setShowResult(false);
      setCountdown(5);
      startActualQuiz(selectedDifficulty, selectedTable);
    }
  }, [countdown, showResult, selectedDifficulty, selectedTable, startActualQuiz]);

  useEffect(() => {
    if (showResult && selectedDifficulty === 'brown' && correctCountForCompletion === 10) {
      setBlackBeltCountdown(5);
      const countdownInterval = setInterval(() => {
        setBlackBeltCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowBlackBeltDegrees(true);
            setShowResult(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [showResult, selectedDifficulty, correctCountForCompletion, setShowBlackBeltDegrees, setShowResult]);

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
  }, [setShowSpeedTest]); // Added setShowSpeedTest to the dependency array

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
  }, [speedTestStarted, speedTestComplete, speedTestNumbers, currentSpeedTestIndex, speedTestStartTime, speedTestCorrectCount]);

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
  }, [speedTestTimes, setShowSpeedTest]); // Added setShowSpeedTest to the dependency array

  const showConfetti = () => {
    const allCorrect = correctCount === maxQuestions;
    const withinTimeLimit = elapsedTime <= 30;
    const avgTimePerQuestion = elapsedTime / maxQuestions;
    const fastPerQuestion = avgTimePerQuestion < 5;
    const hasSlowQuestions = slowQuestions.size > 0;
    const canUnlockNext = allCorrect && withinTimeLimit && fastPerQuestion && !hasSlowQuestions;
    
    return canUnlockNext ? (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        gravity={0.5}
        initialVelocityY={5}
        recycle={false}
        run={true}
        confettiSource={{ x: window.innerWidth / 2 - 150, y: 0, w: 300, h: 1 }}
        style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, pointerEvents: 'none' }}
      />
    ) : null;
  };

  useEffect(() => {
    if (currentPage !== 'results') {
      clearShootingStars();
    }
  }, [currentPage]);

  return (
    <div className="App min-h-screen w-full relative">
      {screen === 'start' && <StartScreen setScreen={setScreen} />}
      {screen === 'name' && <NameForm setScreen={setScreen} setShowThemePicker={setShowThemePicker} setShowPreTestPopup={setShowPreTestPopup} setPreTestSection={setPreTestSection} setPreTestQuestions={setPreTestQuestions} setPreTestCurrentQuestion={setPreTestCurrentQuestion} setPreTestScore={setPreTestScore} setPreTestInputValue={setPreTestInputValue} setPreTestTimer={setPreTestTimer} setPreTestTimerActive={setPreTestTimerActive} preTestSection={preTestSection} preTestQuestions={preTestQuestions} preTestCurrentQuestion={preTestCurrentQuestion} preTestScore={preTestScore} preTestInputValue={preTestInputValue} preTestTimer={preTestTimer} preTestTimerActive={preTestTimerActive} showResultsModal={showResultsModal} preTestResults={preTestResults} setShowResultsModal={setShowResultsModal} completedSections={completedSections} setCompletedSections={setCompletedSections} childName={childName} setChildName={setChildName} childAge={childAge} setChildAge={setChildAge}/>}
      {screen === 'theme' && <ThemePicker selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} setScreen={setScreen} setCurrentPage={setCurrentPage} setShowThemePicker={setShowThemePicker}/>}

      {screen === 'main' && (
        <div
          className="App min-h-screen w-full relative"
          style={{
            background: 'linear-gradient(135deg, #23272f 0%, #18181b 60%, #111113 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background 0.5s ease',
          }}
        >
          <button
            className="fixed top-4 right-4 z-50 bg-white/80 hover:bg-gray-200 text-gray-700 rounded-full p-3 shadow-lg border-4 border-gray-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
            style={{ fontSize: '2rem', borderWidth: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <FaCog />
          </button>
          
          {currentPage === 'picker' && <TablePicker selectedTable={selectedTable} setSelectedTable={setSelectedTable} setCurrentPage={setCurrentPage} selectedTheme={selectedTheme} showDifficultyPicker={showDifficultyPicker} setShowDifficultyPicker={setShowDifficultyPicker} sessionTimerActive={sessionTimerActive} sessionTimerStart={sessionTimerStart} sessionTimerPaused={sessionTimerPaused} sessionTimerPauseStart={sessionTimerPauseStart} sessionTimerAccumulated={sessionTimerAccumulated} childName={childName} tableProgress={tableProgress}/>}
          {currentPage === 'difficulty' && <DifficultyPicker selectedTable={selectedTable} setSelectedTable={setSelectedTable} selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty} setShowDifficultyPicker={setShowDifficultyPicker} setCurrentPage={setCurrentPage} startQuizWithDifficulty={startQuizWithDifficulty} sessionTimerActive={sessionTimerActive} sessionTimerStart={sessionTimerStart} sessionTimerPaused={sessionTimerPaused} sessionTimerPauseStart={sessionTimerPauseStart} sessionTimerAccumulated={sessionTimerAccumulated} showBlackBeltDegrees={showBlackBeltDegrees} setShowBlackBeltDegrees={setShowBlackBeltDegrees} unlockedDegrees={unlockedDegrees} setUnlockedDegrees={setUnlockedDegrees} completedBlackBeltDegrees={completedBlackBeltDegrees} setCompletedBlackBeltDegrees={setCompletedBlackBeltDegrees} currentDegree={currentDegree} setCurrentDegree={setCurrentDegree} isBlackUnlocked={isBlackUnlocked} tableProgress={tableProgress}/>}
          {currentPage === 'quiz' && !showResult && <QuizScreen
            currentQuestion={currentQuestion}
            quizProgress={quizProgress}
            answerSymbols={answerSymbols}
            handleAnswer={handleAnswer}
            isAnimating={isAnimating}
            showResult={showResult}
            selectedDifficulty={selectedDifficulty}
            sessionTimerActive={sessionTimerActive} sessionTimerStart={sessionTimerStart} sessionTimerPaused={sessionTimerPaused} sessionTimerPauseStart={sessionTimerPauseStart} sessionTimerAccumulated={sessionTimerAccumulated}
          />}
          
          {showResult && (
            <ResultsScreen
              showConfetti={showConfetti}
              elapsedTime={elapsedTime}
              correctCount={correctCount}
              maxQuestions={maxQuestions}
              selectedDifficulty={selectedDifficulty}
              selectedTable={selectedTable}
              selectedTheme={selectedTheme}
              countdown={countdown}
              setShowResult={setShowResult}
              setCurrentPage={setCurrentPage}
              blackBeltCountdown={blackBeltCountdown}
            />
          )}

          {showSettings && (
            <SettingsModal currentPage={currentPage} handleQuit={handleQuit} handleResetProgress={handleResetProgress} setShowSettings={setShowSettings} />
          )}

          {showQuitModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-xs w-full flex flex-col items-center animate-pop-in">
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
          
          {showLearningModule && (
            <LearningModule
              pendingDifficulty={selectedDifficulty}
              selectedTable={selectedTable}
              setScreen={setScreen}
              setShowLearningModule={setShowLearningModule}
              setShowLearningQuestion={setShowLearningQuestion}
              setLearningQuestion={setLearningQuestion}
              learningModuleContent={learningModuleContent}
              setLearningModuleContent={setLearningModuleContent}
              learningQuestionIndex={learningQuestionIndex}
              setLearningQuestionIndex={setLearningQuestionIndex}
              startActualQuiz={startActualQuiz}
            />
          )}

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
                      className="font-bold py-4 px-6 rounded-xl transition-all duration-500 transform bg-gray-300 hover:bg-gray-400 text-gray-700 hover:scale-105 active:scale-95 text-2xl sm:text-3xl shadow-lg"
                      onClick={() => {
                        if (answer === learningQuestion.correctAnswer) {
                          audioManager.playCorrectSound();
                          setShowLearningQuestion(false);
                          if (learningQuestionIndex === 0) {
                            if (selectedDifficulty === 'white' && (selectedTable === 3 || selectedTable === 4 || selectedTable === 5 || selectedTable === 6)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else if (selectedDifficulty === 'yellow' && (selectedTable === 1 || selectedTable === 2 || selectedTable === 3 || selectedTable === 4 || selectedTable === 5 || selectedTable === 6)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else if (selectedDifficulty === 'green' && (selectedTable === 1 || selectedTable === 2 || selectedTable === 3 || selectedTable === 4 || selectedTable === 5)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else if (selectedDifficulty === 'blue' && (selectedTable === 1 || selectedTable === 2 || selectedTable === 3 || selectedTable === 4 || selectedTable === 6)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else if (selectedDifficulty === 'red' && (selectedTable === 1 || selectedTable === 3 || selectedTable === 4 || selectedTable === 5 || selectedTable === 6)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else if (selectedDifficulty === 'brown' && (selectedTable === 1 || selectedTable === 2 || selectedTable === 3 || selectedTable === 4 || selectedTable === 5)) {
                              setLearningQuestionIndex(1);
                              setShowLearningModule(true);
                            } else {
                              startActualQuiz(selectedDifficulty, selectedTable);
                            }
                          } else {
                            startActualQuiz(selectedDifficulty, selectedTable);
                          }
                        } else {
                          audioManager.playWrongSound();
                          setShowLearningQuestion(false);
                          setLearningQuestionIndex(0);
                          setShowLearningModule(true);
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
          
          {showSpeedTest && (
            <SpeedTestScreen
              showSpeedTest={showSpeedTest}
              speedTestPopupVisible={speedTestPopupVisible}
              speedTestPopupAnimation={speedTestPopupAnimation}
              speedTestNumbers={speedTestNumbers}
              currentSpeedTestIndex={currentSpeedTestIndex}
              speedTestStartTime={speedTestStartTime}
              speedTestTimes={speedTestTimes}
              speedTestComplete={speedTestComplete}
              speedTestStarted={speedTestStarted}
              speedTestCorrectCount={speedTestCorrectCount}
              speedTestShowTick={speedTestShowTick}
              studentReactionSpeed={studentReactionSpeed}
              setSpeedTestPopupVisible={setSpeedTestPopupVisible}
              setSpeedTestPopupAnimation={setSpeedTestPopupAnimation}
              setShowSpeedTest={setShowSpeedTest}
              handleSpeedTestInput={handleSpeedTestInput}
              startSpeedTest={() => {
                setSpeedTestStarted(true);
                setCurrentSpeedTestIndex(0);
                setSpeedTestTimes([]);
                setSpeedTestComplete(false);
                setSpeedTestStartTime(Date.now());
                audioManager.playButtonClick();
              }}
            />
          )}

        </div>
      )}
    </div>
  );
};

export default App;