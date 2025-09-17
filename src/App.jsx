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
import MainLayout from './components/MainLayout.jsx';
import Confetti from 'react-confetti';

export const MathGameContext = createContext(null);

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
        completeSpeedTest,
        pendingDifficulty, setPendingDifficulty
    } = useMathGame();

    const maxQuestions = selectedDifficulty === 'brown' ? 10 : (selectedDifficulty && selectedDifficulty.startsWith('black')) ? (selectedDifficulty.endsWith('7') ? 30 : 20) : 10;
    
    useEffect(() => {
        if (showResult && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && showResult) {
            setShowResult(false);
            setCountdown(5);
            startActualQuiz(selectedDifficulty, selectedTable);
        }
    }, [countdown, showResult, selectedDifficulty, selectedTable, startActualQuiz, setCountdown, setShowResult]);

    useEffect(() => {
        if (showResult && selectedDifficulty === 'brown' && correctCountForCompletion === 10) {
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
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
    }, [showResult, selectedDifficulty, correctCountForCompletion, setShowBlackBeltDegrees, setShowResult, setCountdown]);

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
        if (location.pathname !== '/results') {
            clearShootingStars();
        }
    }, [location]);

    useEffect(() => {
        // Corrected method name from init() to initAudioContext()
        audioManager.initAudioContext();
    }, []);

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
            completeSpeedTest,
            pendingDifficulty, setPendingDifficulty,
            navigate
        }}>
            <Routes>
                <Route path="/" element={<StartScreen />} />
                <Route path="/name" element={<NameForm />} />
                <Route path="/pre-test-popup" element={<PreTestPopup />} />
                <Route path="/pre-test" element={<PreTestScreen />} />
                <Route element={<MainLayout />}>
                    <Route path="/theme" element={<ThemePicker />} />
                    <Route path="/levels" element={<TablePicker />} />
                    <Route path="/belts" element={<DifficultyPicker />} />
                    <Route path="/quiz" element={<QuizScreen />} />
                </Route>
                <Route path="/results" element={<ResultsScreen showConfetti={showConfetti} />} />
                <Route path="/learning" element={<LearningModule />} />
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
                                    className="font-bold py-4 px-6 rounded-xl transition-all duration-500 transform bg-gray-300 hover:bg-gray-400 text-gray-700 hover:scale-105 active:scale-95 text-2xl sm:text-3xl shadow-lg"
                                    onClick={() => {
                                        if (answer === learningQuestion.correctAnswer) {
                                            audioManager.playCorrectSound();
                                            setShowLearningQuestion(false);
                                            startActualQuiz(pendingDifficulty, selectedTable);
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
        </MathGameContext.Provider>
    );
};

export default App;