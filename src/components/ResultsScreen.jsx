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

    // make sure overlay doesn't persist when we leave
    setShowResult,

    // cached progress to unlock next belt
    setTableProgress,
    tableProgress,
  } = useContext(MathGameContext);

  const maxQuestions =
    selectedDifficulty === 'brown'
      ? 10
      : (String(selectedDifficulty).startsWith('black')
          ? (String(selectedDifficulty).endsWith('7') ? 30 : 20)
          : 10);

  const allCorrect = correctCount === maxQuestions;

  // Persist completion so next belt unlocks reliably
  useEffect(() => {
    if (!selectedTable || !selectedDifficulty) return;

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
  }, [selectedTable, selectedDifficulty, allCorrect, setTableProgress, tableProgress]);

  // Fire shooting stars ONCE (even in React 18 Strict Mode dev)
  const starsShownRef = useRef(false);
  useEffect(() => {
    if (allCorrect && !starsShownRef.current) {
      starsShownRef.current = true;
      showShootingStars();
    }
    return () => clearShootingStars();
  }, [allCorrect]);

  const getBeltName = (difficulty) => {
    switch (difficulty) {
      case 'white': return 'White';
      case 'yellow': return 'Yellow';
      case 'green': return 'Green';
      case 'blue': return 'Blue';
      case 'red': return 'Red';
      case 'brown': return 'Brown';
      default: return 'Black';
    }
  };

  const handleBackToBelts = () => {
    setShowResult(false);
    navigate('/belts');
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
          You finished the {beltName} belt on Level {selectedTable}.
        </p>
        <p className="mb-6">
          Score: <strong>{correctCount}</strong> / {maxQuestions}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-all"
            onClick={handleBackToBelts}
          >
            Choose another belt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
