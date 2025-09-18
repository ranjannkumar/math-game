// src/components/ResultsScreen.jsx
import React, { useEffect, useContext, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { showShootingStars, clearShootingStars } from '../utils/mathGameLogic';
import { MathGameContext } from '../App.jsx';
import { useNavigate } from 'react-router-dom';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const {
    selectedDifficulty,
    selectedTable,
    correctCount,

    setShowResult,

    // belt progress (colored belts)
    setTableProgress,
    tableProgress,

    // black-belt state (current level arrays)
    unlockedDegrees,
    setUnlockedDegrees,
    setCompletedBlackBeltDegrees,
  } = useContext(MathGameContext);

  const isBlack = String(selectedDifficulty).startsWith('black');
  const degree = isBlack ? parseInt(String(selectedDifficulty).split('-')[1] || '1', 10) : null;

  const maxQuestions = isBlack ? (degree === 7 ? 30 : 20) : 10;
  const allCorrect = correctCount === maxQuestions;

  // === Persist completion for COLORED BELTS exactly once ===
  const persistedColoredRef = useRef(false);
  useEffect(() => {
    if (persistedColoredRef.current) return;
    if (!selectedTable || !selectedDifficulty || isBlack) return;

    const levelKey = String(selectedTable);
    const beltKey = String(selectedDifficulty);
    const lsKey = `math-table-progress-${levelKey}-${beltKey}`;

    const alreadyInLS = !!localStorage.getItem(lsKey);
    const alreadyInState = !!(tableProgress?.[levelKey]?.[beltKey]?.completed);
    if (alreadyInLS || alreadyInState) {
      persistedColoredRef.current = true;
      return;
    }

    try {
      localStorage.setItem(lsKey, allCorrect ? 'perfect' : 'completed');
    } catch {}

    setTableProgress((prev = {}) => {
      const prevBelt = prev?.[levelKey]?.[beltKey];
      if (prevBelt?.completed) return prev;
      const levelObj = prev[levelKey] || {};
      return {
        ...prev,
        [levelKey]: {
          ...levelObj,
          [beltKey]: { completed: true, perfectPerformance: allCorrect },
        },
      };
    });

    persistedColoredRef.current = true;
  }, [selectedTable, selectedDifficulty, isBlack, allCorrect, setTableProgress, tableProgress]);

  // === Persist completion & unlock NEXT degree for BLACK (per-level) ===
  const persistedBlackRef = useRef(false);
  useEffect(() => {
    if (persistedBlackRef.current) return;
    if (!isBlack || !degree || !selectedTable) return;

    const uKey = `math-l${selectedTable}-unlocked-degrees`;
    const cKey = `math-l${selectedTable}-completed-black-degrees`;

    // Update completed list for this level
    setCompletedBlackBeltDegrees((prev = []) => {
      const base = Array.isArray(prev) ? prev.slice() : [];
      if (!base.includes(degree)) base.push(degree);
      base.sort((a, b) => a - b);
      try { localStorage.setItem(cKey, JSON.stringify(base)); } catch {}
      return base;
    });

    // Ensure degree is unlocked + unlock next for this level
    setUnlockedDegrees((prev = []) => {
      let base = Array.isArray(prev) ? prev.slice() : [];
      if (!base.includes(degree)) base.push(degree);
      const next = degree + 1;
      if (next <= 7 && !base.includes(next)) base.push(next);
      base = Array.from(new Set(base)).sort((a, b) => a - b);
      try { localStorage.setItem(uKey, JSON.stringify(base)); } catch {}
      return base;
    });

    persistedBlackRef.current = true;
  }, [isBlack, degree, selectedTable, setUnlockedDegrees, setCompletedBlackBeltDegrees]);

  // Shooting stars once
  const starsShownRef = useRef(false);
  useEffect(() => {
    if (allCorrect && !starsShownRef.current) {
      starsShownRef.current = true;
      showShootingStars();
    }
    return () => clearShootingStars();
  }, [allCorrect]);

  const beltName = (() => {
    if (isBlack) return `Black (Degree ${degree})`;
    switch (selectedDifficulty) {
      case 'white': return 'White';
      case 'yellow': return 'Yellow';
      case 'green': return 'Green';
      case 'blue': return 'Blue';
      case 'red': return 'Red';
      case 'brown': return 'Brown';
      default: return 'Unknown';
    }
  })();

  const handlePrimary = () => {
    setShowResult(false);
    clearShootingStars();
    setLeaving(true);
    navigate(isBlack ? '/black' : '/belts', { replace: true });
  };

  if (leaving) return null;

  return (
    <div
      className="min-h-screen w-full relative px-3 py-6 flex flex-col items-center"
      style={{
        backgroundImage: "url('/night_sky_landscape.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={allCorrect ? 280 : 140}
        gravity={0.5}
        run
        recycle={false}
        style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center bg-white/90 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-2">
          {allCorrect ? 'Congratulations!' : 'Great effort!'}
        </h2>
        <p className="text-lg mb-4">
          You finished {beltName} on Level {selectedTable}.
        </p>
        <p className="mb-6">
          Score: <strong>{correctCount}</strong> / {maxQuestions}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-all"
            onClick={handlePrimary}
          >
            {isBlack ? 'Choose another degree' : 'Choose another belt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
