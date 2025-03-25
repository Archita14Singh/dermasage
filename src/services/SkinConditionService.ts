
import { toast } from 'sonner';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition, AnalysisResult } from '@/utils/skinAnalysisUtils';

type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

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
  
  static formatAnalysisForChat(analysis: AnalysisResult, clientProfile: ClientProfile = null): string {
    // Personalize greeting if client profile exists
    const greeting = clientProfile ? `${clientProfile.name}, based on ` : `Based on `;
    let response = `${greeting}my analysis of your skin image, here's what I found:\n\n`;
    
    // Compare detected skin type with client-reported skin type if available
    if (clientProfile?.skinType && clientProfile.skinType.toLowerCase() !== analysis.skinType.toLowerCase()) {
      response += `While you've mentioned having ${clientProfile.skinType.toLowerCase()} skin, your image suggests ${analysis.skinType.toLowerCase()} characteristics. This difference could be due to lighting, recent skincare use, or seasonal changes.\n\n`;
    } else {
      response += `Your skin appears to be ${analysis.skinType.toLowerCase()}. `;
    }
    
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
    
    // Customize recommendations based on client profile if available
    let allRecommendations = analysis.conditions.flatMap(c => c.recommendations);
    
    // Filter out recommendations containing allergens if allergies are specified
    if (clientProfile?.allergies && clientProfile.allergies.trim() !== '') {
      const allergens = clientProfile.allergies.toLowerCase().split(',').map(a => a.trim());
      allRecommendations = allRecommendations.filter(rec => {
        const recLower = rec.toLowerCase();
        return !allergens.some(allergen => recLower.includes(allergen));
      });
      
      // Add note about filtering
      if (allRecommendations.length < analysis.conditions.flatMap(c => c.recommendations).length) {
        response += `(Note: I've excluded recommendations containing your known allergens)\n`;
      }
    }
    
    // Get top recommendations across all conditions
    allRecommendations.slice(0, 4).forEach((rec, index) => {
      response += `${index + 1}. ${rec}\n`;
    });
    
    // Add age-specific advice if available
    if (clientProfile?.age) {
      const age = parseInt(clientProfile.age);
      if (!isNaN(age)) {
        if (age < 20) {
          response += `\nAs someone under 20, focus on building good skin habits early. Gentle cleansing and sun protection are especially important.`;
        } else if (age >= 20 && age < 30) {
          response += `\nIn your ${age}s, prevention is key. Consider adding antioxidants to your routine and maintain consistent sun protection.`;
        } else if (age >= 30 && age < 40) {
          response += `\nFor someone in their ${age}s, consider adding retinol and more targeted treatments for early signs of aging.`;
        } else if (age >= 40) {
          response += `\nAt ${age}, focus on supporting skin's natural renewal with peptides, more intensive hydration, and continued sun protection.`;
        }
      }
    }
    
    response += `\n\nWould you like more specific recommendations for any of these concerns?`;
    
    return response;
  }
}

export default SkinConditionService;
