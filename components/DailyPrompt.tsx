
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { generateDailyQuestion } from '../services/geminiService';

interface DailyPromptProps {
  existingEntry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  theme: any;
}

const DailyPrompt: React.FC<DailyPromptProps> = ({ existingEntry, onSave, theme }) => {
  const [text, setText] = useState(existingEntry?.text || '');
  const [question, setQuestion] = useState(existingEntry?.question || '');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isGuided, setIsGuided] = useState(!existingEntry || !!existingEntry.question);

  useEffect(() => {
    if (isGuided && !question && !existingEntry?.question) {
      fetchQuestion();
    }
  }, [isGuided, lang]);

  const fetchQuestion = async () => {
    setLoadingQuestion(true);
    const q = await generateDailyQuestion(lang);
    setQuestion(q);
    setLoadingQuestion(false);
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    if (!text.trim()) return;
    setIsSaving(true);
    onSave({
      date: today,
      text: text.trim(),
      question: isGuided ? question : '',
      timestamp: existingEntry?.timestamp || Date.now()
    });
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center animate-fadeIn relative">
      <div className="mb-6 flex gap-2 p-1 rounded-2xl" style={{ backgroundColor: theme.border + '30' }}>
        <button 
          onClick={() => setIsGuided(true)}
          className={`px-5 py-2 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${isGuided ? 'shadow-sm' : 'opacity-30'}`}
          style={{ backgroundColor: isGuided ? theme.primary : 'transparent', color: isGuided ? '#fff' : theme.text }}
        >
          Guided
        </button>
        <button 
          onClick={() => setIsGuided(false)}
          className={`px-5 py-2 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${!isGuided ? 'shadow-sm' : 'opacity-30'}`}
          style={{ backgroundColor: !isGuided ? theme.primary : 'transparent', color: !isGuided ? '#fff' : theme.text }}
        >
          Free
        </button>
      </div>

      <div className="mb-14 transition-all duration-500 min-h-[140px] flex flex-col justify-center items-center">
        <div className="flex items-center gap-3 mb-4 opacity-40">
           <span className="text-[10px] tracking-[0.2em] uppercase">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          {isGuided && !existingEntry && (
             <button 
              onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="text-[9px] px-2 py-0.5 border rounded-full hover:opacity-100 transition-opacity"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
          )}
        </div>
        
        {isGuided ? (
          <h2 className={`text-2xl font-serif leading-relaxed px-6 transition-all duration-700 ${lang === 'ar' ? 'rtl font-sans' : ''}`} style={{ color: theme.text }}>
            {loadingQuestion ? (
              <span className="opacity-30 animate-pulse italic">Thinking...</span>
            ) : (
              question
            )}
          </h2>
        ) : (
          <h2 className="text-2xl font-serif leading-relaxed px-6 italic opacity-60" style={{ color: theme.text }}>
            Empty your heart on this line.
          </h2>
        )}
      </div>

      <div className="w-full relative px-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isGuided ? (lang === 'ar' ? "سطر واحد يكفي..." : "One line is enough...") : "..."}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className={`w-full bg-transparent border-b-2 py-6 text-center text-xl focus:outline-none transition-all resize-none h-48 font-light leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-center'}`}
          style={{ 
            borderColor: text.trim() ? theme.primary : theme.border + '50',
            color: theme.text
          }}
          maxLength={300}
        />
        <div className="mt-4 text-[10px] flex justify-between px-2 opacity-30">
          <span>{text.length}/300</span>
          <span>Slow, quiet, honest</span>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || !text.trim()}
        className="mt-14 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl hover:scale-110 active:scale-95 group relative"
        style={{ 
          backgroundColor: text.trim() ? theme.primary : theme.border,
          color: '#fff',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        {isSaving ? (
           <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </button>

      {existingEntry && (
        <div className="mt-6 flex items-center gap-2 text-[10px] font-medium opacity-60 italic" style={{ color: theme.primary }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.001-5.5z" clipRule="evenodd" />
          </svg>
          Captured for today
        </div>
      )}
    </div>
  );
};

export default DailyPrompt;
