// src/components/LearningModule.jsx
import React, { useState, useEffect } from 'react';
import audioManager from '../utils/audioUtils';
import { beltFacts, getLearningModuleContent } from '../utils/mathGameLogic';

const LearningModule = ({ pendingDifficulty, selectedTable, setShowLearningModule, setShowLearningQuestion, setLearningQuestion, startActualQuiz }) => {
  const [learningContent, setLearningContent] = useState('');
  const [learningQuestionIndex, setLearningQuestionIndex] = useState(0);

  useEffect(() => {
    if (pendingDifficulty && selectedTable) {
      const content = getLearningModuleContent(pendingDifficulty, selectedTable);
      setLearningContent(content);
    }
  }, [pendingDifficulty, selectedTable]);

  const handleNextFact = () => {
    const difficultyFacts = beltFacts[pendingDifficulty];
    if (!difficultyFacts) {
      console.error(`No facts found for difficulty: ${pendingDifficulty}`);
      startActualQuiz(pendingDifficulty, selectedTable);
      return;
    }

    const currentTableFacts = difficultyFacts.filter(fact => {
      const parts = fact.question.split(' + ').map(Number);
      if (parts.length === 2) {
        return parts.includes(selectedTable);
      }
      return false;
    });

    if (learningQuestionIndex < currentTableFacts.length) {
      const nextFact = currentTableFacts[learningQuestionIndex];
      const question = {
        question: nextFact.question,
        correctAnswer: nextFact.correctAnswer,
        answers: [
          nextFact.correctAnswer,
          nextFact.correctAnswer + 1,
          nextFact.correctAnswer - 1,
          nextFact.correctAnswer + 2
        ].filter(ans => ans >= 0).sort(() => Math.random() - 0.5)
      };
      setLearningQuestion(question);
      setLearningQuestionIndex(prev => prev + 1);
      setShowLearningModule(false);
      setShowLearningQuestion(true);
    } else {
      startActualQuiz(pendingDifficulty, selectedTable);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-blue-200/30 popup-zoom-in">
        <div className="text-center mb-6">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-600 mb-4 whitespace-pre-line">
            {learningContent}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg shadow-lg"
            onClick={handleNextFact}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;