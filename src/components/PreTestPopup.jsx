// src/components/PreTestPopup.jsx
import React, { useContext } from 'react';
import { MathGameContext } from '../App.jsx';
import { generatePreTestQuestions } from '../utils/pretestUtils.js';

const PreTestPopup = () => {
  const {
    setPreTestQuestions,
    setPreTestCurrentQuestion,
    setPreTestScore,
    setPreTestTimerActive,
    setPreTestSection,
    navigate,
  } = useContext(MathGameContext);

  const startSection = (sectionKey) => {
    const qs = generatePreTestQuestions(sectionKey);
    if (!qs.length) return;
    setPreTestSection(sectionKey);
    setPreTestQuestions(qs);
    setPreTestCurrentQuestion(0);
    setPreTestScore(0);
    setPreTestTimerActive(true);
    navigate('/pre-test');
  };

  const handleSkip = () => {
    setPreTestTimerActive(false);
    setPreTestQuestions([]);
    navigate('/theme');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-blue-200/30 popup-zoom-in">
        <h2 className="text-2xl sm:text-3xl font-baloo text-blue-700 mb-6 text-center">Pre-Test</h2>
        <p className="text-center text-gray-700 mb-6">
          Choose a section for your quick pre-test.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => startSection('addition')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg"
          >
            Addition (sums to 5)
          </button>
          <button
            onClick={() => startSection('subtraction')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg"
          >
            Subtraction (easy)
          </button>
          <button
            onClick={() => startSection('multiplication')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg"
          >
            Multiplication (easy)
          </button>
          <button
            onClick={() => startSection('division')}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg"
          >
            Division (easy)
          </button>
          <button
            onClick={handleSkip}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-base shadow-lg mt-2"
          >
            Skip pre-test
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreTestPopup;
