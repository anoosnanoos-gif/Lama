
export interface JournalEntry {
  date: string; // YYYY-MM-DD
  text: string;
  question: string;
  timestamp: number;
}

export interface AppState {
  entries: Record<string, JournalEntry>;
  pin: string | null;
  isLocked: boolean;
}

export enum ViewMode {
  DAILY = 'daily',
  CALENDAR = 'calendar',
  SUMMARY = 'summary'
}
