// src/components/NameForm.jsx
import React, { useContext, useState } from 'react';
import { MathGameContext } from '../App.jsx';

const NameForm = () => {
  const {
    childName, handleNameChange,
    childAge, handleAgeChange,
    childPin, handlePinChange,
    handlePinSubmit,
  } = useContext(MathGameContext);

  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!childPin || childPin.trim().length < 2) {
      setError('Please enter a valid PIN (at least 2 characters).');
      return;
    }
    setError('');
    handlePinSubmit(childPin.trim());
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg,#ffe08a,#ff9ecd 40%,#8fd3fe)',
      }}
    >
      <form
        onSubmit={onSubmit}
        className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-extrabold text-center mb-4">Welcome!</h1>

        <label className="block text-sm font-semibold mb-1">Name</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg border outline-none focus:ring"
          value={childName}
          onChange={handleNameChange}
          placeholder="Optional"
        />

        <label className="block text-sm font-semibold mb-1">Age</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg border outline-none focus:ring"
          value={childAge}
          onChange={handleAgeChange}
          placeholder="Optional"
          inputMode="numeric"
        />

        <label className="block text-sm font-semibold mb-1">PIN</label>
        <input
          className="w-full mb-2 px-3 py-2 rounded-lg border outline-none focus:ring"
          value={childPin}
          onChange={handlePinChange}
          placeholder="Enter PIN"
        />

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default NameForm;
