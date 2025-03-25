
import React from 'react';
import { Card } from '@/components/ui/card';

interface Improvements {
  acne: number;
  redness: number;
  hydration: number;
  overall: number;
}

interface ProgressStatsProps {
  improvements: Improvements;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ improvements }) => {
  return (
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
  );
};

export default ProgressStats;
