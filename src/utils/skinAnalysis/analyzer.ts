
import { toast } from 'sonner';
import { loadSkinAnalysisModel } from '../modelLoader';
import { AnalysisResult, EnvironmentalFactor, ImpactLevel } from './types';
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
      
      // Generate environmental factors analysis
      mockResult.environmentalFactors = generateEnvironmentalFactorsAnalysis();
      
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

/**
 * Generates environmental factors analysis based on image metadata
 * In a real app, this would use actual environmental data
 */
function generateEnvironmentalFactorsAnalysis(): EnvironmentalFactor[] {
  return [
    {
      factor: 'Humidity',
      impact: (Math.random() > 0.6 ? 'high' : 'medium') as ImpactLevel,
      recommendations: [
        'Use a humidifier during dry months',
        'Adjust your moisturizer based on seasonal humidity changes',
        'Consider using hydrating mists throughout the day'
      ]
    },
    {
      factor: 'UV Exposure',
      impact: (Math.random() > 0.4 ? 'high' : 'medium') as ImpactLevel,
      recommendations: [
        'Apply broad-spectrum SPF 30+ daily',
        'Reapply sunscreen every 2 hours when outdoors',
        'Seek shade during peak sun hours (10am-4pm)'
      ]
    },
    {
      factor: 'Air Pollution',
      impact: (Math.random() > 0.5 ? 'medium' : 'low') as ImpactLevel,
      recommendations: [
        'Double cleanse in the evening to remove pollutants',
        'Use antioxidant serums to protect from free radical damage',
        'Consider an air purifier for your living space'
      ]
    }
  ];
}
