
import React from 'react';
import { AnalysisResult } from '@/utils/skinAnalysis/types';
import ConditionCard from './ConditionCard';
import AdvancedDetectionCard from './AdvancedDetectionCard';

interface ConditionsTabProps {
  results: AnalysisResult;
}

const ConditionsTab: React.FC<ConditionsTabProps> = ({ results }) => {
  const { conditions = [], usedAdvancedModels = false, detectedObjects = [] } = results;
  
  // Get the conditions sorted by confidence
  const sortedConditions = [...conditions].sort((a, b) => b.confidence - a.confidence);
  
  return (
    <div className="space-y-4">
      {sortedConditions.map((condition, index) => (
        <ConditionCard key={index} condition={condition} />
      ))}
      
      {/* Display advanced model results if available */}
      {usedAdvancedModels && detectedObjects && detectedObjects.length > 0 && (
        <AdvancedDetectionCard detectedObjects={detectedObjects} />
      )}
    </div>
  );
};

export default ConditionsTab;
