import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathGameContext } from '../App.jsx';
import { tableBgColors, themeConfigs } from '../utils/mathGameLogic.js';

const COLOR_BELTS = ['white', 'yellow', 'green', 'blue', 'red', 'brown'];

const beltPretty = (b) => b.charAt(0).toUpperCase() + b.slice(1);

function readLSProgress(level, belt) {
  try {
    const raw = localStorage.getItem(`math-table-progress-${level}-${belt}`);
    if (!raw) return null;
    if (raw === 'completed') return { completed: true, perfectPerformance: false };
    if (raw === 'perfect') return { completed: true, perfectPerformance: true };
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

const DifficultyPicker = () => {
  const navigate = useNavigate();
  const {
    selectedTable,
    selectedTheme,
    tableProgress,
    startQuizWithDifficulty,
  } = useContext(MathGameContext);

  if (!selectedTable) {
    navigate('/levels');
    return null;
  }

  const theme = selectedTheme?.key ? themeConfigs[selectedTheme.key] : null;

  // compute unlocks for color belts + black (black unlocked when brown is completed)
  const unlockedMap = useMemo(() => {
    const lvlKey = String(selectedTable);
    const map = { white: true };
    COLOR_BELTS.forEach((belt, idx) => {
      if (idx === 0) return;
      const prev = COLOR_BELTS[idx - 1];
      const ctxPrev = tableProgress?.[lvlKey]?.[prev];
      const lsPrev = readLSProgress(lvlKey, prev);
      map[belt] = !!(ctxPrev?.completed || lsPrev?.completed);
    });
    const ctxBrown = tableProgress?.[lvlKey]?.brown;
    const lsBrown = readLSProgress(lvlKey, 'brown');
    map.black = !!(ctxBrown?.completed || lsBrown?.completed);
    return map;
  }, [selectedTable, tableProgress]);

  const handlePick = (belt, locked) => {
    if (locked) return;
    if (belt === 'black') {
      navigate('/black');                // ✅ go to black degrees route
    } else {
      startQuizWithDifficulty(belt);     // learning → quiz for color belts
    }
  };

  const renderCard = (belt, idx) => {
    const locked = !unlockedMap[belt];
    const colorClass =
      tableBgColors[idx % tableBgColors.length] || 'bg-gray-200 border-gray-300';
    const ring = locked ? 'opacity-60 grayscale' : '';
    const heart =
      belt === 'white' ? '🤍' :
      belt === 'yellow' ? '💛' :
      belt === 'green' ? '💚' :
      belt === 'blue' ? '💙' :
      belt === 'red' ? '❤️' :
      belt === 'brown' ? '🤎' : '🖤';
    return (
      <button
        key={belt}
        onClick={() => handlePick(belt, locked)}
        className={`relative flex flex-col items-center justify-between rounded-2xl border-2 p-5 shadow-xl text-gray-800 bg-white/90 hover:bg-white transition ${ring}`}
        style={{
          minHeight: 180,
          background: theme?.bg ? `linear-gradient(135deg, var(--tw-gradient-stops))` : undefined,
        }}
      >
        <div className="absolute top-2 right-3 text-xl">{locked ? '🔒' : '🔓'}</div>
        <div className={`w-20 h-4 rounded-full ${colorClass}`} />
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {beltPretty(belt)} Belt
          </div>
          <div className="text-2xl mt-1">{heart}</div>
        </div>
        <div className="text-sm opacity-80">
          {belt === 'black' ? 'Degrees 1–7' : '10 Questions'}
        </div>
      </button>
    );
  };

  return (
    <div
      className="min-h-screen w-full px-4 py-6 flex flex-col items-center"
      style={{
        backgroundImage: "url('/night_sky_landscape.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-white/80 hover:bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl shadow transition"
            onClick={() => navigate('/levels')}
          >
            ⟵ Levels
          </button>
          <h1 className="text-white text-3xl font-extrabold drop-shadow">Level {selectedTable}</h1>
          <div className="w-[92px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_BELTS.map((b, idx) => renderCard(b, idx))}
          {renderCard('black', 6)} {/* ✅ Black belt entry */}
        </div>
      </div>
    </div>
  );
};

export default DifficultyPicker;
