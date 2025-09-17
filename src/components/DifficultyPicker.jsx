// src/components/DifficultyPicker.jsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import DailyStatsCounter from './ui/DailyStatsCounter';
import SessionTimer from './ui/SessionTimer';

const BlackBeltDegreesModal = ({
  selectedTable,
  unlockedDegrees,
  startQuizWithDifficulty,
  setShowBlackBeltDegrees
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl max-w-lg w-full relative">
        <button
          onClick={() => setShowBlackBeltDegrees(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl sm:text-3xl font-baloo text-blue-700 mb-6 text-center">Black Belt Degrees</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map(degree => (
            <button
              key={degree}
              onClick={() => {
                if (unlockedDegrees.includes(degree)) {
                  startQuizWithDifficulty(`black-${degree}`);
                  setShowBlackBeltDegrees(false);
                }
              }}
              className={`py-4 px-2 rounded-xl text-center font-bold text-white transition-transform duration-200 transform hover:scale-105 ${unlockedDegrees.includes(degree) ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!unlockedDegrees.includes(degree)}
            >
              Degree {degree}
              {!unlockedDegrees.includes(degree) && <div className="absolute top-1 right-1 text-lg">🔒</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DifficultyPicker = ({ 
  sessionTimerActive, sessionTimerStart, sessionTimerPaused, sessionTimerPauseStart, sessionTimerAccumulated,
  selectedTable, setShowDifficultyPicker, setCurrentPage, startQuizWithDifficulty, isBlackUnlocked,
  showBlackBeltDegrees, setShowBlackBeltDegrees, unlockedDegrees, completedBlackBeltDegrees, currentDegree, setCurrentDegree, tableProgress
}) => {
  const tableProgressData = tableProgress[selectedTable] || {};
  const whiteCleared = tableProgressData.white?.perfectPerformance === true;
  const yellowCleared = tableProgressData.yellow?.perfectPerformance === true;
  const greenCleared = tableProgressData.green?.perfectPerformance === true;
  const blueCleared = tableProgressData.blue?.perfectPerformance === true;
  const redCleared = tableProgressData.red?.perfectPerformance === true;
  const brownCleared = tableProgressData.brown?.perfectPerformance === true;

  const isYellowUnlocked = whiteCleared;
  const isGreenUnlocked = yellowCleared;
  const isBlueUnlocked = greenCleared;
  const isRedUnlocked = blueCleared;
  const isBrownUnlocked = redCleared;
  const isBlackBeltUnlocked = brownCleared;

  const getStar = (cleared) => cleared ? '⭐' : '☆';

  return (
    <div className="min-h-screen p-2 sm:p-4 flex items-center justify-center"
         style={{
           backgroundImage: "url('/night_sky_landscape.jpg')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           paddingTop: 'max(env(safe-area-inset-top), 1rem)',
           paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
         }}>
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      
      <button
        className="fixed top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-50 bg-white/80 hover:bg-gray-200 text-gray-700 rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg border-2 sm:border-3 md:border-4 border-gray-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
        style={{
          fontSize: 'clamp(1rem, 4vw, 2rem)',
          borderWidth: 'clamp(2px, 1vw, 4px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
        }}
        onClick={() => {
          setShowDifficultyPicker(false);
          setCurrentPage('picker');
        }}
        aria-label="Back to Difficulty Picker"
      >
        <FaArrowLeft size={20} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>
      <div className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto w-full relative z-10 px-1 sm:px-2 md:px-4">
        {selectedTable && (
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center drop-shadow-lg">
            Level {selectedTable}
          </div>
        )}
        <div className="flex flex-col items-center justify-center min-h-[25vh] sm:min-h-[35vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <button
              onClick={() => startQuizWithDifficulty('white')}
              className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative"
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-white rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">White Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_white_belt.png"
                  alt="White Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(whiteCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isYellowUnlocked ? startQuizWithDifficulty('yellow') : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isYellowUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isYellowUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Yellow Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_yellow_belt.png"
                  alt="Yellow Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(yellowCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isGreenUnlocked ? startQuizWithDifficulty('green') : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isGreenUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isGreenUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-green-500 rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Green Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_green_belt.png"
                  alt="Green Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(greenCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isBlueUnlocked ? startQuizWithDifficulty('blue') : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isBlueUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isBlueUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-blue-500 rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Blue Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_blue_belt.png"
                  alt="Blue Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(blueCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isRedUnlocked ? startQuizWithDifficulty('red') : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isRedUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isRedUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-red-500 rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Red Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_red_belt.png"
                  alt="Red Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(redCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isBrownUnlocked ? startQuizWithDifficulty('brown') : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isBrownUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isBrownUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800 rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Brown Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_brown_belt.png"
                  alt="Brown Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{getStar(brownCleared)}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">10 Questions</div>
            </button>
            <button
              onClick={() => isBlackBeltUnlocked ? setShowBlackBeltDegrees(true) : null}
              className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative ${!isBlackBeltUnlocked ? 'opacity-60' : ''}`}
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
            >
              {!isBlackBeltUnlocked && (
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                  <div className="text-gray-600 text-lg sm:text-xl">🔒</div>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-2 bg-black rounded-t-lg"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-baloo mb-1 sm:mb-2">Black Belt</div>
              <div className="flex justify-center mb-1 sm:mb-2">
                <img
                  src="/judo_black_belt.png"
                  alt="Black Belt"
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  style={{ maxHeight: 'clamp(1.5rem, 4vw, 2rem)' }}
                />
              </div>
              <div className="text-sm sm:text-base font-comic mb-1 sm:mb-2">
                <span style={{fontSize: 'clamp(1.4em, 4vw, 1.8em)'}}>{isBlackBeltUnlocked ? '⭐' : '☆'}</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-comic whitespace-nowrap">20 Questions</div>
            </button>
          </div>
        </div>
      </div>
      <div className="fixed right-2 sm:right-4 md:right-6 lg:right-8 bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 z-50 flex flex-col items-end gap-2 sm:gap-3 md:gap-4">
        <DailyStatsCounter style={{ background: 'none', boxShadow: 'none', position: 'static' }} />
        <SessionTimer isActive={sessionTimerActive} startTime={sessionTimerStart} style={{ position: 'static' }} isPaused={sessionTimerPaused} pauseStartTime={sessionTimerPauseStart} accumulatedTime={sessionTimerAccumulated} />
      </div>

      {showBlackBeltDegrees && (
        <BlackBeltDegreesModal
          selectedTable={selectedTable}
          unlockedDegrees={unlockedDegrees}
          startQuizWithDifficulty={startQuizWithDifficulty}
          setShowBlackBeltDegrees={setShowBlackBeltDegrees}
        />
      )}
    </div>
  );
};

export default DifficultyPicker;