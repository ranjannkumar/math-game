import React from 'react';
import Confetti from 'react-confetti';
import { showShootingStars } from '../utils/gameLogic';

const ResultsScreen = ({ 
  showConfetti, elapsedTime, correctCount, maxQuestions, selectedDifficulty, selectedTable, selectedTheme, countdown,
  setShowResult, setCurrentPage,
  blackBeltCountdown
}) => {
  const allCorrect = correctCount === maxQuestions;
  const withinTimeLimit = elapsedTime <= 30;
  const avgTimePerQuestion = elapsedTime / maxQuestions;
  const fastPerQuestion = avgTimePerQuestion < 5;
  const canUnlockNext = allCorrect && withinTimeLimit && fastPerQuestion; // Simplified for this component

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/85 to-rose-800/90 backdrop-blur-sm flex items-center justify-center z-50 safe-area-top safe-area-bottom">
      {canUnlockNext && <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        gravity={0.5}
        initialVelocityY={5}
        recycle={false}
        run={true}
        confettiSource={{ x: window.innerWidth / 2 - 150, y: 0, w: 300, h: 1 }}
        style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, pointerEvents: 'none' }}
      />}
      {showShootingStars()}
      
      <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl w-full mx-2 sm:mx-4 shadow-2xl min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
        <div className="text-center flex flex-col justify-start items-center h-full pt-2 sm:pt-4 md:pt-6">
          <div className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-green-300 to-yellow-500 rounded-xl p-4 mb-6 shadow-lg">
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-6 tracking-wide no-underline break-words overflow-hidden mt-4" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em', maxWidth: '100%' }}>
                {canUnlockNext ? "CONGRATULATIONS" : "Way To Go!"}
              </p>
            </div>
            <p className="text-green-400 font-bold text-2xl mt-2">You earned +10 points</p>
            
            {selectedDifficulty === 'brown' && correctCount === 10 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-600 to-yellow-600 rounded-xl shadow-lg">
                <p className="text-white font-bold text-xl mb-2">Amazing! You got the Brown Belt!</p>
                <p className="text-white font-bold text-xl">Moving to Black Belt in <span className="text-yellow-300">{blackBeltCountdown}</span> seconds... 🥋</p>
                <div className="mt-2 text-center"></div>
              </div>
            )}
          </div>
          <div className="text-center mb-3">
            <div className="p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 mb-4 -mt-1">
                  <div className="text-center"></div>
                  <div className="text-base text-gray-600 mb-2">Today's Score</div>
                  <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-green-600 bg-black/10 border-2 border-black rounded-lg px-4 py-2">
                    {correctCount}
                  </p>
                </div>
                <div className="p-3 mb-4 -mt-1">
                  <div className="text-center"></div>
                  <div className="text-base text-gray-600 mb-2">Time Spent</div>
                  <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-green-600 bg-black/10 border-2 border-black rounded-lg px-4 py-2">
                    {elapsedTime}s
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center mt-0">
            <button
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-gray-600 w-48"
              onClick={() => {
                setShowResult(false);
                setCurrentPage('difficulty');
              }}
            >
              Go To Belts
            </button>
          </div>
          {(() => {
            if (!canUnlockNext) {
              return (
                <div className="text-center mt-0">
                  <p className="text-xl font-bold text-black-600">Restarting in <span className="text-red-600">{countdown}</span> seconds...</p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;