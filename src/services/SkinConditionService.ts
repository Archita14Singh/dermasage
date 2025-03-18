
import { toast } from 'sonner';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition, AnalysisResult } from '@/utils/skinAnalysisUtils';

export class SkinConditionService {
  static async analyzeImage(imageData: string): Promise<AnalysisResult> {
    try {
      // Ensure model is loaded
      await loadSkinAnalysisModel();
      
      // Analyze the image
      const results = await analyzeSkinCondition(imageData);
      return results;
    } catch (error) {
      console.error('Error in skin analysis service:', error);
      toast.error('Failed to analyze skin image. Please try again.');
      throw new Error('Skin analysis failed');
    }
  }
  
  static formatAnalysisForChat(analysis: AnalysisResult): string {
    let response = `I've analyzed your skin image and here's what I found:\n\n`;
    
    // Add skin type
    response += `Your skin appears to be ${analysis.skinType.toLowerCase()}. `;
    
    // Add overall assessment
    response += `${analysis.overall}\n\n`;
    
    // Add conditions found
    response += `Key observations:\n`;
    analysis.conditions.forEach((condition) => {
      const severityText = condition.severity === 'high' ? 'significant' : 
                           condition.severity === 'moderate' ? 'moderate' : 'mild';
                           
      response += `• ${condition.condition}: ${severityText} (${Math.round(condition.confidence * 100)}% confidence)\n`;
    });
    
    response += `\nBased on this analysis, here are my recommendations:\n`;
    
    // Get top recommendations across all conditions
    const allRecommendations = analysis.conditions
      .flatMap(c => c.recommendations)
      .slice(0, 4);
      
    allRecommendations.forEach((rec, index) => {
      response += `${index + 1}. ${rec}\n`;
    });
    
    response += `\nWould you like more specific recommendations for any of these concerns?`;
    
    return response;
  }
}

export default SkinConditionService;
