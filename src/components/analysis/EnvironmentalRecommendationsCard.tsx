
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnvironmentalFactor } from '@/utils/skinAnalysis/types';
import { Droplets, ThermometerSun, CloudRain, Wind } from 'lucide-react';

interface EnvironmentalRecommendationsCardProps {
  factors: EnvironmentalFactor[];
}

const EnvironmentalRecommendationsCard: React.FC<EnvironmentalRecommendationsCardProps> = ({ factors }) => {
  // Generate icon for environmental factor
  const getEnvironmentalIcon = (factorName: string) => {
    if (factorName.toLowerCase().includes('humid')) return <Droplets className="h-5 w-5 text-blue-500" />;
    if (factorName.toLowerCase().includes('uv')) return <ThermometerSun className="h-5 w-5 text-amber-500" />;
    if (factorName.toLowerCase().includes('pollut')) return <Wind className="h-5 w-5 text-slate-500" />;
    return <CloudRain className="h-5 w-5 text-indigo-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Environmental Protection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {factors.map((factor, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              {getEnvironmentalIcon(factor.factor)}
              <span className="font-medium">{factor.factor}</span>
            </div>
            <ul className="space-y-1 list-disc pl-8">
              {factor.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EnvironmentalRecommendationsCard;
