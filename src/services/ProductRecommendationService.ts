
import { AnalysisResult } from '@/utils/skinAnalysis';

export class ProductRecommendationService {
  static addProductRecommendations(response: string, analysis: AnalysisResult): string {
    response += `\nProduct recommendations based on your analysis:\n`;
    
    // Determine product recommendations based on main condition
    const mainCondition = analysis.conditions.sort((a, b) => b.confidence - a.confidence)[0]?.condition.toLowerCase();
    
    if (mainCondition?.includes('acne')) {
      response += `• Cleanser: CeraVe Acne Foaming Cream Cleanser - [Amazon](https://www.amazon.com/CeraVe-Cleanser-Treating-Salicylic-Niacinamide/dp/B08KPZDGN8)\n`;
      response += `• Treatment: Paula's Choice 2% BHA Liquid Exfoliant - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ)\n`;
      response += `• Spot Treatment: La Roche-Posay Effaclar Duo - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Treatment-Benzoyl-Peroxide/dp/B00CBDOXE4)\n`;
    } else if (mainCondition?.includes('dry')) {
      response += `• Cleanser: CeraVe Hydrating Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Facial-Cleanser-Fragrance/dp/B01MSSDEPK)\n`;
      response += `• Serum: The Ordinary Hyaluronic Acid 2% + B5 - [Amazon](https://www.amazon.com/Ordinary-Hyaluronic-Acid-2-30ml/dp/B07ZNKRJ9D)\n`;
      response += `• Moisturizer: CeraVe Moisturizing Cream - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Cream-Daily-Moisturizer/dp/B00TTD9BRC)\n`;
    } else if (mainCondition?.includes('pigment') || mainCondition?.includes('hyperpigment')) {
      response += `• Serum: The Ordinary Alpha Arbutin 2% + HA - [Amazon](https://www.amazon.com/Ordinary-Alpha-Arbutin-2-HA/dp/B06WGPMD78)\n`;
      response += `• Treatment: Paula's Choice 10% Azelaic Acid Booster - [Amazon](https://www.amazon.com/Paulas-Choice-BOOST-Azelaic-Brightening-Treatment/dp/B074ZLRPHC)\n`;
      response += `• Sunscreen: EltaMD UV Clear Broad-Spectrum SPF 46 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ)\n`;
    } else {
      response += `• Cleanser: Cetaphil Gentle Skin Cleanser - [Amazon](https://www.amazon.com/Cetaphil-Gentle-Cleanser-Face-Ounce/dp/B07GC74LL5)\n`;
      response += `• Moisturizer: CeraVe Daily Moisturizing Lotion - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Lotion-Hyaluronic-Fragrance/dp/B000YZ8QPU)\n`;
      response += `• Sunscreen: La Roche-Posay Anthelios Melt-in Milk SPF 100 - [Amazon](https://www.amazon.com/Roche-Posay-Anthelios-Sunscreen-Spectrum-Protectant/dp/B00HNSSV2U)\n`;
    }
    
    return response;
  }
  
  static addEnvironmentalProtectionProducts(response: string, analysis: AnalysisResult): string {
    if (analysis.environmentalFactors) {
      const highImpactFactors = analysis.environmentalFactors.filter(f => f.impact === 'high');
      if (highImpactFactors.length > 0) {
        response += `\nEnvironmental protection recommendations:\n`;
        
        if (highImpactFactors.some(f => f.factor.includes('Pollution'))) {
          response += `• Antioxidant Serum: Timeless 20% Vitamin C + E + Ferulic Acid - [Amazon](https://www.amazon.com/Timeless-Skin-Care-20-Vitamin/dp/B0036BI56G)\n`;
        }
        
        if (highImpactFactors.some(f => f.factor.includes('UV'))) {
          response += `• Sun Protection: Supergoop! Unseen Sunscreen SPF 40 - [Amazon](https://www.amazon.com/Supergoop-Unseen-Sunscreen-Oil-Free-Protection/dp/B07CKVB14S)\n`;
        }
        
        if (highImpactFactors.some(f => f.factor.includes('Humidity'))) {
          response += `• Hydration: Neutrogena Hydro Boost Water Gel - [Amazon](https://www.amazon.com/Neutrogena-Hydro-Hyaluronic-Hydrating-Moisturizer/dp/B00AQ4ROX0)\n`;
        }
      }
    }
    
    return response;
  }
}
