
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProgressData {
  date: string;
  acne: number;
  redness: number;
  hydration: number;
  overall: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  startFromToday?: boolean;
  minDays?: number;
}

const customTooltip = ({ active, payload, label }: any) => {
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

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  startFromToday = true, 
  minDays = 7 
}) => {
  // Don't render if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // If startFromToday is true, generate placeholder data starting from today
  let chartData = [...data];

  if (startFromToday && data.length < minDays) {
    // Generate dates starting from today and moving forward
    const today = new Date();
    const existingDates = new Set(data.map(item => item.date));

    // Add empty placeholders for the next 7 days if needed
    for (let i = 0; i < minDays; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Only add if this date doesn't already exist in the data
      if (!existingDates.has(dateStr)) {
        // Add empty placeholder for future dates
        chartData.push({
          date: dateStr,
          acne: undefined as any,
          redness: undefined as any,
          hydration: undefined as any,
          overall: undefined as any
        });
      }
    }
    
    // Sort by date
    chartData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
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
            connectNulls
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }}
            name="Overall Skin Health"
          />
          <Line 
            type="monotone" 
            dataKey="acne" 
            stroke="#F97316" 
            strokeWidth={2}
            connectNulls 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
            name="Acne Severity" 
          />
          <Line 
            type="monotone" 
            dataKey="redness" 
            stroke="#EF4444" 
            strokeWidth={2} 
            connectNulls
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
            name="Redness" 
          />
          <Line 
            type="monotone" 
            dataKey="hydration" 
            stroke="#0EA5E9" 
            strokeWidth={2} 
            connectNulls
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
            name="Hydration" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
