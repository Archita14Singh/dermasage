
import { AnalysisResult, AcneType } from './types';

/**
 * Enhances analysis results with specialized recommendations
 * based on detected conditions and their types
 */
export const enhanceAnalysisResults = (results: AnalysisResult): AnalysisResult => {
  // Deep clone the results to avoid mutations
  const enhancedResults = JSON.parse(JSON.stringify(results)) as AnalysisResult;
  
  // Only enhance if advanced models were used
  if (!enhancedResults.usedAdvancedModels) {
    return enhancedResults;
  }

  // Enhance acne recommendations based on type
  if (enhancedResults.acneTypes) {
    enhanceAcneRecommendations(enhancedResults);
  }

  // Enhance wrinkle recommendations based on type
  if (enhancedResults.wrinkleTypes) {
    enhanceWrinkleRecommendations(enhancedResults);
  }

  // Enhance pigmentation recommendations based on type
  if (enhancedResults.pigmentationTypes) {
    enhancePigmentationRecommendations(enhancedResults);
  }

  return enhancedResults;
};

/**
 * Enhances acne recommendations based on detected acne type
 */
const enhanceAcneRecommendations = (results: AnalysisResult): void => {
  let primaryAcneType = "";
  let maxConfidence = 0;
  
  if (!results.acneTypes) return;
  
  for (const [type, confidence] of Object.entries(results.acneTypes)) {
    if (confidence !== undefined && confidence > maxConfidence) {
      maxConfidence = confidence;
      primaryAcneType = type;
    }
  }
  
  // Find the acne condition and update it
  const acneCondition = results.conditions.find(c => c.condition === 'Acne');
  if (acneCondition && primaryAcneType) {
    acneCondition.condition = `Acne (primarily ${primaryAcneType})`;
    
    // Add specialized recommendations based on acne type
    if (primaryAcneType === 'hormonal') {
      acneCondition.recommendations = [
        'Consider seeing a dermatologist about spironolactone or other hormonal treatments',
        'Use products with ingredients like salicylic acid and retinoids',
        'Track breakouts in relation to your menstrual cycle',
        'Try spearmint tea which may have anti-androgenic properties'
      ];
    } else if (primaryAcneType === 'cystic' || primaryAcneType === 'nodular') {
      acneCondition.recommendations = [
        'Consult a dermatologist as prescription treatments are often needed',
        'Use gentle, non-irritating products to minimize inflammation',
        'Ice inflamed areas briefly to reduce swelling',
        'Consider LED blue light therapy to kill bacteria'
      ];
    } else if (primaryAcneType === 'fungal') {
      acneCondition.recommendations = [
        'Use anti-fungal treatments like ketoconazole shampoo as a mask',
        'Avoid oils and fatty acids that feed malassezia',
        'Consider zinc pyrithione products',
        'Look for "fungal acne safe" products'
      ];
    }
  }
};

/**
 * Enhances wrinkle recommendations based on detected wrinkle type
 */
const enhanceWrinkleRecommendations = (results: AnalysisResult): void => {
  let primaryWrinkleType = "";
  let maxConfidence = 0;
  
  if (!results.wrinkleTypes) return;
  
  for (const [type, confidence] of Object.entries(results.wrinkleTypes)) {
    if (confidence !== undefined && confidence > maxConfidence) {
      maxConfidence = confidence;
      primaryWrinkleType = type;
    }
  }
  
  // Find or add wrinkle condition
  const wrinkleCondition = results.conditions.find(c => c.condition === 'Fine Lines');
  if (wrinkleCondition && primaryWrinkleType) {
    // Update condition name based on primary type
    if (primaryWrinkleType === 'deep_wrinkles') {
      wrinkleCondition.condition = 'Deep Wrinkles';
      wrinkleCondition.recommendations = [
        'Consider professional treatments like microneedling or laser',
        'Use high-concentration retinoids (consult a dermatologist)',
        'Add peptide serums to support collagen production',
        'Ensure you are using a high SPF sunscreen daily'
      ];
    } else if (primaryWrinkleType === 'crow_feet') {
      wrinkleCondition.condition = 'Crow\'s Feet';
      wrinkleCondition.recommendations = [
        'Apply eye-specific products with peptides and retinol',
        'Consider using eye patches with hyaluronic acid',
        'Always wear sunglasses outdoors',
        'Stay hydrated and use a humidifier if in dry environments'
      ];
    } else if (primaryWrinkleType === 'nasolabial_folds') {
      wrinkleCondition.condition = 'Nasolabial Folds';
      wrinkleCondition.recommendations = [
        'Use targeted peptide treatments in this area',
        'Consider facial massage techniques to improve circulation',
        'Look into professional dermal fillers (consult a dermatologist)',
        'Use products with collagen-stimulating ingredients'
      ];
    }
  }
};

/**
 * Enhances pigmentation recommendations based on detected pigmentation type
 */
const enhancePigmentationRecommendations = (results: AnalysisResult): void => {
  let primaryPigmentType = "";
  let maxConfidence = 0;
  
  if (!results.pigmentationTypes) return;
  
  for (const [type, confidence] of Object.entries(results.pigmentationTypes)) {
    if (confidence !== undefined && confidence > maxConfidence) {
      maxConfidence = confidence;
      primaryPigmentType = type;
    }
  }
  
  // Find pigmentation condition
  const pigmentCondition = results.conditions.find(c => c.condition === 'Hyperpigmentation');
  if (pigmentCondition && primaryPigmentType) {
    // Update condition name and recommendations based on primary type
    if (primaryPigmentType === 'melasma') {
      pigmentCondition.condition = 'Hyperpigmentation (Melasma)';
      pigmentCondition.recommendations = [
        'Use high SPF sunscreen with iron oxide to block visible light',
        'Try tranexamic acid products which are effective for melasma',
        'Consider professional treatments like chemical peels',
        'Avoid heat exposure which can worsen melasma'
      ];
    } else if (primaryPigmentType === 'post_inflammatory') {
      pigmentCondition.condition = 'Post-Inflammatory Hyperpigmentation';
      pigmentCondition.recommendations = [
        'Use products with niacinamide to reduce inflammation',
        'Try alpha arbutin to inhibit tyrosinase activity',
        'Be patient - PIH requires consistent treatment over time',
        'Absolutely avoid picking at acne or irritation'
      ];
    } else if (primaryPigmentType === 'sun_spots') {
      pigmentCondition.condition = 'Sun Spots';
      pigmentCondition.recommendations = [
        'Use products with vitamin C to brighten and provide antioxidant protection',
        'Consider exfoliating with AHAs like glycolic acid',
        'Look into professional treatments like IPL for stubborn spots',
        'Reapply sunscreen every 2 hours when outdoors'
      ];
    }
  }
};
