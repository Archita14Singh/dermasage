
import { toast } from 'sonner';

// In a real app, this would load the actual ML model
// For the prototype, we'll simulate loading with better reliability
let modelInitialized = false;
let loadingPromise: Promise<boolean> | null = null;

export const loadSkinAnalysisModel = async () => {
  console.log('Loading skin analysis model...');
  
  // If already loading, return the existing promise
  if (loadingPromise) {
    console.log('Skin analysis model already loading, returning existing promise');
    return loadingPromise;
  }
  
  // If already loaded, return immediately
  if (modelInitialized) {
    console.log('Skin analysis model already loaded');
    return Promise.resolve(true);
  }
  
  // Create a new loading promise
  loadingPromise = new Promise<boolean>((resolve, reject) => {
    try {
      // Simulate model loading with a more reliable approach
      const loadTimeout = setTimeout(() => {
        console.log('Skin analysis model loaded successfully');
        modelInitialized = true;
        loadingPromise = null;
        resolve(true);
        
        // Clear the timeout to prevent memory leaks
        clearTimeout(loadTimeout);
      }, 1000);
    } catch (error) {
      console.error('Error loading skin analysis model:', error);
      toast.error('Failed to load the skin analysis model. Please try again.');
      loadingPromise = null;
      modelInitialized = false;
      reject(new Error('Failed to load model'));
    }
  });
  
  return loadingPromise;
};

export const ensureModelLoaded = async () => {
  if (modelInitialized) {
    return true;
  }
  
  try {
    await loadSkinAnalysisModel();
    return true;
  } catch (error) {
    console.error('Error ensuring model is loaded:', error);
    return false;
  }
};

// Reset model state (useful for testing)
export const resetModel = () => {
  modelInitialized = false;
  loadingPromise = null;
};
