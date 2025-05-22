
import { AnalysisResult, SkinCondition, SkinType, EnvironmentalFactor } from './types';

/**
 * Generates mock skin condition analysis for prototype
 */
export const generateMockSkinConditions = (): AnalysisResult => {
  const skinTypes: SkinType[] = ['dry', 'oily', 'combination', 'normal', 'sensitive'];
  const randomIndex = Math.floor(Math.random() * skinTypes.length);
  const skinType = skinTypes[randomIndex];
  
  // Define possible conditions for each skin type
  const conditionsByType: Record<SkinType, SkinCondition[]> = {
    dry: [
      {
        condition: 'Dryness',
        severity: 'high',
        confidence: 0.92,
        recommendations: [
          'Use a gentle, hydrating cleanser without sulfates',
          'Apply hydrating serum with hyaluronic acid',
          'Use an oil-based moisturizer to lock in hydration',
          'Consider using a humidifier in your bedroom'
        ]
      },
      {
        condition: 'Fine Lines',
        severity: 'moderate',
        confidence: 0.76,
        recommendations: [
          'Apply peptide serum to boost collagen production',
          'Use hydrating sheet masks 1-2x weekly',
          'Consider adding facial oils with omega fatty acids'
        ]
      },
      {
        condition: 'Flakiness',
        severity: 'mild',
        confidence: 0.65,
        recommendations: [
          'Gently exfoliate 1-2x weekly with a chemical exfoliant',
          'Apply thick cream or balm to flaky areas',
          'Avoid hot water which can strip skin oils'
        ]
      }
    ],
    oily: [
      {
        condition: 'Excess Sebum',
        severity: 'high',
        confidence: 0.88,
        recommendations: [
          'Use a foaming cleanser with salicylic acid',
          'Apply niacinamide serum to regulate oil production',
          'Use lightweight, oil-free moisturizers',
          'Try clay masks 1-2x weekly'
        ]
      },
      {
        condition: 'Acne',
        severity: 'moderate',
        confidence: 0.82,
        recommendations: [
          'Use benzoyl peroxide for inflammatory acne',
          'Apply salicylic acid to exfoliate pores',
          'Use non-comedogenic products only'
        ]
      },
      {
        condition: 'Enlarged Pores',
        severity: 'moderate',
        confidence: 0.79,
        recommendations: [
          'Use products with niacinamide to tighten pores',
          'Regular exfoliation to prevent clogging',
          'Consider retinol to improve skin texture'
        ]
      }
    ],
    combination: [
      {
        condition: 'T-Zone Oiliness',
        severity: 'moderate',
        confidence: 0.85,
        recommendations: [
          'Use different products for different facial zones',
          'Apply clay masks to T-zone only',
          'Focus hydrating products on drier areas'
        ]
      },
      {
        condition: 'Uneven Texture',
        severity: 'mild',
        confidence: 0.72,
        recommendations: [
          'Use gentle chemical exfoliants like PHAs',
          'Incorporate balancing ingredients like niacinamide',
          'Layer hydration in drier areas'
        ]
      },
      {
        condition: 'Occasional Breakouts',
        severity: 'low',
        confidence: 0.67,
        recommendations: [
          'Spot treat with salicylic acid or sulfur',
          'Avoid heavy products on acne-prone areas',
          'Keep hair products away from face'
        ]
      }
    ],
    normal: [
      {
        condition: 'Minor Dehydration',
        severity: 'mild',
        confidence: 0.65,
        recommendations: [
          'Maintain hydration with hyaluronic acid serums',
          'Use a balanced moisturizer day and night',
          'Focus on prevention and maintenance'
        ]
      },
      {
        condition: 'Early Signs of Aging',
        severity: 'low',
        confidence: 0.62,
        recommendations: [
          'Use antioxidants like vitamin C serum',
          'Incorporate retinol for prevention',
          'Maintain consistent UV protection'
        ]
      }
    ],
    sensitive: [
      {
        condition: 'Redness',
        severity: 'moderate',
        confidence: 0.81,
        recommendations: [
          'Use products with centella asiatica/madecassoside',
          'Avoid fragrances and essential oils',
          'Apply cooling/soothing masks regularly'
        ]
      },
      {
        condition: 'Irritation',
        severity: 'moderate',
        confidence: 0.78,
        recommendations: [
          'Use only gentle, minimal ingredient products',
          'Incorporate ceramides to strengthen skin barrier',
          'Avoid physical exfoliants and harsh actives'
        ]
      },
      {
        condition: 'Weakened Barrier',
        severity: 'high',
        confidence: 0.85,
        recommendations: [
          'Focus on barrier repair with ceramides and fatty acids',
          'Minimize skincare steps to basics only',
          'Avoid all active ingredients until healed'
        ]
      }
    ]
  };
  
  // Get conditions for selected skin type
  const possibleConditions = conditionsByType[skinType];
  
  // Add 1-2 random conditions from other skin types for realism
  const otherSkinTypes = skinTypes.filter(type => type !== skinType);
  const randomOtherType = otherSkinTypes[Math.floor(Math.random() * otherSkinTypes.length)];
  const randomOtherConditions = conditionsByType[randomOtherType];
  
  // Pick 1-2 random conditions from the other type
  const numRandomConditions = Math.floor(Math.random() * 2) + 1;
  const randomConditions = randomOtherConditions
    .sort(() => Math.random() - 0.5)
    .slice(0, numRandomConditions)
    .map(condition => ({
      ...condition,
      confidence: condition.confidence * 0.7, // Lower confidence for non-matching skin type
      severity: condition.severity === 'high' ? 'moderate' : (condition.severity === 'moderate' ? 'low' : 'mild')
    }));
  
  // Combine conditions and sort by confidence
  const combinedConditions = [...possibleConditions, ...randomConditions]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // Take top 3 conditions
  
  // Create overall description
  const overallDescriptions: Record<SkinType, string[]> = {
    dry: [
      'Your skin shows signs of dehydration and lacks natural oils.',
      'Your skin barrier appears weakened, leading to moisture loss.',
      'Your skin needs more hydration and protection against environmental stressors.'
    ],
    oily: [
      'Your skin produces excess sebum, especially in the T-zone area.',
      'Your pores appear congested with oil and debris in some areas.',
      'Your skin produces more natural oils than needed, which may lead to shine and breakouts.'
    ],
    combination: [
      'Your skin shows a mix of oily and dry areas, with more oil production in the T-zone.',
      'Your forehead, nose and chin appear oilier, while cheeks show some dryness.',
      'Your skin has different needs in different areas, requiring a balanced approach.'
    ],
    normal: [
      'Your skin appears balanced with good circulation and even texture.',
      'Your skin generally looks healthy with good elasticity and hydration.',
      'Your skin has minimal concerns and just needs maintenance and protection.'
    ],
    sensitive: [
      'Your skin shows signs of reactivity with some redness and irritation.',
      'Your skin barrier appears compromised, making it more reactive to products.',
      'Your skin is prone to inflammation and needs gentle, soothing care.'
    ]
  };
  
  const randomDescriptionIndex = Math.floor(Math.random() * overallDescriptions[skinType].length);
  const overall = overallDescriptions[skinType][randomDescriptionIndex];
  
  // Create and return the analysis result
  return {
    skinType,
    overall,
    conditions: combinedConditions,
    usedAdvancedModels: false
  };
};

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
