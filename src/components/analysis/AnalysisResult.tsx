
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult as AnalysisResultType } from '@/utils/skinAnalysis/types';
import SummaryTab from './SummaryTab';
import ConditionsTab from './ConditionsTab';
import RecommendationsTab from './RecommendationsTab';

interface AnalysisResultProps {
  results: AnalysisResultType;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ results }) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="conditions">Conditions</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      {/* Summary Tab */}
      <TabsContent value="summary">
        <SummaryTab results={results} />
      </TabsContent>

      {/* Conditions Tab */}
      <TabsContent value="conditions">
        <ConditionsTab results={results} />
      </TabsContent>

      {/* Recommendations Tab */}
      <TabsContent value="recommendations">
        <RecommendationsTab results={results} />
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisResult;
