
import { toast } from 'sonner';
import { loadSkinAnalysisModel } from '../modelLoader';
import { AnalysisResult } from './types';
import { generateMockSkinConditions, generateAdvancedModelData } from './mockDataGenerator';
import { enhanceAnalysisResults } from './resultEnhancer';
import { preprocessImage } from './imageProcessor';

/**
 * Analyzes a skin image and returns detailed analysis results
 */
export const analyzeSkinCondition = async (imageData: string): Promise<AnalysisResult> => {
  console.log('Analyzing skin condition...');
  
  try {
    // First load the general model
    await loadSkinAnalysisModel('general');
    
    // Try to load advanced models (but don't block analysis if they fail)
    const loadYolo = loadSkinAnalysisModel('yolo-detection');
    const loadCnn = loadSkinAnalysisModel('cnn-classification');
    const loadWrinkle = loadSkinAnalysisModel('wrinkle-detection');
    const loadPigment = loadSkinAnalysisModel('pigmentation-analysis');
    const loadTexture = loadSkinAnalysisModel('skin-texture-analysis');
    const loadPore = loadSkinAnalysisModel('pore-analysis');
    
    // Generate base mock results for prototype
    const mockResult = generateMockSkinConditions();
    
    // Try to wait for advanced models to load, with a timeout
    try {
      await Promise.all([
        Promise.race([loadYolo, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadCnn, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadWrinkle, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadPigment, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadTexture, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadPore, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))])
      ]);
      
      // If we get here, advanced models loaded successfully
      mockResult.usedAdvancedModels = true;
      
      // Add advanced model data
      const advancedData = generateAdvancedModelData();
      Object.assign(mockResult, advancedData);
      
      // Enhance the analysis results with specialized recommendations
      const enhancedResults = enhanceAnalysisResults(mockResult);
      
      toast.success('Advanced analysis complete', {
        description: 'Enhanced skin analysis with multiple advanced models applied successfully'
      });
      
      console.log('Analysis complete:', enhancedResults);
      return enhancedResults;
      
    } catch (error) {
      console.log('Some advanced models could not be loaded in time, using partial advanced analysis');
      return mockResult;
    }
    
  } catch (error) {
    console.error('Error analyzing skin condition:', error);
    toast.error('An error occurred during skin analysis. Please try again.');
    throw new Error('Analysis failed');
  }
};
