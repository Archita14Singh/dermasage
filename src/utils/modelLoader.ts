
import { toast } from 'sonner';

// Model state management
let modelInitialized = false;
let loadingPromise: Promise<boolean> | null = null;
let modelVersion = 'v1.0'; // Track model version for potential updates

// For the prototype, we'll simulate different model types being loaded
type ModelType = 'general' | 'acne-classification' | 'yolo-detection' | 'cnn-classification';
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
      const loadingTime = modelType === 'general' ? 1000 : 
                         modelType === 'yolo-detection' ? 2000 :
                         modelType === 'cnn-classification' ? 2500 : 1500;
                         
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

// Load multiple model types at once
export const loadAllModels = async () => {
  try {
    await loadSkinAnalysisModel('general');
    await loadSkinAnalysisModel('yolo-detection');
    await loadSkinAnalysisModel('cnn-classification');
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
