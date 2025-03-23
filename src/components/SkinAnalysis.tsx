
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysisUtils';
import AnalysisResult from './AnalysisResult';
import ImageUploader from './ImageUploader';
import LoadingOverlay from './LoadingOverlay';
import { useNavigate } from 'react-router-dom';

type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error';

const SkinAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const navigate = useNavigate();
  
  const handleImageSelected = async (imageData: string) => {
    setImage(imageData);
    setStatus('loading');
    
    try {
      setStatus('analyzing');
      
      // First ensure the model is loaded
      await loadSkinAnalysisModel();
      
      // Mock delay to simulate processing time for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For the prototype, we'll use mock analysis results
      const results = await analyzeSkinCondition(imageData);
      
      setAnalysisResults(results);
      setStatus('complete');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setStatus('error');
      toast.error('An error occurred during analysis. Please try again.');
    }
  };
  
  const handleReset = () => {
    setImage(null);
    setStatus('idle');
    setAnalysisResults(null);
  };

  const handleDiscussWithAI = () => {
    if (analysisResults && image) {
      // Store analysis results in sessionStorage to pass to chatbot
      sessionStorage.setItem('skinAnalysisResults', JSON.stringify(analysisResults));
      sessionStorage.setItem('skinAnalysisImage', image);
      navigate('/chat');
    }
  };
  
  const renderContent = () => {
    if (status === 'idle') {
      return (
        <ImageUploader 
          onImageSelected={(imageData) => handleImageSelected(imageData)}
          className="h-[400px]"
        />
      );
    }
    
    if (status === 'loading' || status === 'analyzing') {
      return (
        <div className="relative aspect-square max-h-[500px] rounded-xl overflow-hidden shadow-sm">
          {image && (
            <img
              src={image}
              alt="Uploaded skin"
              className="w-full h-full object-cover"
            />
          )}
          <LoadingOverlay 
            message={status === 'loading' ? "Processing Image" : "Analyzing Skin Condition"}
            subMessage={status === 'analyzing' ? "Our AI is analyzing your skin for acne, dryness, oiliness, redness, and pigmentation" : undefined}
          />
        </div>
      );
    }
    
    if (status === 'complete' && analysisResults) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="relative aspect-square max-h-[400px] rounded-xl overflow-hidden shadow-sm">
            {image && (
              <img
                src={image}
                alt="Analyzed skin"
                className="w-full h-full object-cover"
              />
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 rounded-full bg-white/80 shadow-sm hover:bg-white"
              onClick={handleReset}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
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
    }
    
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-destructive/20 rounded-xl bg-destructive/5">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't analyze your image. Please try again with a different photo or adjust lighting conditions.
          </p>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      );
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
