import { toast } from 'sonner';
import { loadSkinAnalysisModel, loadAllModels } from '@/utils/modelLoader';
import { 
  analyzeSkinCondition, 
  AnalysisResult, 
  AcneType 
} from '@/utils/skinAnalysis';

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
      // Load models based on analysis type
      if (useAdvancedModels) {
        // Start loading all models in parallel, don't wait
        loadAllModels();
      } else {
        // Just load the basic model and wait for it
        await loadSkinAnalysisModel();
      }
      
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
    
    // Add advanced analysis results if available
    if (analysis.usedAdvancedModels) {
      response += `\n📊 Advanced Analysis Results:\n`;
      
      // Add CNN acne classification results
      if (analysis.acneTypes) {
        response += `Acne Classification: `;
        const acneTypes = Object.entries(analysis.acneTypes)
          .sort((a, b) => b[1] - a[1]) // Sort by confidence descending
          .slice(0, 3); // Take top 3
          
        response += acneTypes
          .map(([type, confidence]) => `${type} (${Math.round(confidence * 100)}%)`)
          .join(', ') + '\n';
          
        // Add specific advice for primary acne type
        const [primaryType, _] = acneTypes[0];
        response += `\nFor your primary ${primaryType} acne, consider these targeted approaches:\n`;
        
        switch (primaryType as AcneType) {
          case 'hormonal':
            response += `• Track breakouts in relation to hormonal cycles\n• Consider consulting a dermatologist about hormonal treatments\n• Focus on anti-inflammatory ingredients like niacinamide\n`;
            break;
          case 'cystic':
            response += `• Avoid picking which can cause scarring\n• Ice inflamed areas to reduce pain and swelling\n• Consult a dermatologist as prescription treatments are often needed\n`;
            break;
          case 'comedonal':
            response += `• Focus on gentle chemical exfoliation with BHAs\n• Consider retinoids to normalize cell turnover\n• Look for "non-comedogenic" products\n`;
            break;
          case 'fungal':
            response += `• Use anti-fungal treatments like ketoconazole\n• Avoid oils and fatty acids that feed malassezia\n• Look for "fungal acne safe" products\n`;
            break;
          default:
            response += `• Keep skin clean but don't over-cleanse\n• Use targeted treatments with ingredients like salicylic acid\n• Stay consistent with your routine\n`;
        }
      }
      
      // Add YOLO detection results if available
      if (analysis.detectedObjects && analysis.detectedObjects.length > 0) {
        response += `\nDetected Features: `;
        const detections = analysis.detectedObjects
          .sort((a, b) => b.confidence - a.confidence)
          .map(obj => `${obj.label} (${Math.round(obj.confidence * 100)}%)`);
          
        response += detections.join(', ') + '\n';
      }
    }
    
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
    
    // Add product recommendations with links
    response += `\nProduct recommendations based on your analysis:\n`;
    
    // Determine product recommendations based on main condition
    const mainCondition = analysis.conditions.sort((a, b) => b.confidence - a.confidence)[0]?.condition.toLowerCase();
    
    if (mainCondition.includes('acne')) {
      response += `• Cleanser: CeraVe Acne Foaming Cream Cleanser - [Amazon](https://www.amazon.com/CeraVe-Cleanser-Treating-Salicylic-Niacinamide/dp/B08KPZDGN8)\n`;
      response += `• Treatment: Paula's Choice 2% BHA Liquid Exfoliant - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ)\n`;
      response += `• Spot Treatment: La Roche-Posay Effaclar Duo - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Treatment-Benzoyl-Peroxide/dp/B00CBDOXE4)\n`;
    } else if (mainCondition.includes('dry')) {
      response += `• Cleanser: CeraVe Hydrating Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Facial-Cleanser-Fragrance/dp/B01MSSDEPK)\n`;
      response += `• Serum: The Ordinary Hyaluronic Acid 2% + B5 - [Amazon](https://www.amazon.com/Ordinary-Hyaluronic-Acid-2-30ml/dp/B07ZNKRJ9D)\n`;
      response += `• Moisturizer: CeraVe Moisturizing Cream - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Cream-Daily-Moisturizer/dp/B00TTD9BRC)\n`;
    } else if (mainCondition.includes('pigment') || mainCondition.includes('hyperpigment')) {
      response += `• Serum: The Ordinary Alpha Arbutin 2% + HA - [Amazon](https://www.amazon.com/Ordinary-Alpha-Arbutin-2-HA/dp/B06WGPMD78)\n`;
      response += `• Treatment: Paula's Choice 10% Azelaic Acid Booster - [Amazon](https://www.amazon.com/Paulas-Choice-BOOST-Azelaic-Brightening-Treatment/dp/B074ZLRPHC)\n`;
      response += `• Sunscreen: EltaMD UV Clear Broad-Spectrum SPF 46 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ)\n`;
    } else {
      response += `• Cleanser: Cetaphil Gentle Skin Cleanser - [Amazon](https://www.amazon.com/Cetaphil-Gentle-Cleanser-Face-Ounce/dp/B07GC74LL5)\n`;
      response += `• Moisturizer: CeraVe Daily Moisturizing Lotion - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Lotion-Hyaluronic-Fragrance/dp/B000YZ8QPU)\n`;
      response += `• Sunscreen: La Roche-Posay Anthelios Melt-in Milk SPF 100 - [Amazon](https://www.amazon.com/Roche-Posay-Anthelios-Sunscreen-Spectrum-Protectant/dp/B00HNSSV2U)\n`;
    }
    
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
    
    response += `\n\nWould you like more specific recommendations for any of these concerns? Or would you like me to explain more about the advanced analysis findings?`;
    
    return response;
  }
}

export default SkinConditionService;
