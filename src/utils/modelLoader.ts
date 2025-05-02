
import { toast } from 'sonner';

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
  loadingPromise = new Promise<boolean>((resolve, reject) => {
    try {
      // Determine loading time based on model type (simulating different complexities)
      const loadingTime = 
        modelType === 'general' ? 1000 : 
        modelType === 'yolo-detection' ? 2000 :
        modelType === 'cnn-classification' ? 2500 : 
        modelType === 'wrinkle-detection' ? 1800 :
        modelType === 'pigmentation-analysis' ? 2200 :
        modelType === 'skin-texture-analysis' ? 1700 :
        modelType === 'pore-analysis' ? 1600 : 1500;
                         
      // Show toast for more complex models
      if (modelType !== 'general') {
        toast.info(`Loading ${modelType} model...`, {
          description: "Please wait while we initialize the advanced skin analysis capabilities",
          duration: loadingTime
        });
      }
      
      // Simulate model loading with a more reliable approach
      const loadTimeout = setTimeout(() => {
        console.log(`Skin analysis model (${modelType}) loaded successfully`);
        modelInitialized = true;
        
        // Add this model type to loaded types
        if (!loadedModelTypes.includes(modelType)) {
          loadedModelTypes.push(modelType);
        }
        
        loadingPromise = null;
        resolve(true);
        
        // Clear the timeout to prevent memory leaks
        clearTimeout(loadTimeout);
        
        // Show success toast for complex models
        if (modelType !== 'general') {
          toast.success(`${modelType} model loaded successfully`, {
            description: "Advanced skin analysis capabilities are now available"
          });
        }
      }, loadingTime);
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

// Load multiple model types at once with expanded model types
export const loadAllModels = async () => {
  try {
    await loadSkinAnalysisModel('general');
    await loadSkinAnalysisModel('yolo-detection');
    await loadSkinAnalysisModel('cnn-classification');
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
