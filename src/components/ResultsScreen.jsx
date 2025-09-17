// src/components/ResultsScreen.jsx
import React, { useEffect, useContext, useRef } from 'react';
import Confetti from 'react-confetti';
import { showShootingStars, clearShootingStars } from '../utils/mathGameLogic';
import { MathGameContext } from '../App.jsx';
import { useNavigate } from 'react-router-dom';

const ResultsScreen = () => {
  const navigate = useNavigate();

  const {
    selectedDifficulty,
    selectedTable,
    correctCount,

    setShowResult,

    setTableProgress,
    tableProgress,

    // black-belt state
    unlockedDegrees,
    setUnlockedDegrees,
    completedBlackBeltDegrees,
    setCompletedBlackBeltDegrees,
  } = useContext(MathGameContext);

  const isBlack = String(selectedDifficulty).startsWith('black');
  const degree = isBlack ? parseInt(String(selectedDifficulty).split('-')[1] || '1', 10) : null;

  const maxQuestions =
    isBlack ? (degree === 7 ? 30 : 20) :
    selectedDifficulty === 'brown' ? 10 : 10;

  const allCorrect = correctCount === maxQuestions;

  // Persist completion for color belts
  useEffect(() => {
    if (!selectedTable || !selectedDifficulty || isBlack) return;

    const levelKey = String(selectedTable);
    const beltKey = String(selectedDifficulty);
    const perfect = allCorrect;

    try {
      const lsKey = `math-table-progress-${levelKey}-${beltKey}`;
      localStorage.setItem(lsKey, perfect ? 'perfect' : 'completed');
    } catch {}

    try {
      const prev = tableProgress || {};
      const lvl = prev[levelKey] || {};
      const updated = {
        ...prev,
        [levelKey]: {
          ...lvl,
          [beltKey]: { completed: true, perfectPerformance: perfect },
        },
      };
      setTableProgress(updated);
    } catch {}
  }, [isBlack, selectedTable, selectedDifficulty, allCorrect, setTableProgress, tableProgress]);

  // Persist completion & unlock next degree for black
  useEffect(() => {
    if (!isBlack || !degree) return;

    // Add to completed list
    if (!completedBlackBeltDegrees.includes(degree)) {
      const updatedCompleted = [...completedBlackBeltDegrees, degree].sort((a, b) => a - b);
      setCompletedBlackBeltDegrees(updatedCompleted);
      localStorage.setItem('math-completed-black-belt-degrees', JSON.stringify(updatedCompleted));
    }

    // Ensure current degree is in unlocked list too (idempotent)
    const lsRaw = localStorage.getItem('math-unlocked-degrees');
    const lsArr = lsRaw ? (() => { try { return JSON.parse(lsRaw); } catch { return []; } })() : [];
    const base = Array.from(new Set([...(unlockedDegrees || []), ...(lsArr || []), degree])).sort((a,b)=>a-b);

    // Unlock next
    const next = degree + 1;
    if (next <= 7 && !base.includes(next)) base.push(next);

    const normalized = Array.from(new Set(base)).sort((a, b) => a - b);
    setUnlockedDegrees(normalized);
    localStorage.setItem('math-unlocked-degrees', JSON.stringify(normalized));
  }, [
    isBlack,
    degree,
    unlockedDegrees,
    setUnlockedDegrees,
    completedBlackBeltDegrees,
    setCompletedBlackBeltDegrees,
  ]);

  // Shooting stars once
  const starsShownRef = useRef(false);
  useEffect(() => {
    if (allCorrect && !starsShownRef.current) {
      starsShownRef.current = true;
      showShootingStars();
    }
    return () => clearShootingStars();
  }, [allCorrect]);

  const getBeltName = (difficulty) => {
    if (String(difficulty).startsWith('black')) return `Black (Degree ${degree})`;
    switch (difficulty) {
      case 'white': return 'White';
      case 'yellow': return 'Yellow';
      case 'green': return 'Green';
      case 'blue': return 'Blue';
      case 'red': return 'Red';
      case 'brown': return 'Brown';
      default: return 'Unknown';
    }
  };

  const handlePrimary = () => {
    setShowResult(false);
    navigate(isBlack ? '/black' : '/belts');
  };

  const beltName = getBeltName(selectedDifficulty);

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
