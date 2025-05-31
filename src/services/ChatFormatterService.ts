
import { AnalysisResult, AcneType } from '@/utils/skinAnalysis';

type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

export class ChatFormatterService {
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
    
    return response;
  }
  
  static addEnvironmentalFactorsAnalysis(response: string, analysis: AnalysisResult): string {
    if (analysis.environmentalFactors && analysis.environmentalFactors.length > 0) {
      response += `\n🌿 Environmental Factors Analysis:\n`;
      analysis.environmentalFactors.forEach((factor) => {
        response += `• ${factor.factor}: ${factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)} impact on your skin\n`;
      });
      
      // Add environmental recommendations
      response += `\nEnvironmental recommendations:\n`;
      const primaryFactor = analysis.environmentalFactors.sort((a, b) => {
        const impactScore = { 'high': 3, 'medium': 2, 'low': 1 };
        return impactScore[b.impact] - impactScore[a.impact];
      })[0];
      
      primaryFactor.recommendations.forEach((rec, index) => {
        response += `${index + 1}. ${rec}\n`;
      });
    }
    
    return response;
  }
  
  static addGeneralRecommendations(response: string, analysis: AnalysisResult, clientProfile: ClientProfile): string {
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
    
    return response;
  }
}
