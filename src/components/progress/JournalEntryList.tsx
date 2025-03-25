
import React from 'react';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalEntryListProps {
  entries: JournalEntry[];
  selectedEntry: string | null;
  onSelectEntry: (id: string | null) => void;
  onAddEntry: () => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ 
  entries, 
  selectedEntry, 
  onSelectEntry,
  onAddEntry
}) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-border/50">
        <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No entries for this date</h3>
        <p className="text-muted-foreground mb-4">
          Create a new journal entry to track your skincare progress
        </p>
        <Button className="gap-1.5" onClick={onAddEntry}>
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div 
          key={entry.id}
          className={cn(
            "p-4 border rounded-lg transition-all duration-300",
            selectedEntry === entry.id 
              ? "border-primary/50 bg-accent/30" 
              : "border-border/50 hover:border-border"
          )}
          onClick={() => onSelectEntry(
            selectedEntry === entry.id ? null : entry.id
          )}
        >
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={entry.image} 
                alt="Skin" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">
                  {entry.date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric'
                  })}
                </h4>
                <div className="flex gap-1.5 flex-wrap">
                  {entry.concerns.map((concern) => (
                    <Badge key={concern} variant="outline" className="text-xs">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {entry.notes}
              </p>
              
              {selectedEntry === entry.id && (
                <div className="mt-3 pt-3 border-t border-border/50 animate-fade-in">
                  <h5 className="text-sm font-medium mb-1.5">Products Used:</h5>
                  <ul className="text-sm space-y-1">
                    {entry.products.map((product, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-1.5">•</span>
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalEntryList;
