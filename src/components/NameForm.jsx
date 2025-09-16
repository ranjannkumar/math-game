import React, { useState } from 'react';

const NameForm = ({ setScreen, setShowPreTestPopup, setPreTestSection, childName, setChildName }) => {
  const [pin, setPin] = useState('');
  const [showPinWarning, setShowPinWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setShowPinWarning(true);
      return;
    }
    setShowPinWarning(false);
    
    let associatedName = '';
    if (pin === '1') associatedName = 'Richie';
    else if (pin === '2') associatedName = 'CJ';

    if (associatedName) {
      localStorage.setItem('math-child-name', associatedName);
      setChildName(associatedName);
    }
    
    setScreen('theme');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative landscape-optimized portrait-optimized ios-notch" style={{
      backgroundImage: "url('/night_sky_landscape.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      paddingTop: 'max(env(safe-area-inset-top), 1rem)',
      paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
    }}>
      <div className="bg-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg max-w-sm sm:max-w-md w-full flex flex-col items-center relative z-10 mx-2 sm:mx-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-baloo text-white mb-3 sm:mb-4 drop-shadow-lg">Let's Get Started!</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <label className="text-lg sm:text-xl md:text-2xl font-comic text-white font-bold mb-1 sm:mb-2">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="mb-3 sm:mb-4 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base border-2 border-white border-opacity-60 focus:outline-none focus:ring-2 focus:ring-white w-28 sm:w-32 text-center bg-gray-700 bg-opacity-80 text-white font-bold transition-all duration-200"
            required
            maxLength={8}
            id="pin-input"
            autoComplete="off"
          />
          {showPinWarning && (
            <div className="text-red-500 text-sm mb-2">Please enter your PIN to continue.</div>
          )}
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-900 text-white font-bold py-1.5 sm:py-2 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-lg mt-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
            disabled={!pin}
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;