
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
  const [activeTab, setActiveTab] = useState<string>("journal"); // Default to journal tab
  
  const { 
    journalEntries, 
    formattedData, 
    entriesForDate, 
    addJournalEntry, 
    improvements 
  } = useJournalEntries(date);
  
  // Show prompt to add entry if no entries exist
  useEffect(() => {
    if (journalEntries.length === 0) {
      toast("Start your skin journey by adding your first journal entry", {
        action: {
          label: "Add Entry",
          onClick: () => setShowAddEntryDialog(true),
        },
      });
    }
  }, [journalEntries.length]);
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="journal" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="journal">Skin Journal</TabsTrigger>
          <TabsTrigger value="progress">Progress Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card h-auto animate-fade-in col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Track Your Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <JournalCalendar 
                  date={date}
                  onSelectDate={setDate}
                  journalEntries={journalEntries}
                />
                
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setShowAddEntryDialog(true)}
                >
                  <Camera className="w-4 h-4" />
                  <span>Add Today's Entry</span>
                </Button>

                {improvements && journalEntries.length > 1 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Overall Progress</h3>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("progress")}
                    >
                      View Progress Charts
                    </Button>
                  </div>
                )}
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
        
        <TabsContent value="progress">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-medium flex justify-between items-center">
                <span>Skin Condition Progress</span>
                {journalEntries.length < 2 && (
                  <Button size="sm" onClick={() => setShowAddEntryDialog(true)}>
                    Add More Entries
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formattedData.length > 1 ? (
                <>
                  <ProgressChart data={formattedData} />
                  {improvements && <ProgressStats improvements={improvements} />}
                </>
              ) : (
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      {formattedData.length === 0 
                        ? "No progress data available yet." 
                        : "Add more journal entries to see your progress charted over time."}
                    </p>
                    <Button onClick={() => setShowAddEntryDialog(true)}>
                      {formattedData.length === 0 ? "Add First Journal Entry" : "Add Another Entry"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Understanding Your Progress Chart</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Lower values</strong> for Acne and Redness indicate improvement (less severity)</p>
                  <p>• <strong>Higher values</strong> for Hydration show better moisture retention</p>
                  <p>• Your <strong>Overall Skin Health</strong> score combines all factors</p>
                  <p>• Track more accurately by adding regular journal entries with consistent photos</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
