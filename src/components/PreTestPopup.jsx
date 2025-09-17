// src/components/PreTestPopup.jsx
import React from 'react';

const PreTestPopup = ({ setShowPreTestPopup, setPreTestQuestions, setPreTestCurrentQuestion, setPreTestScore, setPreTestTimerActive, setScreen, setPreTestResults, childName }) => {
  const handleSelectSection = (section) => {
    // As per spec, only addition pre-test is implemented
    if (section === 'addition') {
      const additionQuestions = [
        { question: '1 + 4', correctAnswer: 5 },
        { question: '2 + 3', correctAnswer: 5 },
        { question: '3 + 2', correctAnswer: 5 },
        { question: '4 + 1', correctAnswer: 5 },
        { question: '0 + 5', correctAnswer: 5 },
        { question: '5 + 0', correctAnswer: 5 }
      ];
      setPreTestQuestions(additionQuestions);
      setPreTestCurrentQuestion(0);
      setPreTestScore(0);
      setPreTestTimerActive(true);
      setShowPreTestPopup(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-blue-200/30 popup-zoom-in">
        <h2 className="text-2xl sm:text-3xl font-baloo text-blue-700 mb-6 text-center">Pre-Test</h2>
        <p className="text-center text-gray-700 mb-6">Select a pre-test section to begin. Only Addition is currently available.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelectSection('addition')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg sm:text-xl"
          >
            Addition
          </button>
          <button
            disabled
            className="bg-gray-400 text-white font-bold py-4 px-6 rounded-xl cursor-not-allowed text-lg sm:text-xl"
          >
            Subtraction (Coming Soon)
          </button>
          <button
            disabled
            className="bg-gray-400 text-white font-bold py-4 px-6 rounded-xl cursor-not-allowed text-lg sm:text-xl"
          >
            Multiplication (Coming Soon)
          </button>
          <button
            disabled
            className="bg-gray-400 text-white font-bold py-4 px-6 rounded-xl cursor-not-allowed text-lg sm:text-xl"
          >
            Division (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreTestPopup;