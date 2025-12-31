
import React, { useState } from 'react';

interface PinAuthProps {
  correctPin: string;
  onAuthenticated: () => void;
  theme: any;
}

const PinAuth: React.FC<PinAuthProps> = ({ correctPin, onAuthenticated, theme }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onAuthenticated();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-md mx-auto shadow-xl transition-colors duration-500" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <div className="mb-12 text-center relative">
        <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all shadow-lg overflow-hidden relative group" style={{ backgroundColor: theme.card }}>
           <div className="absolute inset-0 opacity-10 blur-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.primary }}></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 relative z-10" style={{ color: theme.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif">A Moment of Peace</h2>
        <p className="text-xs opacity-40 mt-3 tracking-widest uppercase">Enter PIN to unlock</p>
      </div>

      <div className="flex gap-6 mb-20">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
              error ? 'bg-red-400 border-red-400 scale-125' : 
              pin.length > i ? 'scale-110 shadow-md' : 'border-opacity-10'
            }`}
            style={{ 
              backgroundColor: pin.length > i ? theme.primary : 'transparent',
              borderColor: pin.length > i ? theme.primary : theme.text
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 w-full px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleInput(num.toString())}
            className="h-16 rounded-2xl flex items-center justify-center text-xl font-light hover:bg-opacity-5 active:scale-90 transition-all shadow-sm border border-opacity-5"
            style={{ backgroundColor: theme.card, borderColor: theme.text, color: theme.text }}
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleInput('0')}
          className="h-16 rounded-2xl flex items-center justify-center text-xl font-light hover:bg-opacity-5 active:scale-90 transition-all shadow-sm border border-opacity-5"
          style={{ backgroundColor: theme.card, borderColor: theme.text, color: theme.text }}
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="h-16 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PinAuth;
