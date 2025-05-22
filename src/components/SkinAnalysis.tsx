
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from './ImageUploader';
import { useSkinAnalysis } from '@/hooks/useSkinAnalysis';
import CustomModelSelector from './skin-analysis/CustomModelSelector';
import AnalysisImageDisplay from './skin-analysis/AnalysisImageDisplay';
import AnalysisErrorState from './skin-analysis/AnalysisErrorState';
import AnalysisComplete from './skin-analysis/AnalysisComplete';

const SkinAnalysis: React.FC = () => {
  const {
    image,
    status,
    analysisResults,
    datasets,
    selectedDatasetId,
    setSelectedDatasetId,
    useCustomModel,
    setUseCustomModel,
    trainedModelCount,
    handleImageSelected,
    handleReset,
    handleDiscussWithAI
  } = useSkinAnalysis();
  
  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div className="space-y-6">
          <CustomModelSelector
            datasets={datasets}
            selectedDatasetId={selectedDatasetId}
            setSelectedDatasetId={setSelectedDatasetId}
            useCustomModel={useCustomModel}
            setUseCustomModel={setUseCustomModel}
            trainedModelCount={trainedModelCount}
          />
          
          <ImageUploader 
            onImageSelected={handleImageSelected}
            className="h-[400px]"
          />
        </div>
      );
    }
    
    if (status === 'loading' || status === 'analyzing') {
      return (
        <AnalysisImageDisplay
          image={image}
          status={status}
          useCustomModel={useCustomModel}
        />
      );
    }
    
    if (status === 'complete' && analysisResults) {
      return (
        <AnalysisComplete
          image={image}
          analysisResults={analysisResults}
          handleReset={handleReset}
          handleDiscussWithAI={handleDiscussWithAI}
        />
      );
    }
    
    if (status === 'error') {
      return <AnalysisErrorState onReset={handleReset} />;
    }
    
    return null;
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SkinAnalysis;
