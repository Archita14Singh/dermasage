
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnalysisResult } from '@/utils/skinAnalysis/types';
import SeverityBadge from './SeverityBadge';
import EnvironmentalFactorItem from './EnvironmentalFactorItem';

interface SummaryTabProps {
  results: AnalysisResult;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ results }) => {
  const { skinType, overall, conditions = [], usedAdvancedModels = false, environmentalFactors = [] } = results;
  
  // Get the top conditions sorted by confidence
  const sortedConditions = [...conditions].sort((a, b) => b.confidence - a.confidence);
  
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Skin Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className="px-3 py-1 capitalize">{skinType}</Badge>
            {usedAdvancedModels && (
              <Badge variant="outline" className="bg-skin-purple/10 text-skin-purple">
                Advanced Analysis
              </Badge>
            )}
          </div>
          <CardDescription className="mt-3">{overall}</CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Concerns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedConditions.slice(0, 3).map((condition, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{condition.condition}</span>
                <SeverityBadge severity={condition.severity} />
              </div>
              <Progress value={condition.confidence * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Environmental Factors */}
      {environmentalFactors.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Environmental Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {environmentalFactors.map((factor, index) => (
              <EnvironmentalFactorItem key={index} factor={factor} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryTab;
