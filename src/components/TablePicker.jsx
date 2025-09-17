// src/components/TablePicker.jsx
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathGameContext } from '../App.jsx';

const TOTAL_LEVELS = 6; // only 6 levels as required
const COLOR_BELTS = ['white', 'yellow', 'green', 'blue', 'red', 'brown'];

function readBeltProgressFromLS(level, belt) {
  try {
    const key = `math-table-progress-${level}-${belt}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    if (raw === 'completed') return { completed: true, perfectPerformance: false };
    if (raw === 'perfect') return { completed: true, perfectPerformance: true };
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

function areColorBeltsCompleted(level, tableProgress) {
  const lvlKey = String(level);
  return COLOR_BELTS.every((belt) => {
    const ctx = tableProgress?.[lvlKey]?.[belt];
    const ls = readBeltProgressFromLS(lvlKey, belt);
    return !!(ctx?.completed || ls?.completed);
  });
}

// OPTIONAL: require all 7 black degrees to unlock next level.
// Toggle this to `true` if you want black required.
const REQUIRE_BLACK_FOR_NEXT_LEVEL = false;

function areAllBlackDegreesCompleted() {
  try {
    const raw = localStorage.getItem('math-completed-black-belt-degrees');
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return false;
    // degrees 1..7 completed
    for (let d = 1; d <= 7; d++) {
      if (!arr.includes(d)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

const TablePicker = () => {
  const navigate = useNavigate();
  const { selectedTable, setSelectedTable, tableProgress } = useContext(MathGameContext);

  // Compute which levels are unlocked
  const unlockedLevels = useMemo(() => {
    const arr = new Array(TOTAL_LEVELS).fill(false);
    arr[0] = true; // Level 1 always unlocked

    for (let lvl = 2; lvl <= TOTAL_LEVELS; lvl++) {
      const prev = lvl - 1;

      const colorDone = areColorBeltsCompleted(prev, tableProgress);
      const blackOk = REQUIRE_BLACK_FOR_NEXT_LEVEL ? areAllBlackDegreesCompleted() : true;

      arr[lvl - 1] = colorDone && blackOk;
    }
    return arr;
  }, [tableProgress]);

  const handleSelect = (levelIndex) => {
    if (!unlockedLevels[levelIndex]) return;
    const lvl = levelIndex + 1;
    setSelectedTable(lvl);
    navigate('/belts');
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
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-white/80 hover:bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl shadow transition"
            onClick={() => navigate('/theme')}
          >
            ⟵ Themes
          </button>
          <h1 className="text-white text-3xl font-extrabold drop-shadow">Choose a Level</h1>
          <div className="w-[92px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: TOTAL_LEVELS }).map((_, idx) => {
            const levelNumber = idx + 1;
            const unlocked = unlockedLevels[idx];
            const lockedBadge = unlocked ? '🔓' : '🔒';

            // quick visual state
            const donePrev =
              idx === 0 ? true : areColorBeltsCompleted(levelNumber - 1, tableProgress);

            return (
              <button
                key={levelNumber}
                onClick={() => handleSelect(idx)}
                className={`relative rounded-2xl p-6 bg-white/90 shadow-xl hover:bg-white transition text-left ${
                  unlocked ? '' : 'opacity-60 grayscale cursor-not-allowed'
                }`}
              >
                <div className="absolute top-2 right-3 text-xl">{lockedBadge}</div>
                <div className="text-3xl font-extrabold mb-2">Level {levelNumber}</div>
                <div className="text-gray-700">
                  {levelNumber === 1 ? (
                    <span>Start here</span>
                  ) : donePrev ? (
                    <span>Ready to play</span>
                  ) : (
                    <span>Finish Level {levelNumber - 1} belts to unlock</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TablePicker;
