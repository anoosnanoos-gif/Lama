
import React, { useState } from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  activeMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onToggleLock: () => void;
  hasPin: boolean;
  onSetPin: (pin: string | null) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  theme: any;
}

const Navbar: React.FC<NavbarProps> = ({ activeMode, onModeChange, onToggleLock, hasPin, onSetPin, isDarkMode, onToggleTheme, theme }) => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => setShowSettings(!showSettings);

  const handleTogglePin = () => {
    if (hasPin) {
      if (confirm('Do you want to remove the PIN lock?')) onSetPin(null);
    } else {
      const pin = prompt('Enter a new 4-digit PIN:');
      if (pin && pin.length === 4 && /^\d+$/.test(pin)) onSetPin(pin);
      else if (pin) alert('PIN must be exactly 4 digits.');
    }
  };

  return (
    <nav className="relative flex flex-col">
      {showSettings && (
        <div className="absolute bottom-full left-0 w-full p-4 border-t flex flex-col gap-2 animate-fadeIn shadow-2xl rounded-t-3xl backdrop-blur-xl bg-opacity-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          {/* Fix: Removed invalid 'hoverBackgroundColor' property from style object as it is not a supported CSS property in React style prop. */}
          <button 
            onClick={onToggleTheme}
            className="flex items-center gap-3 p-3 text-sm rounded-2xl hover:bg-opacity-5 transition-all"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
          
          <button 
            onClick={handleTogglePin}
            className="flex items-center gap-3 p-3 text-sm rounded-2xl hover:bg-opacity-5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" style={{ color: theme.primary }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {hasPin ? 'Remove PIN Lock' : 'Enable PIN Lock'}
          </button>

          <button 
             onClick={() => { setShowSettings(false); onToggleLock(); }}
             disabled={!hasPin}
             className={`flex items-center gap-3 p-3 text-sm rounded-2xl transition-all ${hasPin ? 'hover:bg-opacity-5' : 'opacity-20'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Lock Journal
          </button>
        </div>
      )}

      <div className="flex justify-around items-center p-6 border-t z-10 transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
        <button 
          onClick={() => { setShowSettings(false); onModeChange(ViewMode.DAILY); }}
          className={`p-2 transition-all duration-500 rounded-full ${activeMode === ViewMode.DAILY ? 'scale-110 shadow-sm' : 'opacity-20 hover:opacity-100'}`}
          style={{ backgroundColor: activeMode === ViewMode.DAILY ? theme.primary + '20' : 'transparent', color: activeMode === ViewMode.DAILY ? theme.primary : theme.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>

        <button 
          onClick={() => { setShowSettings(false); onModeChange(ViewMode.CALENDAR); }}
          className={`p-2 transition-all duration-500 rounded-full ${activeMode === ViewMode.CALENDAR ? 'scale-110 shadow-sm' : 'opacity-20 hover:opacity-100'}`}
          style={{ backgroundColor: activeMode === ViewMode.CALENDAR ? theme.primary + '20' : 'transparent', color: activeMode === ViewMode.CALENDAR ? theme.primary : theme.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
        </button>

        <button 
          onClick={() => { setShowSettings(false); onModeChange(ViewMode.SUMMARY); }}
          className={`p-2 transition-all duration-500 rounded-full ${activeMode === ViewMode.SUMMARY ? 'scale-110 shadow-sm' : 'opacity-20 hover:opacity-100'}`}
          style={{ backgroundColor: activeMode === ViewMode.SUMMARY ? theme.primary + '20' : 'transparent', color: activeMode === ViewMode.SUMMARY ? theme.primary : theme.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        </button>

        <button 
          onClick={toggleSettings}
          className={`p-2 transition-all duration-500 rounded-full ${showSettings ? 'rotate-180 scale-110' : 'opacity-20 hover:opacity-100'}`}
          style={{ backgroundColor: showSettings ? theme.primary + '10' : 'transparent', color: showSettings ? theme.primary : theme.text }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
