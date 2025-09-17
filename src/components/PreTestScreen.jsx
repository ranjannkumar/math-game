// src/components/PreTestScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import audioManager from '../utils/audioUtils.js';
import { MathGameContext } from '../App.jsx';

async function sendPreTestResults(payload) {
  try {
    // Stub for backend; safe no-op
    return true;
  } catch {
    return false;
  }
}

const SECTION_LABELS = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
};

const PreTestScreen = () => {
  const {
    preTestSection,
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
    navigate,
  } = useContext(MathGameContext);

  const question = preTestQuestions[preTestCurrentQuestion];
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [wasCorrect, setWasCorrect] = useState(null);

  useEffect(() => {
    if (preTestTimerActive) {
      const interval = setInterval(() => setPreTestTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [preTestTimerActive, setPreTestTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answer = Number(inputValue);
    const correct = answer === question.correctAnswer;

    if (correct) {
      audioManager.playCorrectSound();
      setPreTestScore(preTestScore + 1);
      setWasCorrect(true);
      setMessage('Correct!');
    } else {
      audioManager.playWrongSound();
      setWasCorrect(false);
      setMessage(`Wrong! Correct answer is ${question.correctAnswer}.`);
    }

    setTimeout(async () => {
      if (preTestCurrentQuestion < preTestQuestions.length - 1) {
        setPreTestCurrentQuestion(preTestCurrentQuestion + 1);
        setInputValue('');
        setMessage('');
        setWasCorrect(null);
      } else {
        setPreTestTimerActive(false);
        const finalScore = preTestScore + (wasCorrect ? 1 : 0);
        const results = {
          childName,
          section: preTestSection,
          score: finalScore,
          totalQuestions: preTestQuestions.length,
          timeTaken: preTestTimer,
          accuracy: Math.round((finalScore / preTestQuestions.length) * 100),
        };
        setPreTestResults(results);
        await sendPreTestResults(results);
        navigate('/theme'); // <-- this now renders ThemePicker via App route
      }
    }, 800);
  };

  const title = SECTION_LABELS[preTestSection] || 'Pre-Test';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full relative">
        <h2 className="text-2xl sm:text-3xl font-baloo text-red-700 mb-6 text-center">
          {title} Pre-Test
        </h2>
        <div className="text-center mb-4 text-gray-800">
          <p className="text-lg sm:text-xl font-bold">
            Question {preTestCurrentQuestion + 1} of {preTestQuestions.length}
          </p>
          <p className="text-4xl sm:text-5xl font-bold my-4">{question?.question}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32 text-center text-2xl border-2 border-gray-300 rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className={`text-center mt-3 font-semibold ${wasCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PreTestScreen;
