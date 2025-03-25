
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalCalendarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  journalEntries: JournalEntry[];
}

const JournalCalendar: React.FC<JournalCalendarProps> = ({ 
  date, 
  onSelectDate,
  journalEntries 
}) => {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={onSelectDate}
      className="rounded-md border"
      modifiers={{
        hasEntry: (date) => 
          journalEntries.some(
            entry => entry.date.toDateString() === date.toDateString()
          )
      }}
      modifiersStyles={{
        hasEntry: { 
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fontWeight: 'bold',
          borderRadius: '50%' 
        }
      }}
    />
  );
};

export default JournalCalendar;
