
import { useState, useEffect } from 'react';

// Types for journal entries
export interface JournalEntry {
  id: string;
  date: Date;
  image: string;
  notes: string;
  products: string[];
  concerns: string[];
  metrics?: {
    acne: number;
    redness: number;
    hydration: number;
    overall: number;
  };
}

interface ProgressData {
  date: string;
  acne: number;
  redness: number;
  hydration: number;
  overall: number;
}

interface Improvements {
  acne: number;
  redness: number;
  hydration: number;
  overall: number;
}

// Calculate metrics based on concerns
const calculateMetrics = (concerns: string[]) => {
  const hasDryness = concerns.includes('dryness');
  const hasAcne = concerns.includes('acne');
  const hasRedness = concerns.includes('redness');
  const hasOiliness = concerns.includes('oiliness');
  
  // Base values (higher is worse for acne and redness, lower is worse for hydration)
  let acne = hasAcne ? 70 : 30;
  let redness = hasRedness ? 60 : 25;
  let hydration = hasDryness ? 30 : 70;
  
  // Adjust for oiliness
  if (hasOiliness) {
    acne += 15;
    hydration += 10;
  }
  
  // Limit to 0-100 range
  acne = Math.min(Math.max(acne, 0), 100);
  redness = Math.min(Math.max(redness, 0), 100);
  hydration = Math.min(Math.max(hydration, 0), 100);
  
  // Overall score (inverse of problems, higher is better)
  const overall = Math.min(100 - (acne + redness) / 4 + hydration / 3, 100);
  
  return {
    acne,
    redness,
    hydration,
    overall: Math.round(overall)
  };
};

// Generate progress data directly from journal entries
const generateProgressData = (journalEntries: JournalEntry[]): ProgressData[] => {
  // Sort entries by date
  const sortedEntries = [...journalEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Map each entry to progress data
  return sortedEntries.map(entry => {
    // Use existing metrics if available, otherwise calculate
    const metrics = entry.metrics || calculateMetrics(entry.concerns);
    
    return {
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...metrics
    };
  });
};

// Calculate improvements from first to last entry
const calculateImprovements = (formattedData: ProgressData[]): Improvements | null => {
  if (formattedData.length < 2) return null;
  
  const first = formattedData[0];
  const last = formattedData[formattedData.length - 1];
  
  return {
    // For acne and redness, improvement means reduction (so we want positive percentages)
    acne: Math.round(((first.acne - last.acne) / first.acne) * 100),
    redness: Math.round(((first.redness - last.redness) / first.redness) * 100),
    // For hydration, improvement means increase
    hydration: Math.round(((last.hydration - first.hydration) / first.hydration) * 100),
    // For overall, improvement means increase
    overall: Math.round(((last.overall - first.overall) / first.overall) * 100)
  };
};

// Current date-based entry
const generateCurrentDateEntry = (): JournalEntry => {
  const now = new Date();
  return {
    id: 'today',
    date: now,
    image: 'https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?q=80&w=200&auto=format&fit=crop',
    notes: 'Initial assessment. Starting my skincare journey today!',
    products: ['Gentle Cleanser', 'Basic Moisturizer'],
    concerns: ['dryness'],
    metrics: {
      acne: 40,
      redness: 35,
      hydration: 45,
      overall: 60
    }
  };
};

// Initial journal entries with metrics
const initialJournalEntries: JournalEntry[] = [
  generateCurrentDateEntry()
];

export const useJournalEntries = (date?: Date) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [formattedData, setFormattedData] = useState<ProgressData[]>([]);
  
  // Load saved journal entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      // Convert date strings back to Date objects
      const entriesWithDates = parsedEntries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setJournalEntries(entriesWithDates);
    } else {
      // Use initial mock data if no saved entries
      setJournalEntries(initialJournalEntries);
    }
  }, []);
  
  // Update progress data when journal entries change
  useEffect(() => {
    const updatedProgressData = generateProgressData(journalEntries);
    setFormattedData(updatedProgressData);
  }, [journalEntries]);
  
  // Filter entries for selected date
  const entriesForDate = date 
    ? journalEntries.filter(entry => entry.date.toDateString() === date.toDateString())
    : [];
  
  // Add a new journal entry
  const addJournalEntry = (newEntry: Omit<JournalEntry, 'id' | 'metrics'>) => {
    // Calculate metrics based on concerns
    const metrics = calculateMetrics(newEntry.concerns);
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      ...newEntry,
      metrics
    };
    
    const updatedEntries = [...journalEntries, entry];
    setJournalEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    return entry.id;
  };
  
  // Calculate improvements from first to last entry
  const improvements = calculateImprovements(formattedData);
  
  return {
    journalEntries,
    formattedData,
    entriesForDate,
    addJournalEntry,
    improvements
  };
};
