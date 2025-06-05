
import { toast } from 'sonner';
import { AIModelService } from '@/services/AIModelService';

// Model state management
let modelInitialized = false;
let loadingPromise: Promise<boolean> | null = null;
let modelVersion = 'v2.0'; // Updated model version

// Extended model types for more comprehensive analysis
type ModelType = 
  | 'general' 
  | 'acne-classification' 
  | 'yolo-detection' 
  | 'cnn-classification'
  | 'wrinkle-detection'
  | 'pigmentation-analysis'
  | 'skin-texture-analysis'
  | 'pore-analysis';

let loadedModelTypes: ModelType[] = [];

export const loadSkinAnalysisModel = async (modelType: ModelType = 'general') => {
  console.log(`Loading skin analysis model (${modelType})...`);
  
  // If already loading, return the existing promise
  if (loadingPromise) {
    console.log(`Skin analysis model (${modelType}) already loading, returning existing promise`);
    return loadingPromise;
  }
  
  // If already loaded and it's the same type, return immediately
  if (modelInitialized && loadedModelTypes.includes(modelType)) {
    console.log(`Skin analysis model (${modelType}) already loaded`);
    return Promise.resolve(true);
  }
  
  // Create a new loading promise
  loadingPromise = new Promise<boolean>(async (resolve, reject) => {
    try {
      // Show loading toast for complex models
      if (modelType === 'cnn-classification' || modelType === 'yolo-detection') {
        toast.info(`Loading ${modelType} model...`, {
          description: "Initializing real AI models for advanced skin analysis",
          duration: 5000
        });
      }
      
      // Initialize real AI models for CNN and YOLO
      if (modelType === 'cnn-classification' || modelType === 'yolo-detection') {
        await AIModelService.initializeModels();
      } else {
        // For other model types, simulate loading (these would be additional specialized models)
        const loadingTime = 
          modelType === 'general' ? 1000 : 
          modelType === 'wrinkle-detection' ? 1800 :
          modelType === 'pigmentation-analysis' ? 2200 :
          modelType === 'skin-texture-analysis' ? 1700 :
          modelType === 'pore-analysis' ? 1600 : 1500;
        
        await new Promise(resolve => setTimeout(resolve, loadingTime));
      }
      
      console.log(`Skin analysis model (${modelType}) loaded successfully`);
      modelInitialized = true;
      
      // Add this model type to loaded types
      if (!loadedModelTypes.includes(modelType)) {
        loadedModelTypes.push(modelType);
      }
      
      loadingPromise = null;
      resolve(true);
      
      // Show success toast for complex models
      if (modelType === 'cnn-classification' || modelType === 'yolo-detection') {
        toast.success(`${modelType} model loaded successfully`, {
          description: "Real AI model is now ready for advanced skin analysis"
        });
      }
      
    } catch (error) {
      console.error(`Error loading skin analysis model (${modelType}):`, error);
      toast.error(`Failed to load the ${modelType} skin analysis model. Please try again.`);
      loadingPromise = null;
      modelInitialized = false;
      reject(new Error('Failed to load model'));
    }
  });
  
  return loadingPromise;
};

// Load multiple model types at once with real AI models
export const loadAllModels = async () => {
  try {
    // Load real AI models first
    await loadSkinAnalysisModel('cnn-classification');
    await loadSkinAnalysisModel('yolo-detection');
    
    // Load other specialized models
    await loadSkinAnalysisModel('general');
    await loadSkinAnalysisModel('wrinkle-detection');
    await loadSkinAnalysisModel('pigmentation-analysis');
    await loadSkinAnalysisModel('skin-texture-analysis');
    await loadSkinAnalysisModel('pore-analysis');
    return true;
  } catch (error) {
    console.error('Error loading all models:', error);
    return false;
  }
};

// Check if specific model is loaded
export const isModelLoaded = (modelType: ModelType = 'general') => {
  return modelInitialized && loadedModelTypes.includes(modelType);
};

export const ensureModelLoaded = async (modelType: ModelType = 'general') => {
  if (isModelLoaded(modelType)) {
    return true;
  }
  
  try {
    await loadSkinAnalysisModel(modelType);
    return true;
  } catch (error) {
    console.error(`Error ensuring model (${modelType}) is loaded:`, error);
    return false;
  }
};

// Reset model state (useful for testing)
export const resetModel = () => {
  modelInitialized = false;
  loadedModelTypes = [];
  loadingPromise = null;
};

// Get information about loaded models
export const getModelInfo = () => {
  return {
    initialized: modelInitialized,
    loadedTypes: [...loadedModelTypes],
    version: modelVersion
  };
};
