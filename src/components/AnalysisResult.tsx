
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SkinCondition {
  condition: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

interface AnalysisResultProps {
  results: {
    conditions: SkinCondition[];
    overall: string;
    skinType: string;
  };
}

const severityColorMap: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

const conditionColorMap: Record<string, string> = {
  'Acne': 'bg-skin-purple/15 text-accent-foreground',
  'Dryness': 'bg-skin-peach/20 text-orange-700',
  'Oiliness': 'bg-skin-blue/20 text-blue-700',
  'Redness': 'bg-skin-pink/20 text-rose-700',
  'Hyperpigmentation': 'bg-amber-100 text-amber-700',
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Analysis Results</h3>
          <Badge variant="outline" className="bg-skin-light/50">
            {results.skinType}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {results.overall}
        </p>
      </div>
      
      <div className="space-y-4">
        {results.conditions.map((condition) => (
          <Card key={condition.condition} className="overflow-hidden border border-border/50 shadow-sm animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Badge className={cn('mr-2', conditionColorMap[condition.condition] || 'bg-secondary')}>
                    {condition.condition}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn(severityColorMap[condition.severity], 'font-normal')}
                  >
                    {condition.severity}
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  {Math.round(condition.confidence * 100)}%
                </span>
              </div>
              
              <Progress 
                value={condition.confidence * 100} 
                className={cn(
                  "h-2 mb-3",
                  condition.severity === 'high' ? 'bg-rose-100' : 
                  condition.severity === 'moderate' ? 'bg-amber-100' : 'bg-green-100'
                )}
              />
              
              <div className="mt-3 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Recommendations:</h4>
                <ul className="space-y-1.5">
                  {condition.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <ChevronRight className="h-3 w-3 mr-1.5 mt-1 text-primary flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResult;
