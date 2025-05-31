
import { AnalysisResult, AcneType } from '@/utils/skinAnalysis';

export class AdvancedAnalysisFormatter {
  static formatAdvancedAnalysis(response: string, analysis: AnalysisResult): string {
    if (analysis.usedAdvancedModels) {
      response += `\n📊 Advanced Analysis Results:\n`;
      
      // Add CNN acne classification results
      if (analysis.acneTypes) {
        response = this.addAcneClassification(response, analysis);
      }
      
      // Add YOLO detection results if available
      if (analysis.detectedObjects && analysis.detectedObjects.length > 0) {
        response += `\nDetected Features: `;
        const detections = analysis.detectedObjects
          .sort((a, b) => b.confidence - a.confidence)
          .map(obj => `${obj.label} (${Math.round(obj.confidence * 100)}%${obj.count ? `, count: ~${obj.count}` : ''})`);
          
        response += detections.join(', ') + '\n';
      }
    }
    
    return response;
  }
  
  private static addAcneClassification(response: string, analysis: AnalysisResult): string {
    if (!analysis.acneTypes) return response;
    
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
    
    response = this.addAcneTypeAdvice(response, primaryType as AcneType);
    
    return response;
  }
  
  private static addAcneTypeAdvice(response: string, primaryType: AcneType): string {
    switch (primaryType) {
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
    
    return response;
  }
}
