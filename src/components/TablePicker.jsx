// src/components/TablePicker.jsx
import React, { useState, useContext } from 'react';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { themeConfigs, tableEmojis, tableBgColors } from '../utils/mathGameLogic';
import { MathGameContext } from '../App.jsx';

const TableStarsDisplay = ({ tableNumber, tableProgress }) => {
    const progress = tableProgress[tableNumber] || {};
    const whiteCleared = progress.white?.perfectPerformance === true;
    const yellowCleared = progress.yellow?.perfectPerformance === true;
    const greenCleared = progress.green?.perfectPerformance === true;
    const blueCleared = progress.blue?.perfectPerformance === true;
    const redCleared = progress.red?.perfectPerformance === true;
    const brownCleared = progress.brown?.perfectPerformance === true;
    const filledStars = [whiteCleared, yellowCleared, greenCleared, blueCleared, redCleared, brownCleared].filter(Boolean).length;

    return (
        <div className="flex justify-center items-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={`text-yellow-300 text-lg ${i < filledStars ? '' : 'opacity-30'}`}>⭐</span>
            ))}
        </div>
    );
};

const TablePicker = () => {
    const {
        setSelectedTable,
        selectedTheme,
        tableProgress,
        childName,
        navigate
    } = useContext(MathGameContext);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const levels = [1, 2, 3, 4, 5, 6, 7, 8];
    const currentLevel = levels[currentLevelIndex];

    const theme = selectedTheme ? themeConfigs[selectedTheme.key] : null;
    const currentThemeEmoji = theme?.tableEmojis[currentLevel - 1] || tableEmojis[currentLevel - 1];
    const currentThemeName = theme?.tableNames[currentLevel - 1] || currentLevel;
    const currentThemeColor = theme?.tableColors[currentLevel - 1] || tableBgColors[currentLevel - 1];
    
    const handleNextLevel = () => {
        setCurrentLevelIndex((prevIndex) => (prevIndex + 1) % levels.length);
    };

    const handlePrevLevel = () => {
        setCurrentLevelIndex((prevIndex) => (prevIndex - 1 + levels.length) % levels.length);
    };

    const handleBackToThemePicker = () => {
        navigate('/theme');
    };

    const startQuiz = (tableNumber) => {
        setSelectedTable(tableNumber);
        navigate('/belts');
    };
    
    return (
        <div className="min-h-screen w-full relative bg-transparent px-1 sm:px-2 md:px-4 lg:px-6 flex flex-col items-center justify-center"
             style={{
                 backgroundImage: "url('/night_sky_landscape.jpg')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}>
            <div className="absolute inset-0 bg-black/30 z-0"></div>

            <button
                className="fixed top-1 sm:top-2 md:top-4 left-1 sm:left-2 md:left-4 z-50 bg-white/80 hover:bg-gray-200 text-gray-700 rounded-full p-1 sm:p-1.5 md:p-3 shadow-lg border-2 sm:border-3 md:border-4 border-gray-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
                style={{
                    fontSize: 'clamp(0.6rem, 2.5vw, 1.5rem)',
                    borderWidth: 'clamp(1px, 0.5vw, 3px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onClick={handleBackToThemePicker}
                aria-label="Back to Theme Picker"
            >
                <FaArrowLeft size={16} className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8" />
            </button>
      
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto pt-2 sm:pt-4 md:pt-6 lg:pt-8">
                <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-1 sm:px-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 md:mb-3 drop-shadow-lg font-baloo leading-tight">
                        Welcome, {childName}!
                    </h1>
                </div>
        
                <div className="relative flex items-center justify-center w-full mt-1 sm:mt-2 md:mt-4 lg:mt-6 px-1 sm:px-2">
                    <div className="relative z-10 w-full flex justify-center items-center">
                        {levels.length > 1 && (
                            <button
                                className="absolute left-0 p-2 sm:p-3 md:p-4 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
                                onClick={handlePrevLevel}
                                aria-label="Previous Level"
                            >
                                <FaChevronLeft size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        )}
                        <div key={currentLevel} className="relative z-10">
                            <button
                                onClick={() => startQuiz(currentLevel)}
                                className={`group rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 ${currentThemeColor} shadow-lg sm:shadow-xl md:shadow-2xl border-2 sm:border-3 md:border-4 transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-105 sm:hover:scale-110 md:hover:scale-125`}
                                style={{
                                    width: 'clamp(140px, 60vw, 280px)',
                                    height: 'clamp(100px, 45vw, 200px)',
                                    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%)'
                                }}
                            >
                                <div className="flex flex-col items-center justify-center w-full h-full p-1 sm:p-1.5 md:p-2 lg:p-3 -mt-1 sm:-mt-2">
                                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-0.5 sm:mb-1 md:mb-1.5 group-hover:animate-bounce transition-transform duration-300">
                                        {currentThemeEmoji}
                                    </div>
                                    <div className="mb-0.5 sm:mb-1 md:mb-1.5 text-center w-full"
                                        style={{
                                            color: 'white',
                                            fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
                                            lineHeight: 1.1,
                                            maxWidth: '100%',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            fontWeight: 'bold',
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                                        }}>
                                        {currentThemeName}
                                    </div>
                                    <div className="flex flex-col items-center w-full">
                                        <div className="text-white/90 font-bold mb-0.5 sm:mb-1"
                                            style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.4rem)' }}>
                                            Level {currentLevel}
                                        </div>
                                        <div className="flex justify-center w-full -mt-1 sm:-mt-2">
                                            <TableStarsDisplay tableNumber={currentLevel} tableProgress={tableProgress} />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        {levels.length > 1 && (
                            <button
                                className="absolute right-0 p-2 sm:p-3 md:p-4 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
                                onClick={handleNextLevel}
                                aria-label="Next Level"
                            >
                                <FaChevronRight size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablePicker;