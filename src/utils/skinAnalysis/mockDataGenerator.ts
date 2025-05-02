
import { 
  AnalysisResult, 
  AcneType,
  WrinkleType,
  PigmentationType,
  SkinTextureType,
  PoreType,
  DetectedObject
} from './types';

/**
 * Generates mock data for skin analysis
 */
export const generateMockSkinConditions = (): AnalysisResult => {
  // Add some randomness for demo purposes
  const randomFactor = Math.random() * 0.2;

  return {
    conditions: [
      {
        condition: 'Acne',
        confidence: 0.75 + randomFactor,
        severity: 'moderate',
        recommendations: [
          'Use a gentle cleanser with salicylic acid twice daily',
          'Apply benzoyl peroxide spot treatment on affected areas',
          'Avoid comedogenic (pore-clogging) products',
          'Consider a retinoid product to help with cell turnover'
        ]
      },
      {
        condition: 'Dryness',
        confidence: 0.62 - randomFactor,
        severity: 'moderate',
        recommendations: [
          'Use a hydrating cleanser instead of soap-based products',
          'Apply hyaluronic acid serum on damp skin',
          'Use a moisturizer with ceramides to strengthen skin barrier',
          'Consider adding facial oils in your nighttime routine'
        ]
      },
      {
        condition: 'Redness',
        confidence: 0.55 + randomFactor,
        severity: 'low',
        recommendations: [
          'Look for products with soothing ingredients like centella asiatica',
          'Avoid hot water when washing your face',
          'Consider azelaic acid to reduce inflammation',
          'Use fragrance-free products to minimize irritation'
        ]
      },
      {
        condition: 'Oiliness',
        confidence: 0.3 - randomFactor,
        severity: 'low',
        recommendations: [
          'Use a gentle foaming cleanser',
          'Consider niacinamide serum to regulate sebum production',
          'Use lightweight, oil-free moisturizers',
          'Try weekly clay masks to absorb excess oil'
        ]
      },
      {
        condition: 'Hyperpigmentation',
        confidence: 0.4 + randomFactor,
        severity: 'low',
        recommendations: [
          'Use vitamin C serum in the morning',
          'Apply sunscreen with at least SPF 30 daily',
          'Consider alpha arbutin or tranexamic acid products',
          'Be patient - hyperpigmentation takes time to fade'
        ]
      },
      {
        condition: 'Fine Lines',
        confidence: 0.35 + (Math.random() * 0.25),
        severity: 'low',
        recommendations: [
          'Incorporate retinol into your evening skincare routine',
          'Use products with peptides to support collagen production',
          'Add a hydrating hyaluronic acid serum to plump skin',
          'Ensure you are using sufficient SPF daily to prevent further damage'
        ]
      },
      {
        condition: 'Enlarged Pores',
        confidence: 0.45 + (Math.random() * 0.2),
        severity: 'moderate',
        recommendations: [
          'Use a BHA (salicylic acid) product to clear pores',
          'Consider clay masks 1-2 times weekly',
          'Use a non-comedogenic moisturizer',
          'Try niacinamide to help regulate sebum and minimize pore appearance'
        ]
      },
      {
        condition: 'Uneven Texture',
        confidence: 0.38 + (Math.random() * 0.2),
        severity: 'moderate',
        recommendations: [
          'Incorporate gentle chemical exfoliation with AHAs',
          'Consider adding a rice-based exfoliant for smoother texture',
          'Use humectants like glycerin to improve hydration',
          'Try a facial oil with linoleic acid if your skin is combination'
        ]
      }
    ],
    overall: 'Your skin shows signs of combination type with multiple concerns. The primary issues appear to be acne, dryness, and texture irregularities, with moderate redness. A customized skincare routine addressing these specific concerns would help improve your skin health.',
    skinType: 'Combination',
    usedAdvancedModels: false
  };
};

/**
 * Generates mock data for advanced models
 */
export const generateAdvancedModelData = (): {
  acneTypes: Record<AcneType, number>;
  wrinkleTypes: Record<WrinkleType, number>;
  pigmentationTypes: Record<PigmentationType, number>;
  skinTextureTypes: Record<SkinTextureType, number>;
  poreTypes: Record<PoreType, number>;
  detectedObjects: DetectedObject[];
} => {
  return {
    acneTypes: {
      papules: 0.15 + (Math.random() * 0.2),
      pustules: 0.25 + (Math.random() * 0.3),
      nodular: 0.05 + (Math.random() * 0.1),
      cystic: 0.08 + (Math.random() * 0.15),
      comedonal: 0.35 + (Math.random() * 0.3),
      hormonal: 0.20 + (Math.random() * 0.3),
      fungal: 0.02 + (Math.random() * 0.05)
    },
    wrinkleTypes: {
      fine_lines: 0.4 + (Math.random() * 0.3),
      deep_wrinkles: 0.1 + (Math.random() * 0.15),
      crow_feet: 0.25 + (Math.random() * 0.2),
      nasolabial_folds: 0.3 + (Math.random() * 0.25),
      forehead_lines: 0.35 + (Math.random() * 0.25)
    },
    pigmentationTypes: {
      melasma: 0.15 + (Math.random() * 0.2),
      post_inflammatory: 0.3 + (Math.random() * 0.25),
      sun_spots: 0.4 + (Math.random() * 0.3),
      freckles: 0.35 + (Math.random() * 0.25),
      age_spots: 0.2 + (Math.random() * 0.15)
    },
    skinTextureTypes: {
      rough: 0.3 + (Math.random() * 0.25),
      smooth: 0.4 + (Math.random() * 0.25),
      uneven: 0.35 + (Math.random() * 0.25),
      bumpy: 0.2 + (Math.random() * 0.2),
      scaly: 0.15 + (Math.random() * 0.15),
      dehydrated: 0.25 + (Math.random() * 0.25)
    },
    poreTypes: {
      enlarged: 0.4 + (Math.random() * 0.3),
      clogged: 0.35 + (Math.random() * 0.25),
      normal: 0.2 + (Math.random() * 0.15),
      minimal: 0.05 + (Math.random() * 0.1)
    },
    detectedObjects: [
      {
        label: 'acne_lesion',
        confidence: 0.89 + (Math.random() * 0.1),
        position: { x: 120, y: 80, width: 20, height: 20 }
      },
      {
        label: 'pore',
        confidence: 0.76 + (Math.random() * 0.1),
        position: { x: 200, y: 150, width: 15, height: 15 }
      },
      {
        label: 'scar',
        confidence: 0.65 + (Math.random() * 0.2),
        position: { x: 180, y: 220, width: 25, height: 15 }
      },
      {
        label: 'blackhead',
        confidence: 0.81 + (Math.random() * 0.15),
        position: { x: 250, y: 100, width: 10, height: 10 }
      },
      {
        label: 'hyperpigmentation',
        confidence: 0.72 + (Math.random() * 0.15),
        position: { x: 300, y: 180, width: 30, height: 20 }
      },
      {
        label: 'wrinkle',
        confidence: 0.68 + (Math.random() * 0.15),
        position: { x: 150, y: 60, width: 40, height: 5 }
      },
      {
        label: 'dry_patch',
        confidence: 0.77 + (Math.random() * 0.15),
        position: { x: 100, y: 130, width: 35, height: 25 }
      },
      {
        label: 'enlarged_pore',
        confidence: 0.83 + (Math.random() * 0.1),
        position: { x: 220, y: 170, width: 8, height: 8 }
      }
    ]
  };
};
