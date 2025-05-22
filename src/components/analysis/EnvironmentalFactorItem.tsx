
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Droplets, ThermometerSun, CloudRain, Wind } from 'lucide-react';
import { EnvironmentalFactor } from '@/utils/skinAnalysis/types';

interface EnvironmentalFactorItemProps {
  factor: EnvironmentalFactor;
}

const EnvironmentalFactorItem: React.FC<EnvironmentalFactorItemProps> = ({ factor }) => {
  // Generate icon for environmental factor
  const getEnvironmentalIcon = (factorName: string) => {
    if (factorName.toLowerCase().includes('humid')) return <Droplets className="h-5 w-5 text-blue-500" />;
    if (factorName.toLowerCase().includes('uv')) return <ThermometerSun className="h-5 w-5 text-amber-500" />;
    if (factorName.toLowerCase().includes('pollut')) return <Wind className="h-5 w-5 text-slate-500" />;
    return <CloudRain className="h-5 w-5 text-indigo-500" />;
  };
  
  // Get impact color for environmental factors
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {getEnvironmentalIcon(factor.factor)}
        <span>{factor.factor}</span>
      </div>
      <Badge 
        variant="outline" 
        className={`${getImpactColor(factor.impact)} border-current`}
      >
        {factor.impact} impact
      </Badge>
    </div>
  );
};

export default EnvironmentalFactorItem;
