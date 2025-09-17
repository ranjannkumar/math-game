// src/components/DifficultyPicker.jsx
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathGameContext } from '../App.jsx';
import { tableBgColors, themeConfigs } from '../utils/mathGameLogic.js';

const BELTS = ['white', 'yellow', 'green', 'blue', 'red', 'brown'];

const beltPretty = (b) =>
  b.charAt(0).toUpperCase() + b.slice(1);

function readLSProgress(level, belt) {
  try {
    const raw = localStorage.getItem(`math-table-progress-${level}-${belt}`);
    if (!raw) return null;
    // We accept legacy string formats and JSON objects.
    if (raw === 'completed') return { completed: true, perfectPerformance: false };
    if (raw === 'perfect') return { completed: true, perfectPerformance: true };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // ignore
  }
  return null;
}

const DifficultyPicker = () => {
  const navigate = useNavigate();
  const {
    selectedTable,
    selectedTheme,
    tableProgress,       // may be empty the first time
    startQuizWithDifficulty,
  } = useContext(MathGameContext);

  // If the user somehow came here directly, send them to level picker.
  if (!selectedTable) {
    navigate('/levels');
    return null;
  }

  const theme = selectedTheme?.key ? themeConfigs[selectedTheme.key] : null;

  // One source of truth for “is this belt unlocked?”
  const unlockedMap = useMemo(() => {
    const map = {};
    const lvlKey = String(selectedTable);

    // White is always unlocked
    map.white = true;

    BELTS.forEach((belt, idx) => {
      if (idx === 0) return;
      const prevBelt = BELTS[idx - 1];

      // Prefer context progress, fallback to localStorage
      const fromCtx = tableProgress?.[lvlKey]?.[prevBelt];
      const fromLS = readLSProgress(lvlKey, prevBelt);
      const prevCompleted = !!(fromCtx?.completed || fromLS?.completed);

      map[belt] = prevCompleted;
    });
    return map;
  }, [selectedTable, tableProgress]);

  const handlePick = (belt, locked) => {
    if (locked) return; // ignore taps on locked cards
    // start learning sequence → then quiz
    startQuizWithDifficulty(belt);
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
          <h1 className="text-white text-3xl font-extrabold drop-shadow">
            Level {selectedTable}
          </h1>
          <div className="w-[92px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BELTS.map((belt, idx) => {
            const locked = !unlockedMap[belt];
            const colorClass =
              tableBgColors[idx % tableBgColors.length] || 'bg-gray-200 border-gray-300';
            const ring = locked ? 'opacity-60 grayscale' : '';
            const badge =
              belt === 'white' ? '🤍' :
              belt === 'yellow' ? '💛' :
              belt === 'green' ? '💚' :
              belt === 'blue' ? '💙' :
              belt === 'red' ? '❤️' : '🤎';

            return (
              <button
                key={belt}
                onClick={() => handlePick(belt, locked)}
                className={`relative flex flex-col items-center justify-between rounded-2xl border-2 p-5 shadow-xl text-gray-800 bg-white/90 hover:bg-white transition
                  ${ring}`}
                style={{
                  minHeight: 180,
                  background:
                    theme?.bg
                      ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                      : undefined,
                }}
              >
                <div className="absolute top-2 right-3 text-xl">
                  {locked ? '🔒' : '🔓'}
                </div>

                <div className={`w-20 h-4 rounded-full ${colorClass}`} />

                <div className="text-center">
                  <div className="text-3xl font-extrabold">
                    {beltPretty(belt)} Belt
                  </div>
                  <div className="text-2xl mt-1">{badge}</div>
                </div>

                <div className="text-sm opacity-80">10 Questions</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DifficultyPicker;
