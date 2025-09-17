// src/components/TablePicker.jsx
import React, { useContext, useState } from 'react';
import { MathGameContext } from '../App.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import { tableBgColors, themeConfigs } from '../utils/mathGameLogic.js';

const levels = [1, 2, 3, 4, 5, 6];

const fallbackEmojis = ['①', '②', '③', '④', '⑤', '⑥'];
const fallbackNames = ['1', '2', '3', '4', '5', '6'];

const TablePicker = () => {
  const { navigate, selectedTheme, setSelectedTable } = useContext(MathGameContext);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = levels[currentLevelIndex];

  // Theme is optional; fall back cleanly
  const themeCfg = selectedTheme?.key ? themeConfigs[selectedTheme.key] : null;
  const tableEmojis = themeCfg?.tableEmojis || fallbackEmojis;
  const tableNames = themeCfg?.tableNames || fallbackNames;
  const tableColors = themeCfg?.tableColors || tableBgColors;

  const handleNextLevel = () => setCurrentLevelIndex((i) => (i + 1) % levels.length);
  const handlePrevLevel = () => setCurrentLevelIndex((i) => (i - 1 + levels.length) % levels.length);
  const handleBack = () => navigate('/theme');

  const startQuiz = (tableNumber) => {
    // Just select a level and proceed to belts; everything else is optional
    setSelectedTable(tableNumber);
    navigate('/belts');
  };

  return (
    <div
      className="min-h-screen w-full relative px-1 sm:px-2 md:px-4 lg:px-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/night_sky_landscape.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <button
        className="fixed top-1 sm:top-2 md:top-4 left-1 sm:left-2 md:left-4 z-50 bg-white/80 hover:bg-gray-200 text-gray-700 rounded-full p-1 sm:p-1.5 md:p-3 shadow-lg border-2 sm:border-3 md:border-4 border-gray-400 transition-all duration-300 transform hover:scale-110 active:scale-95"
        style={{ fontSize: 'clamp(0.6rem, 2.5vw, 1.5rem)' }}
        onClick={handleBack}
        aria-label="Back to Theme Picker"
      >
        <FaArrowLeft size={16} />
      </button>

      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto pt-2 sm:pt-4 md:pt-6 lg:pt-8">
        <div className="w-full max-w-md">
          <div
            className="rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-300/40 bg-white/90"
            style={{ backgroundColor: tableColors[currentLevel - 1] }}
          >
            <div className="text-center">
              <div className="text-6xl sm:text-7xl mb-2">{tableEmojis[currentLevel - 1]}</div>
              <div className="text-2xl sm:text-3xl font-bold mb-6">Level {tableNames[currentLevel - 1]}</div>

              <div className="flex justify-between mb-4">
                <button
                  onClick={handlePrevLevel}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-bold"
                >
                  ◀
                </button>
                <button
                  onClick={handleNextLevel}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-bold"
                >
                  ▶
                </button>
              </div>

              <button
                onClick={() => startQuiz(currentLevel)}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Choose Level {currentLevel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePicker;
