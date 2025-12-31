
import React, { useEffect, useState } from 'react';
import { JournalEntry } from '../types';
import { generateWeeklyInsight } from '../services/geminiService';

interface WeeklySummaryProps {
  entries: Record<string, JournalEntry>;
  theme: any;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ entries, theme }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(true);

  const last7DaysEntries = (Object.values(entries) as JournalEntry[])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 7);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const textArray = last7DaysEntries.map(e => e.text);
      const res = await generateWeeklyInsight(textArray);
      setInsight(res);
      setLoadingInsight(false);
    };
    
    if (last7DaysEntries.length > 0) {
      fetchInsight();
    } else {
      setLoadingInsight(false);
      setInsight("Your weekly patterns await your first entries.");
    }
  }, []);

  return (
    <div className="animate-fadeIn pb-24">
      <h2 className="text-3xl font-serif mb-2" style={{ color: theme.text }}>The Week's Whisper</h2>
      <p className="text-[10px] opacity-40 mb-10 tracking-[0.2em] uppercase">Reflections on your latest journey</p>

      <div className="mb-12 p-8 rounded-3xl border-2 border-dashed shadow-sm transition-all relative overflow-hidden group" style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: theme.primary }}></div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: theme.primary }}>AI Reflection</h3>
        {loadingInsight ? (
           <div className="space-y-2 animate-pulse">
             <div className="h-3 w-full rounded bg-gray-200 opacity-20"></div>
             <div className="h-3 w-4/5 rounded bg-gray-200 opacity-20"></div>
           </div>
        ) : (
          <p className="font-light italic leading-relaxed text-sm opacity-80">
            "{insight}"
          </p>
        )}
      </div>

      <div className="space-y-12 relative">
        <div className="absolute top-2 bottom-2 left-[7px] w-[1px] opacity-10" style={{ backgroundColor: theme.text }}></div>
        
        {last7DaysEntries.length > 0 ? last7DaysEntries.map((entry) => (
          <div key={entry.date} className="relative pl-10 group">
            <div className="absolute top-2 left-0 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 scale-100 group-hover:scale-125 group-hover:shadow-md" style={{ borderColor: theme.bg, backgroundColor: theme.primary }}></div>
            <div className="mb-2">
              <span className="text-[10px] font-bold tracking-widest opacity-30">
                {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            {entry.question && (
              <p className="text-xs italic mb-2 line-clamp-1 opacity-30">{entry.question}</p>
            )}
            <p className="font-light leading-relaxed text-base" style={{ color: theme.text }}>{entry.text}</p>
          </div>
        )) : (
          <div className="text-center py-20 opacity-30 italic font-serif">
            Quiet moments... keep writing to see your history.
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySummary;
