
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
}

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

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
  );
};

export default ProgressChart;
