
import React, { useState, useEffect } from 'react';
import { JournalEntry, ViewMode } from './types';
import DailyPrompt from './components/DailyPrompt';
import HistoryCalendar from './components/HistoryCalendar';
import WeeklySummary from './components/WeeklySummary';
import Navbar from './components/Navbar';
import PinAuth from './components/PinAuth';
import { COLORS } from './constants';

const STORAGE_KEY = 'one_line_a_day_data';
const PIN_KEY = 'one_line_a_day_pin';
const THEME_KEY = 'one_line_a_day_theme';

const BackgroundIllustrations: React.FC<{ theme: any }> = ({ theme }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -10px) rotate(3deg); }
          66% { transform: translate(-5px, -20px) rotate(-2deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-sway { animation: sway 10s ease-in-out infinite; transform-origin: bottom center; }
        .svg-transition { transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
      `}
    </style>

    {/* Elegant Butterfly - Top Right */}
    <svg 
      className="absolute top-16 -right-10 w-56 h-56 opacity-[0.09] animate-float" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        className="svg-transition"
        fill={theme.primary} 
        d="M50,55 C65,30 95,35 95,55 C95,75 65,85 50,60 C35,85 5,75 5,55 C5,35 35,30 50,55 Z" 
        fillRule="evenodd"
        opacity="0.3"
      />
      <path 
        className="svg-transition"
        stroke={theme.primary} 
        strokeWidth="0.4" 
        fill="none" 
        d="M50,55 C58,35 90,40 90,55 C90,70 60,80 50,60 C40,80 10,70 10,55 C10,40 42,35 50,55 Z"
      />
      <path 
        className="svg-transition"
        stroke={theme.primary} 
        strokeWidth="0.3" 
        fill="none" 
        d="M48,45 C45,35 40,30 32,30 M52,45 C55,35 60,30 68,30"
      />
      <circle className="svg-transition" cx="50" cy="55" r="1" fill={theme.primary} />
    </svg>
    
    {/* One-Line Art Flower - Bottom Left */}
    <svg 
      className="absolute -bottom-16 -left-16 w-80 h-80 opacity-[0.07] animate-sway" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        className="svg-transition"
        stroke={theme.primary} 
        strokeWidth="0.6" 
        fill="none" 
        d="M50,100 C50,100 45,75 50,55 C55,35 40,20 50,10 C60,20 45,35 50,55 M50,75 C35,70 20,55 30,40 C40,25 50,45 50,60 M50,80 C65,75 80,60 70,45 C60,30 50,50 50,65"
      />
      <circle className="svg-transition" cx="50" cy="10" r="1.5" fill={theme.primary} />
    </svg>

    {/* Gentle Drifting Petals */}
    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-[0.15] animate-pulse svg-transition" style={{ backgroundColor: theme.primary }}></div>
    <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full opacity-[0.2] svg-transition" style={{ backgroundColor: theme.secondary }}></div>
    <div className="absolute top-2/3 right-12 w-1 h-1 rounded-full opacity-[0.1] svg-transition" style={{ backgroundColor: theme.primary }}></div>
  </div>
);

const App: React.FC = () => {
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DAILY);
  const [pin, setPin] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedPin = localStorage.getItem(PIN_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedData) setEntries(JSON.parse(savedData));
    if (savedPin) setPin(savedPin);
    else setIsAuthenticated(true);
    if (savedTheme === 'dark') setIsDarkMode(true);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    }
  }, [entries, isLoading, isDarkMode]);

  const handleSaveEntry = (entry: JournalEntry) => {
    setEntries(prev => ({ ...prev, [entry.date]: entry }));
  };

  const handleSetPin = (newPin: string | null) => {
    setPin(newPin);
    if (newPin) localStorage.setItem(PIN_KEY, newPin);
    else localStorage.removeItem(PIN_KEY);
  };

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg }}>
        <div className="animate-pulse font-serif italic" style={{ color: theme.muted }}>Loading...</div>
      </div>
    );
  }

  if (pin && !isAuthenticated) {
    return <PinAuth correctPin={pin} theme={theme} onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto shadow-2xl transition-all duration-700 overflow-hidden relative" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <BackgroundIllustrations theme={theme} />
      
      <main className="flex-1 overflow-y-auto px-6 py-8 relative z-10">
        {viewMode === ViewMode.DAILY && (
          <DailyPrompt 
            existingEntry={entries[new Date().toISOString().split('T')[0]]} 
            onSave={handleSaveEntry} 
            theme={theme}
          />
        )}
        {viewMode === ViewMode.CALENDAR && (
          <HistoryCalendar entries={entries} theme={theme} />
        )}
        {viewMode === ViewMode.SUMMARY && (
          <WeeklySummary entries={entries} theme={theme} />
        )}
      </main>

      <Navbar 
        activeMode={viewMode} 
        onModeChange={setViewMode} 
        onToggleLock={() => setIsAuthenticated(false)} 
        hasPin={!!pin} 
        onSetPin={handleSetPin} 
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        theme={theme}
      />
    </div>
  );
};

export default App;
