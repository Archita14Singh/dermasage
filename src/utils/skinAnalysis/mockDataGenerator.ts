import { AnalysisResult, SkinType, ConditionSeverity, SkinCondition, AcneType, DetectedObject } from './types';

/**
 * Generates mock skin conditions for prototype
 */
export function generateMockSkinConditions(): AnalysisResult {
  const skinTypes: SkinType[] = ['dry', 'oily', 'combination', 'normal', 'sensitive'];
  const selectedSkinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
  
  const severityLevels: ConditionSeverity[] = ['low', 'mild', 'moderate', 'high'];
  
  const conditions: SkinCondition[] = [
    {
      condition: 'Dryness',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      confidence: 0.2 + Math.random() * 0.8,
      recommendations: [
        'Use a gentle, hydrating cleanser',
        'Apply a hyaluronic acid serum on damp skin',
        'Use a richer moisturizer with ceramides',
        'Consider adding facial oil to your nighttime routine',
        'Try overnight hydrating masks 1-2 times weekly'
      ]
    },
    {
      condition: 'Acne',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      confidence: 0.2 + Math.random() * 0.8,
      recommendations: [
        'Use a salicylic acid cleanser',
        'Apply benzoyl peroxide as a spot treatment',
        'Try niacinamide serum to regulate oil production',
        'Use non-comedogenic moisturizers',
        'Consider a retinoid for persistent breakouts'
      ]
    },
    {
      condition: 'Hyperpigmentation',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      confidence: 0.2 + Math.random() * 0.8,
      recommendations: [
        'Use vitamin C serum in the morning',
        'Apply alpha arbutin or tranexamic acid',
        'Use retinol at night to accelerate cell turnover',
        'Always wear SPF 30+ during the day',
        'Consider professional treatments like chemical peels'
      ]
    },
    {
      condition: 'Redness',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      confidence: 0.2 + Math.random() * 0.8,
      recommendations: [
        'Use gentle, fragrance-free products',
        'Apply centella asiatica or green tea extracts',
        'Consider azelaic acid to reduce inflammation',
        'Avoid hot water when cleansing',
        'Use mineral-based sunscreens with zinc oxide'
      ]
    }
  ];
  
  // Filter to 2-3 random conditions
  const shuffled = [...conditions].sort(() => 0.5 - Math.random());
  const selectedCount = Math.floor(Math.random() * 2) + 2; // 2-3 conditions
  const selectedConditions = shuffled.slice(0, selectedCount);
  
  // Generate overall description
  let overall = '';
  switch (selectedSkinType) {
    case 'dry':
      overall = 'Your skin appears to be dehydrated with some flakiness. Focus on hydration and barrier repair.';
      break;
    case 'oily':
      overall = 'Your skin produces excess sebum, particularly in the T-zone. Focus on oil control and pore care.';
      break;
    case 'combination':
      overall = 'Your skin shows oiliness in the T-zone with dryness on the cheeks. You\'ll need a balanced approach.';
      break;
    case 'sensitive':
      overall = 'Your skin shows signs of sensitivity and reactive tendencies. Gentle, soothing products are recommended.';
      break;
    default: // normal
      overall = 'Your skin appears relatively balanced but could benefit from targeted treatments for specific concerns.';
  }
  
  return {
    skinType: selectedSkinType,
    overall,
    conditions: selectedConditions,
    usedAdvancedModels: false
  };
}

/**
 * Generate additional data from advanced model analysis
 */
export const generateAdvancedModelData = () => {
  // Detected objects (from YOLO model) - These would be skin features detected
  const detectedObjects = [
    { label: 'Blackheads', confidence: 0.82, count: Math.floor(Math.random() * 15) + 3 },
    { label: 'Papules', confidence: 0.79, count: Math.floor(Math.random() * 8) + 1 },
    { label: 'Enlarged Pores', confidence: 0.92, count: Math.floor(Math.random() * 100) + 50 },
  ];
  
  // If the random number is greater than 0.5, add wrinkle detection
  if (Math.random() > 0.5) {
    detectedObjects.push(
      { label: 'Fine Lines', confidence: 0.75, count: Math.floor(Math.random() * 12) + 3 }
    );
  }
  
  // If the random number is greater than 0.6, add pigmentation detection
  if (Math.random() > 0.6) {
    detectedObjects.push(
      { label: 'Hyperpigmentation', confidence: 0.81, count: Math.floor(Math.random() * 5) + 1 }
    );
  }
  
  // Acne type classification (from CNN model) - These would be probabilities for each type
  const acneTypes = {
    hormonal: Math.random() * 0.7 + 0.3, // Between 0.3 and 1.0
    cystic: Math.random() * 0.6,         // Between 0.0 and 0.6
    comedonal: Math.random() * 0.8,      // Between 0.0 and 0.8
    fungal: Math.random() * 0.3          // Between 0.0 and 0.3
  };
  
  // Generate environmental factors analysis
  const environmentalFactors: EnvironmentalFactor[] = [
    {
      factor: 'Humidity',
      impact: Math.random() > 0.6 ? 'high' : 'medium',
      recommendations: [
        'Use a humidifier during dry months',
        'Adjust your moisturizer based on seasonal humidity changes',
        'Consider using hydrating mists throughout the day'
      ]
    },
    {
      factor: 'UV Exposure',
      impact: Math.random() > 0.4 ? 'high' : 'medium',
      recommendations: [
        'Apply broad-spectrum SPF 30+ daily',
        'Reapply sunscreen every 2 hours when outdoors',
        'Seek shade during peak sun hours (10am-4pm)'
      ]
    },
    {
      factor: 'Air Pollution',
      impact: Math.random() > 0.5 ? 'medium' : 'low',
      recommendations: [
        'Double cleanse in the evening to remove pollutants',
        'Use antioxidant serums to protect from free radical damage',
        'Consider an air purifier for your living space'
      ]
    }
  ];
  
  return {
    detectedObjects,
    acneTypes,
    environmentalFactors
  };
};
