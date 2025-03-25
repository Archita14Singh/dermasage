
import { useState, useEffect } from 'react';

// Types for journal entries
export interface JournalEntry {
  id: string;
  date: Date;
  image: string;
  notes: string;
  products: string[];
  concerns: string[];
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

// Mock data for initial display
const initialJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date('2023-11-12'),
    image: 'https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?q=80&w=200&auto=format&fit=crop',
    notes: 'Skin is looking clearer today. The new moisturizer seems to be helping with hydration.',
    products: ['Gentle Cleanser', 'Hyaluronic Acid Serum', 'Moisturizer SPF 30'],
    concerns: ['dryness', 'redness'],
  },
  {
    id: '2',
    date: new Date('2023-11-05'),
    image: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=200&auto=format&fit=crop',
    notes: 'Had a breakout around chin area. Might be stress-related.',
    products: ['Gentle Cleanser', 'Salicylic Acid Treatment', 'Oil-free Moisturizer'],
    concerns: ['acne', 'oiliness'],
  },
  {
    id: '3',
    date: new Date('2023-10-29'),
    image: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=200&auto=format&fit=crop',
    notes: 'Noticing some improvement in texture. Still have some redness around nose.',
    products: ['Gentle Cleanser', 'Niacinamide Serum', 'Moisturizer SPF 30'],
    concerns: ['texture', 'redness'],
  },
];

// Generate progress data from journal entries
const generateProgressData = (journalEntries: JournalEntry[]): ProgressData[] => {
  const sortedEntries = [...journalEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
  let progressData: ProgressData[] = [];
  
  return sortedEntries.map((entry, index) => {
    // Generate progress metrics based on journal entries
    const hasDryness = entry.concerns.includes('dryness');
    const hasAcne = entry.concerns.includes('acne');
    const hasRedness = entry.concerns.includes('redness');
    
    // Start with base values or use the previous entry's values
    const baseAcne = index === 0 ? 70 : progressData[index - 1]?.acne || 70;
    const baseRedness = index === 0 ? 45 : progressData[index - 1]?.redness || 45;
    const baseHydration = index === 0 ? 30 : progressData[index - 1]?.hydration || 30;
    
    // Adjust based on concerns
    const acne = hasAcne ? baseAcne : Math.max(baseAcne - 10, 0);
    const redness = hasRedness ? baseRedness : Math.max(baseRedness - 5, 0);
    const hydration = hasDryness ? baseHydration : Math.min(baseHydration + 10, 100);
    
    // Calculate overall score (inverse of problems, higher is better)
    const overall = Math.min(100 - (acne + redness) / 3 + hydration / 3, 100);
    
    const data = {
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      acne,
      redness,
      hydration,
      overall,
    };
    
    progressData.push(data);
    return data;
  });
};

// Calculate improvements from first to last entry
const calculateImprovements = (formattedData: ProgressData[]): Improvements | null => {
  if (formattedData.length < 2) return null;
  
  const first = formattedData[0];
  const last = formattedData[formattedData.length - 1];
  
  return {
    acne: Math.round(((first.acne - last.acne) / first.acne) * 100),
    redness: Math.round(((first.redness - last.redness) / first.redness) * 100),
    hydration: Math.round(((last.hydration - first.hydration) / first.hydration) * 100),
    overall: Math.round(((last.overall - first.overall) / first.overall) * 100)
  };
};

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
  const addJournalEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      ...newEntry
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
