
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysis';
import { modelTrainer } from '@/utils/skinAnalysis/modelTrainer';
import DatasetService from '@/services/DatasetService';
import { Dataset } from '@/types/dataset';

type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error';

export const useSkinAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const navigate = useNavigate();
  
  // Custom models states
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [useCustomModel, setUseCustomModel] = useState(false);

  // Load datasets on hook initialization
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
  
  // Calculate number of trained models
  const trainedModelCount = JSON.parse(localStorage.getItem('skinwise_models') || '[]').length;
  
  return {
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
  };
};
