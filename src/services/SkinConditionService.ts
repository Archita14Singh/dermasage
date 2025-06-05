
import { toast } from 'sonner';
import { loadSkinAnalysisModel, loadAllModels } from '@/utils/modelLoader';
import { 
  analyzeSkinCondition, 
  AnalysisResult
} from '@/utils/skinAnalysis';
import { ChatFormatterService } from './ChatFormatterService';
import { ProductRecommendationService } from './ProductRecommendationService';
import { AgeSpecificAdviceService } from './AgeSpecificAdviceService';
import { AdvancedAnalysisFormatter } from './AdvancedAnalysisFormatter';

type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

export class SkinConditionService {
  static async analyzeImage(imageData: string, useAdvancedModels = true): Promise<AnalysisResult> {
    try {
      if (useAdvancedModels) {
        // Load real CNN and YOLO models
        console.log('Loading real AI models (CNN + YOLO)...');
        await loadAllModels();
        toast.info('Real AI models loaded', {
          description: 'Using CNN and YOLO for advanced skin analysis'
        });
      } else {
        // Just load the basic model
        await loadSkinAnalysisModel();
      }
      
      // Analyze the image with real AI models
      const results = await analyzeSkinCondition(imageData);
      return results;
    } catch (error) {
      console.error('Error in skin analysis service:', error);
      toast.error('Failed to analyze skin image. Please try again.');
      throw new Error('Skin analysis failed');
    }
  }
  
  static formatAnalysisForChat(analysis: AnalysisResult, clientProfile: ClientProfile = null): string {
    // Start with basic analysis formatting
    let response = ChatFormatterService.formatAnalysisForChat(analysis, clientProfile);
    
    // Add environmental factors analysis if available
    response = ChatFormatterService.addEnvironmentalFactorsAnalysis(response, analysis);
    
    // Add advanced analysis results if available
    response = AdvancedAnalysisFormatter.formatAdvancedAnalysis(response, analysis);
    
    // Add general recommendations
    response = ChatFormatterService.addGeneralRecommendations(response, analysis, clientProfile);
    
    // Add product recommendations with links
    response = ProductRecommendationService.addProductRecommendations(response, analysis);
    
    // Add environmental product recommendations if available
    response = ProductRecommendationService.addEnvironmentalProtectionProducts(response, analysis);
    
    // Add age-specific advice if available
    response = AgeSpecificAdviceService.addAgeSpecificAdvice(response, clientProfile);
    
    response += `\n\nWould you like more specific recommendations for any of these concerns? Or would you like me to explain more about the advanced analysis findings?`;
    
    return response;
  }
}

export default SkinConditionService;
