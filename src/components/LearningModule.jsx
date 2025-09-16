import React from 'react';
import { themeConfigs } from '../utils/gameLogic';

const LearningModule = ({
  pendingDifficulty,
  selectedTable,
  setShowLearningModule,
  setShowLearningQuestion,
  setLearningQuestion,
  learningModuleContent,
  setLearningModuleContent,
  learningQuestionIndex,
  setLearningQuestionIndex,
  startActualQuiz
}) => {
  const getFact = (difficulty, table, index) => {
    // This is a simplified version, the full logic is in `useMathGame`
    const facts = {
      white: {
        1: ['0 + 0 = 0'],
        2: ['1 + 1 = 2'],
        3: ['0 + 6 = 6', '6 + 0 = 6'],
        4: ['1 + 6 = 7', '6 + 1 = 7'],
        5: ['2 + 6 = 8', '6 + 2 = 8'],
        6: ['3 + 6 = 9', '6 + 3 = 9'],
      },
      yellow: {
        1: ['0 + 1 = 1', '1 + 0 = 1'],
        2: ['1 + 2 = 3', '2 + 1 = 3'],
        3: ['0 + 7 = 7', '7 + 0 = 7'],
        4: ['1 + 7 = 8', '7 + 1 = 8'],
        5: ['2 + 7 = 9', '7 + 2 = 9'],
        6: ['3 + 7 = 10', '7 + 3 = 10'],
      },
      green: {
        1: ['0 + 2 = 2', '2 + 0 = 2'],
        2: ['1 + 3 = 4', '3 + 1 = 4'],
        3: ['0 + 8 = 8', '8 + 0 = 8'],
        4: ['1 + 8 = 9', '8 + 1 = 9'],
        5: ['2 + 8 = 10', '8 + 2 = 10'],
        6: ['4 + 4 = 8'],
      },
      blue: {
        1: ['0 + 3 = 3', '3 + 0 = 3'],
        2: ['1 + 4 = 5', '4 + 1 = 5'],
        3: ['0 + 9 = 9', '9 + 0 = 9'],
        4: ['1 + 9 = 10', '9 + 1 = 10'],
        5: ['3 + 3 = 6'],
        6: ['4 + 5 = 9', '5 + 4 = 9'],
      },
      red: {
        1: ['0 + 4 = 4', '4 + 0 = 4'],
        2: ['2 + 2 = 4'],
        3: ['0 + 10 = 10', '10 + 0 = 10'],
        4: ['2 + 4 = 6', '4 + 2 = 6'],
        5: ['3 + 4 = 7', '4 + 3 = 7'],
        6: ['4 + 6 = 10', '6 + 4 = 10'],
      },
      brown: {
        1: ['0 + 5 = 5', '5 + 0 = 5'],
        2: ['2 + 3 = 5', '3 + 2 = 5'],
        3: ['1 + 5 = 6', '5 + 1 = 6'],
        4: ['2 + 5 = 7', '5 + 2 = 7'],
        5: ['3 + 5 = 8', '5 + 3 = 8'],
        6: ['5 + 5 = 10'],
      },
    };
    return facts[difficulty][table][index] || '';
  };
  
  const handleNextFact = () => {
    const nextIndex = learningQuestionIndex + 1;
    const currentFacts = facts[pendingDifficulty][selectedTable];
    if (nextIndex < currentFacts.length) {
      setLearningQuestionIndex(nextIndex);
      setLearningModuleContent(getFact(pendingDifficulty, selectedTable, nextIndex));
    } else {
      startActualQuiz(pendingDifficulty, selectedTable);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 safe-area-top safe-area-bottom p-2 sm:p-4">
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-blue-200/30 popup-zoom-in">
        <div className="text-center mb-6">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-600 mb-4 whitespace-pre-line">
            {learningModuleContent}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-gray-300 text-gray-700 font-bold py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base shadow-lg"
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