
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Camera, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUploader from './ImageUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types for journal entries
interface JournalEntry {
  id: string;
  date: Date;
  image: string;
  notes: string;
  products: string[];
  concerns: string[];
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

interface ProgressData {
  date: string;
  acne: number;
  redness: number;
  hydration: number;
  overall: number;
}

// Initialize progress data
const generateProgressData = (journalEntries: JournalEntry[]): ProgressData[] => {
  const sortedEntries = [...journalEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return sortedEntries.map((entry, index) => {
    // Generate progress metrics based on journal entries
    // This is simplified for demo purposes - in a real app, this would be more sophisticated
    const hasDryness = entry.concerns.includes('dryness');
    const hasAcne = entry.concerns.includes('acne');
    const hasRedness = entry.concerns.includes('redness');
    
    // Start with base values (if this is the first entry) or use the previous entry's values
    const baseAcne = index === 0 ? 70 : progressData[index - 1].acne;
    const baseRedness = index === 0 ? 45 : progressData[index - 1].redness;
    const baseHydration = index === 0 ? 30 : progressData[index - 1].hydration;
    
    // Adjust based on concerns
    const acne = hasAcne ? baseAcne : Math.max(baseAcne - 10, 0);
    const redness = hasRedness ? baseRedness : Math.max(baseRedness - 5, 0);
    const hydration = hasDryness ? baseHydration : Math.min(baseHydration + 10, 100);
    
    // Calculate overall score (inverse of problems, higher is better)
    const overall = Math.min(100 - (acne + redness) / 3 + hydration / 3, 100);
    
    return {
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      acne,
      redness,
      hydration,
      overall,
    };
  });
};

// Initialize with data derived from journal entries
let progressData: ProgressData[] = [];

const customTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium text-foreground mb-2">{payload[0].payload.date}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`metric-${index}`} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value}/100</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressTracker: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [newEntryImage, setNewEntryImage] = useState<string | null>(null);
  const [newEntryNotes, setNewEntryNotes] = useState('');
  const [newEntryProduct, setNewEntryProduct] = useState('');
  const [newEntryProducts, setNewEntryProducts] = useState<string[]>([]);
  const [newEntryConcerns, setNewEntryConcerns] = useState<string[]>([]);
  const [formattedData, setFormattedData] = useState<ProgressData[]>([]);
  
  // Load saved journal entries from localStorage on component mount
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
    progressData = updatedProgressData;
  }, [journalEntries]);
  
  const entriesForSelectedDate = journalEntries.filter(
    (entry) => date && entry.date.toDateString() === date.toDateString()
  );
  
  const handleImageSelected = (imageData: string) => {
    setNewEntryImage(imageData);
  };
  
  const handleAddProduct = () => {
    if (newEntryProduct.trim()) {
      setNewEntryProducts([...newEntryProducts, newEntryProduct.trim()]);
      setNewEntryProduct('');
    }
  };
  
  const handleRemoveProduct = (index: number) => {
    setNewEntryProducts(newEntryProducts.filter((_, i) => i !== index));
  };
  
  const handleToggleConcern = (concern: string) => {
    if (newEntryConcerns.includes(concern)) {
      setNewEntryConcerns(newEntryConcerns.filter(c => c !== concern));
    } else {
      setNewEntryConcerns([...newEntryConcerns, concern]);
    }
  };
  
  const handleSaveEntry = () => {
    if (!newEntryImage) {
      toast.error('Please upload an image for your journal entry');
      return;
    }
    
    if (!newEntryNotes.trim()) {
      toast.error('Please add some notes about your skin condition');
      return;
    }
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: date || new Date(),
      image: newEntryImage,
      notes: newEntryNotes,
      products: newEntryProducts,
      concerns: newEntryConcerns,
    };
    
    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    // Clear form
    setNewEntryImage(null);
    setNewEntryNotes('');
    setNewEntryProducts([]);
    setNewEntryConcerns([]);
    setShowAddEntryDialog(false);
    
    toast.success('Journal entry added successfully');
  };
  
  const calculateImprovements = () => {
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
  
  const improvements = calculateImprovements();
  
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
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formattedData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => `${value}`} 
                        label={{ 
                          value: 'Score', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fontSize: '12px', textAnchor: 'middle' }
                        }} 
                      />
                      <Tooltip content={customTooltip} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="overall" 
                        stroke="#8B5CF6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }}
                        name="Overall Skin Health"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="acne" 
                        stroke="#F97316" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Acne Severity" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="redness" 
                        stroke="#EF4444" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Redness" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hydration" 
                        stroke="#0EA5E9" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Hydration" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No progress data available yet.</p>
                    <Button onClick={() => setShowAddEntryDialog(true)}>Add First Journal Entry</Button>
                  </div>
                </div>
              )}
              
              {improvements && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="p-3 border border-border/50">
                    <div className="text-sm text-muted-foreground">Acne Improvement</div>
                    <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                      <span>{improvements.acne}%</span>
                      <span className={`text-xs ${improvements.acne >= 0 ? "text-green-600" : "text-red-600"} font-normal mb-1`}>
                        {improvements.acne >= 0 ? "▲" : "▼"}
                      </span>
                    </div>
                  </Card>
                  <Card className="p-3 border border-border/50">
                    <div className="text-sm text-muted-foreground">Redness Reduction</div>
                    <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                      <span>{improvements.redness}%</span>
                      <span className={`text-xs ${improvements.redness >= 0 ? "text-green-600" : "text-red-600"} font-normal mb-1`}>
                        {improvements.redness >= 0 ? "▲" : "▼"}
                      </span>
                    </div>
                  </Card>
                  <Card className="p-3 border border-border/50">
                    <div className="text-sm text-muted-foreground">Hydration Increase</div>
                    <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                      <span>{improvements.hydration}%</span>
                      <span className={`text-xs ${improvements.hydration >= 0 ? "text-green-600" : "text-red-600"} font-normal mb-1`}>
                        {improvements.hydration >= 0 ? "▲" : "▼"}
                      </span>
                    </div>
                  </Card>
                  <Card className="p-3 border border-border/50">
                    <div className="text-sm text-muted-foreground">Overall Improvement</div>
                    <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                      <span>{improvements.overall}%</span>
                      <span className={`text-xs ${improvements.overall >= 0 ? "text-green-600" : "text-red-600"} font-normal mb-1`}>
                        {improvements.overall >= 0 ? "▲" : "▼"}
                      </span>
                    </div>
                  </Card>
                </div>
              )}
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
                {entriesForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {entriesForSelectedDate.map((entry) => (
                      <div 
                        key={entry.id}
                        className={cn(
                          "p-4 border rounded-lg transition-all duration-300",
                          selectedEntry === entry.id 
                            ? "border-primary/50 bg-accent/30" 
                            : "border-border/50 hover:border-border"
                        )}
                        onClick={() => setSelectedEntry(
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
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-border/50">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No entries for this date</h3>
                    <p className="text-muted-foreground mb-4">
                      Create a new journal entry to track your skincare progress
                    </p>
                    <Button className="gap-1.5" onClick={() => setShowAddEntryDialog(true)}>
                      <Plus className="w-4 h-4" />
                      New Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Entry Dialog */}
      <Dialog open={showAddEntryDialog} onOpenChange={setShowAddEntryDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Journal Entry</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image">Skin Photo</Label>
              {newEntryImage ? (
                <div className="relative aspect-square max-h-[200px] rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={newEntryImage}
                    alt="Uploaded skin"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 rounded-full bg-white/80 shadow-sm hover:bg-white h-8 w-8"
                    onClick={() => setNewEntryImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ImageUploader
                  onImageSelected={handleImageSelected}
                  className="h-[150px]"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newEntryNotes}
                onChange={(e) => setNewEntryNotes(e.target.value)}
                placeholder="How does your skin look and feel today?"
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Skin Concerns</Label>
              <div className="flex flex-wrap gap-2">
                {['acne', 'redness', 'dryness', 'oiliness', 'texture', 'hyperpigmentation', 'aging'].map((concern) => (
                  <Badge
                    key={concern}
                    variant={newEntryConcerns.includes(concern) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleConcern(concern)}
                  >
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="products">Products Used</Label>
              <div className="flex space-x-2">
                <Input
                  id="products"
                  value={newEntryProduct}
                  onChange={(e) => setNewEntryProduct(e.target.value)}
                  placeholder="Product name"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddProduct}>Add</Button>
              </div>
              
              {newEntryProducts.length > 0 && (
                <div className="mt-2">
                  <ul className="space-y-1">
                    {newEntryProducts.map((product, index) => (
                      <li key={index} className="flex justify-between items-center text-sm p-2 border rounded-md">
                        <span>{product}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEntryDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEntry}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTracker;
