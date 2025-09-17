// src/components/PreTestScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import audioManager from '../utils/audioUtils';
import { sendPreTestResults } from '../api/stubApi';
import { MathGameContext } from '../App.jsx';

const PreTestScreen = () => {
    const {
        preTestQuestions,
        preTestCurrentQuestion,
        preTestScore,
        setPreTestScore,
        setPreTestCurrentQuestion,
        setPreTestTimerActive,
        preTestTimerActive,
        preTestTimer,
        setPreTestTimer,
        setPreTestResults,
        childName,
        navigate
    } = useContext(MathGameContext);
    const question = preTestQuestions[preTestCurrentQuestion];
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        if (preTestTimerActive) {
            const interval = setInterval(() => {
                setPreTestTimer(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [preTestTimerActive, setPreTestTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = parseInt(inputValue);
        if (answer === question.correctAnswer) {
            audioManager.playCorrectSound();
            setPreTestScore(preTestScore + 1);
            setIsCorrect(true);
            setMessage('Correct!');
        } else {
            audioManager.playWrongSound();
            setIsCorrect(false);
            setMessage(`Wrong! The correct answer is ${question.correctAnswer}.`);
        }
        
        setTimeout(async () => {
            if (preTestCurrentQuestion < preTestQuestions.length - 1) {
                setPreTestCurrentQuestion(preTestCurrentQuestion + 1);
                setInputValue('');
                setMessage('');
                setIsCorrect(null);
            } else {
                setPreTestTimerActive(false);
                const finalScore = preTestScore + (isCorrect ? 1 : 0);
                const results = {
                    childName,
                    section: 'addition',
                    score: finalScore,
                    totalQuestions: preTestQuestions.length,
                    timeTaken: preTestTimer,
                    accuracy: (finalScore / preTestQuestions.length) * 100,
                };
                setPreTestResults(results);
                await sendPreTestResults(results);
                navigate('/theme');
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full relative">
                <h2 className="text-2xl sm:text-3xl font-baloo text-red-700 mb-6 text-center">Addition Pre-Test</h2>
                <div className="text-center mb-4 text-gray-800">
                    <p className="text-lg sm:text-xl font-bold">Question {preTestCurrentQuestion + 1} of {preTestQuestions.length}</p>
                    <p className="text-4xl sm:text-5xl font-bold my-4">{question.question}</p>
                    <p className="text-sm sm:text-base">Time: {preTestTimer}s</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full text-center p-3 rounded-lg border-2 border-gray-300 text-2xl mb-4"
                        placeholder="Your Answer"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg sm:text-xl shadow-lg"
                    >
                        Submit
                    </button>
                </form>
                {message && (
                    <div className={`text-center mt-4 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreTestScreen;