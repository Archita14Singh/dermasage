
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Camera, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProgressChart from './progress/ProgressChart';
import ProgressStats from './progress/ProgressStats';
import JournalCalendar from './progress/JournalCalendar';
import JournalEntryList from './progress/JournalEntryList';
import AddEntryDialog from './progress/AddEntryDialog';
import { useJournalEntries } from '@/hooks/useJournalEntries';

const ProgressTracker: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  
  const { 
    journalEntries, 
    formattedData, 
    entriesForDate, 
    addJournalEntry, 
    improvements 
  } = useJournalEntries(date);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="journal">Skin Journal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Skin Condition Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {formattedData.length > 0 ? (
                <ProgressChart data={formattedData} />
              ) : (
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No progress data available yet.</p>
                    <Button onClick={() => setShowAddEntryDialog(true)}>Add First Journal Entry</Button>
                  </div>
                </div>
              )}
              
              {improvements && <ProgressStats improvements={improvements} />}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card h-auto animate-fade-in col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <JournalCalendar 
                  date={date}
                  onSelectDate={setDate}
                  journalEntries={journalEntries}
                />
                
                <div className="mt-4">
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => setShowAddEntryDialog(true)}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add New Entry</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card h-auto animate-fade-in col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {date ? (
                    <span>
                      Entries for {date.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  ) : 'Skin Journal'}
                </CardTitle>
                
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      if (date) {
                        const newDate = new Date(date);
                        newDate.setDate(date.getDate() - 1);
                        setDate(newDate);
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      if (date) {
                        const newDate = new Date(date);
                        newDate.setDate(date.getDate() + 1);
                        setDate(newDate);
                      }
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <JournalEntryList 
                  entries={entriesForDate} 
                  selectedEntry={selectedEntry}
                  onSelectEntry={setSelectedEntry}
                  onAddEntry={() => setShowAddEntryDialog(true)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <AddEntryDialog
        open={showAddEntryDialog}
        onOpenChange={setShowAddEntryDialog}
        onSave={addJournalEntry}
        currentDate={date || new Date()}
      />
    </div>
  );
};

export default ProgressTracker;
