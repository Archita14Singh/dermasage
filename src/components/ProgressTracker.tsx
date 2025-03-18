
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Camera, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const mockProgressData = [
  { date: '2023-10-01', acne: 70, redness: 45, hydration: 30, overall: 40 },
  { date: '2023-10-08', acne: 65, redness: 40, hydration: 35, overall: 45 },
  { date: '2023-10-15', acne: 60, redness: 35, hydration: 45, overall: 50 },
  { date: '2023-10-22', acne: 55, redness: 30, hydration: 50, overall: 55 },
  { date: '2023-10-29', acne: 45, redness: 25, hydration: 60, overall: 65 },
  { date: '2023-11-05', acne: 40, redness: 20, hydration: 65, overall: 70 },
  { date: '2023-11-12', acne: 30, redness: 15, hydration: 75, overall: 80 },
];

const formattedData = mockProgressData.map((entry) => ({
  ...entry,
  date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
}));

const skinJournalEntries = [
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
  
  const entriesForSelectedDate = skinJournalEntries.filter(
    (entry) => date && entry.date.toDateString() === date.toDateString()
  );
  
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
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-3 border border-border/50">
                  <div className="text-sm text-muted-foreground">Acne Improvement</div>
                  <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                    <span>57%</span>
                    <span className="text-xs text-green-600 font-normal mb-1">▲</span>
                  </div>
                </Card>
                <Card className="p-3 border border-border/50">
                  <div className="text-sm text-muted-foreground">Redness Reduction</div>
                  <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                    <span>67%</span>
                    <span className="text-xs text-green-600 font-normal mb-1">▲</span>
                  </div>
                </Card>
                <Card className="p-3 border border-border/50">
                  <div className="text-sm text-muted-foreground">Hydration Increase</div>
                  <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                    <span>150%</span>
                    <span className="text-xs text-green-600 font-normal mb-1">▲</span>
                  </div>
                </Card>
                <Card className="p-3 border border-border/50">
                  <div className="text-sm text-muted-foreground">Overall Improvement</div>
                  <div className="text-2xl font-medium mt-1 flex items-end gap-1">
                    <span>100%</span>
                    <span className="text-xs text-green-600 font-normal mb-1">▲</span>
                  </div>
                </Card>
              </div>
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
                      skinJournalEntries.some(
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
                              <div className="flex gap-1.5">
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
                    <Button className="gap-1.5">
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
    </div>
  );
};

export default ProgressTracker;
