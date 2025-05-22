
import React from 'react';
import { AnalysisResult } from '@/utils/skinAnalysis/types';
import RecommendationCard from './RecommendationCard';
import EnvironmentalRecommendationsCard from './EnvironmentalRecommendationsCard';

interface RecommendationsTabProps {
  results: AnalysisResult;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ results }) => {
  const { conditions = [], environmentalFactors = [] } = results;
  
  // Get the conditions sorted by confidence
  const sortedConditions = [...conditions].sort((a, b) => b.confidence - a.confidence);
  
  return (
    <div className="space-y-4">
      {sortedConditions.map((condition, index) => (
        <RecommendationCard 
          key={index} 
          title={`For ${condition.condition}`} 
          recommendations={condition.recommendations}
        />
      ))}
      
      {/* Environmental recommendations */}
      {environmentalFactors && environmentalFactors.length > 0 && (
        <EnvironmentalRecommendationsCard factors={environmentalFactors} />
      )}
    </div>
  );
};

export default RecommendationsTab;
