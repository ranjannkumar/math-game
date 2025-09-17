import React, { useState, useContext } from 'react';
import { FaArrowLeft, FaThLarge, FaRegImages } from 'react-icons/fa';
import { themeConfigs, ageThemeMap } from '../utils/mathGameLogic';
import { MathGameContext } from '../App.jsx';

const ThemePicker = () => {
    const { selectedTheme, setSelectedTheme, navigate } = useContext(MathGameContext);
    const [themePickerMode, setThemePickerMode] = useState('slide');
    const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
    const themeKeys = ageThemeMap(localStorage.getItem('math-child-age') || '5');
    const themes = themeKeys.map(key => ({ key, ...themeConfigs[key] }));
    const currentTheme = themes[currentThemeIdx];

    const handleBackToNameForm = () => {
        navigate('/name');
    };

    const handleChooseTheme = () => {
        setSelectedTheme(currentTheme);
        navigate('/levels');
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center ${themePickerMode === 'grid' ? 'justify-start overflow-y-auto' : 'justify-center overflow-hidden'}`}
            style={{
                background: 'linear-gradient(135deg, #23272f 0%, #18181b 60%, #111113 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                minHeight: '100vh',
                paddingTop: 'max(env(safe-area-inset-top), 1rem)',
                paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
            }}
        >
            <button
                className="fixed z-50 bg-white/80 hover:bg-gray-200 text-gray-700 rounded-full p-2 shadow-lg border-2 border-gray-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
                style={{
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    borderWidth: '2px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    top: 'max(env(safe-area-inset-top), 0.5rem)',
                    left: 'max(env(safe-area-inset-left), 0.5rem)'
                }}
                onClick={handleBackToNameForm}
                aria-label="Back to Name and Avatar"
            >
                <FaArrowLeft size={24} />
            </button>
            <h1 className="font-baloo text-white text-center drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>Choose Your Adventure!</h1>

            {themePickerMode === 'slide' && (
                <>
                    <div className="flex flex-row items-center justify-center w-full mb-4" style={{ minHeight: 'clamp(200px, 40vh, 320px)' }}>
                        <button
                            className="kid-btn bg-yellow-300 hover:bg-yellow-400 text-white rounded-full mr-1"
                            style={{
                                fontSize: '16px',
                                padding: '1px',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => setCurrentThemeIdx((currentThemeIdx - 1 + themes.length) % themes.length)}
                            aria-label="Previous Adventure"
                        >
                            &#8592;
                        </button>
                        <div className="flex flex-col items-center justify-center" style={{
                            minWidth: 'clamp(200px, 60vw, 640px)',
                            maxWidth: 'clamp(300px, 80vw, 840px)'
                        }}>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={currentTheme.image}
                                        alt={currentTheme.key}
                                        className="rounded-2xl object-contain shadow-2xl"
                                        style={{
                                            height: 'clamp(150px, 35vh, 520px)',
                                            maxWidth: 'clamp(300px, 80vw, 840px)'
                                        }}
                                    />
                                </div>
                                <span className="font-baloo text-white drop-shadow-lg text-center font-bold bg-black bg-opacity-50 px-3 py-2 rounded-2xl border-2 border-yellow-200 mt-2" style={{
                                    fontSize: 'clamp(0.75rem, 3vw, 1.5rem)'
                                }}>{currentTheme.key.charAt(0).toUpperCase() + currentTheme.key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                            </div>
                        </div>
                        <button
                            className="kid-btn bg-yellow-300 hover:bg-yellow-400 text-white rounded-full ml-1"
                            style={{
                                fontSize: '16px',
                                padding: '1px',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => setCurrentThemeIdx((currentThemeIdx + 1) % themes.length)}
                            aria-label="Next Adventure"
                        >
                            &#8594;
                        </button>
                    </div>
                    <button
                        className="kid-btn bg-green-400 hover:bg-green-500 text-white font-bold rounded-2xl mt-2"
                        style={{
                            padding: 'clamp(0.5rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)',
                            fontSize: 'clamp(0.875rem, 3vw, 1.25rem)'
                        }}
                        onClick={handleChooseTheme}
                    >
                        Choose
                    </button>
                </>
            )}
            {themePickerMode === 'grid' && (
                <div className="w-full flex flex-col items-center px-4 pt-4 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                        {themes.map(theme => (
                            <button
                                key={theme.key}
                                onClick={() => {
                                    setSelectedTheme(theme);
                                    navigate('/levels');
                                }}
                                className="flex flex-col items-center justify-center rounded-2xl shadow-lg focus:outline-none transition-all duration-200 text-yellow-900 hover:shadow-2xl hover:scale-105 bg-transparent p-0 w-full"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={theme.image}
                                            alt={theme.key}
                                            className="rounded-2xl object-contain shadow-2xl"
                                            style={{
                                                height: '200px',
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </div>
                                    <span className="font-baloo text-white drop-shadow-lg text-center font-bold bg-black bg-opacity-50 px-3 py-2 rounded-2xl text-lg mt-2">
                                        {theme.key.charAt(0).toUpperCase() + theme.key.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="fixed flex flex-row gap-2 z-50" style={{
                bottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
                right: 'max(env(safe-area-inset-right), 0.5rem)'
            }}>
                <button
                    className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 focus:outline-none ${themePickerMode === 'slide' ? 'bg-yellow-400 text-white scale-110' : 'bg-gray-200 text-gray-700 opacity-70 hover:opacity-100'}`}
                    style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}
                    onClick={() => setThemePickerMode('slide')}
                    aria-label="Slide View"
                >
                    <FaRegImages size={24} />
                </button>
                <button
                    className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 focus:outline-none ${themePickerMode === 'grid' ? 'bg-yellow-400 text-white scale-110' : 'bg-gray-200 text-gray-700 opacity-70 hover:opacity-100'}`}
                    style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}
                    onClick={() => setThemePickerMode('grid')}
                    aria-label="Grid View"
                >
                    <FaThLarge size={24} />
                </button>
            </div>
        </div>
    );
};

export default ThemePicker;