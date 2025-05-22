
import React from 'react';
import { Button } from '@/components/ui/button';
import AnalysisResult from '@/components/AnalysisResult';
import AnalysisImageDisplay from './AnalysisImageDisplay';

interface AnalysisCompleteProps {
  image: string | null;
  analysisResults: any;
  handleReset: () => void;
  handleDiscussWithAI: () => void;
}

const AnalysisComplete: React.FC<AnalysisCompleteProps> = ({
  image,
  analysisResults,
  handleReset,
  handleDiscussWithAI
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <AnalysisImageDisplay 
        image={image} 
        status="complete" 
        useCustomModel={false} 
        handleReset={handleReset} 
      />
      
      <AnalysisResult results={analysisResults} />
      
      <div className="flex justify-center mt-4">
        <Button 
          onClick={handleDiscussWithAI}
          className="bg-skin-purple hover:bg-skin-purple/90"
        >
          Discuss Results with AI Assistant
        </Button>
      </div>
    </div>
  );
};

export default AnalysisComplete;
