
import React, { useState, useEffect } from 'react';
import { X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysis';
import { modelTrainer } from '@/utils/skinAnalysis/modelTrainer';
import AnalysisResult from './AnalysisResult';
import ImageUploader from './ImageUploader';
import LoadingOverlay from './LoadingOverlay';
import { useNavigate } from 'react-router-dom';
import DatasetService from '@/services/DatasetService';
import { Dataset } from '@/types/dataset';

type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error';

const SkinAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const navigate = useNavigate();
  
  // Add states for custom models
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [useCustomModel, setUseCustomModel] = useState(false);

  // Load datasets on component mount
  useEffect(() => {
    const loadedDatasets = DatasetService.getDatasets();
    setDatasets(loadedDatasets);
    
    // Check if there are any trained models
    const trainedModels = JSON.parse(localStorage.getItem('skinwise_models') || '[]');
    
    if (trainedModels.length > 0) {
      // Find the dataset for the most recent model
      const mostRecentModel = trainedModels[trainedModels.length - 1];
      const matchingDataset = loadedDatasets.find(d => d.id === mostRecentModel.datasetId);
      
      if (matchingDataset) {
        setSelectedDatasetId(matchingDataset.id);
        // Don't automatically set useCustomModel to true to avoid confusion
      }
    }
  }, []);
  
  const handleImageSelected = async (imageData: string, file: File) => {
    setImage(imageData);
    setStatus('loading');
    
    try {
      if (useCustomModel && selectedDatasetId) {
        // Use custom trained model
        setStatus('analyzing');
        console.log('Using custom model for dataset:', selectedDatasetId);
        
        const results = await modelTrainer.analyzeWithTrainedModel(imageData, selectedDatasetId);
        
        if (results) {
          console.log('Custom analysis complete:', results);
          setAnalysisResults(results);
          setStatus('complete');
          toast.success('Skin analysis complete using your custom model');
        } else {
          throw new Error('Custom model analysis failed');
        }
      } else {
        // Use default analysis process
        console.log('Loading skin analysis model...');
        await loadSkinAnalysisModel();
        
        setStatus('analyzing');
        console.log('Model loaded, beginning analysis...');
        
        // Mock delay to simulate processing time for now
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // For the prototype, we'll use mock analysis results
        console.log('Analyzing image...');
        const results = await analyzeSkinCondition(imageData);
        
        console.log('Analysis complete:', results);
        setAnalysisResults(results);
        setStatus('complete');
        toast.success('Skin analysis complete');
      }
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
      console.log('Storing analysis results for chatbot...');
      sessionStorage.setItem('skinAnalysisResults', JSON.stringify(analysisResults));
      sessionStorage.setItem('skinAnalysisImage', image);
      navigate('/chat');
    }
  };

  // Function to check if a dataset has a trained model
  const hasTrainedModel = (datasetId: string) => {
    const models = JSON.parse(localStorage.getItem('skinwise_models') || '[]');
    return models.some((model: any) => model.datasetId === datasetId);
  };
  
  // Calculate number of trained models
  const trainedModelCount = JSON.parse(localStorage.getItem('skinwise_models') || '[]').length;
  
  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div className="space-y-6">
          {datasets.length > 0 && trainedModelCount > 0 && (
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Brain className="text-primary h-5 w-5" />
                <h3 className="font-medium">Your custom trained models</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-shrink-0">
                  <Select
                    value={selectedDatasetId || ''}
                    onValueChange={(value) => setSelectedDatasetId(value || null)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select model dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets
                        .filter(dataset => hasTrainedModel(dataset.id))
                        .map(dataset => (
                          <SelectItem key={dataset.id} value={dataset.id}>
                            {dataset.name} Model
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="use-custom-model"
                    checked={useCustomModel}
                    onChange={() => setUseCustomModel(!useCustomModel)}
                    disabled={!selectedDatasetId}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="use-custom-model" className="text-sm">
                    Use custom trained model
                  </label>
                </div>
              </div>
              
              {useCustomModel && selectedDatasetId && (
                <p className="text-xs text-muted-foreground">
                  Your analysis will use the custom model trained on your "{
                    datasets.find(d => d.id === selectedDatasetId)?.name
                  }" dataset.
                </p>
              )}
            </div>
          )}
          
          <ImageUploader 
            onImageSelected={(imageData, file) => handleImageSelected(imageData, file)}
            className="h-[400px]"
          />
        </div>
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
            subMessage={status === 'analyzing' ? 
              useCustomModel ? 
                "Using your custom trained model to analyze your skin" : 
                "Our AI is analyzing your skin for acne, dryness, oiliness, redness, and pigmentation"
              : undefined}
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
