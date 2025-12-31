
import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface HistoryCalendarProps {
  entries: Record<string, JournalEntry>;
  theme: any;
}

const HistoryCalendar: React.FC<HistoryCalendarProps> = ({ entries, theme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    return { firstDay, lastDate };
  };

  const { firstDay, lastDate } = getDaysInMonth(currentMonth);

  const days = Array.from({ length: lastDate }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const hasEntry = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries[dateStr];
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)));
  };

  return (
    <div className="animate-fadeIn pb-10">
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-serif" style={{ color: theme.text }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          {/* Fix: Removed invalid 'hoverBackgroundColor' property from style object as it is not a supported CSS property in React style prop. */}
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full transition-colors opacity-40 hover:opacity-100 hover:bg-opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          {/* Fix: Removed invalid 'hoverBackgroundColor' property from style object as it is not a supported CSS property in React style prop. */}
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full transition-colors opacity-40 hover:opacity-100 hover:bg-opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transform rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-3 text-center mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-[10px] font-bold uppercase opacity-30 tracking-widest">{d}</div>
        ))}
        {blanks.map(b => <div key={`b-${b}`} />)}
        {days.map(day => {
          const entry = hasEntry(day);
          const today = isToday(day);
          return (
            <button
              key={day}
              onClick={() => entry && setSelectedEntry(entry)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all text-sm group
                ${entry ? 'cursor-pointer hover:bg-opacity-5' : 'cursor-default opacity-40'}
              `}
              style={{ backgroundColor: entry ? theme.primary + '10' : 'transparent' }}
            >
              <span className={today ? 'font-bold' : ''} style={{ color: today ? theme.primary : theme.text }}>{day}</span>
              {entry && (
                <div className="absolute bottom-2 w-1 h-1 rounded-full shadow-sm scale-100 transition-transform group-hover:scale-150" style={{ backgroundColor: theme.primary }} />
              )}
              {today && (
                 <div className="absolute inset-0 rounded-xl border-2 opacity-20" style={{ borderColor: theme.primary }}></div>
              )}
            </button>
          );
        })}
      </div>

      {selectedEntry && (
        <div className="mt-12 p-8 rounded-3xl border shadow-xl animate-fadeIn relative overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.primary }}></div>
          <div className="flex justify-between items-start mb-6">
             <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">
              {new Date(selectedEntry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'short' })}
            </span>
            <button onClick={() => setSelectedEntry(null)} className="opacity-30 hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedEntry.question && (
            <p className="text-xs italic mb-4 leading-relaxed opacity-40" style={{ color: theme.text }}>{selectedEntry.question}</p>
          )}
          <p className="text-lg font-light leading-relaxed" style={{ color: theme.text }}>{selectedEntry.text}</p>
        </div>
      )}
    </div>
  );
};

export default HistoryCalendar;
