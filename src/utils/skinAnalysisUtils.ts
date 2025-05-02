
import { toast } from 'sonner';
import { loadSkinAnalysisModel, ensureModelLoaded } from './modelLoader';

// In a production app, this would use a real ML model for analysis
// For the prototype, we'll return simulated results

export type SkinCondition = {
  condition: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high';
  recommendations: string[];
};

export type AcneType = 'papules' | 'pustules' | 'nodular' | 'cystic' | 'comedonal' | 'hormonal' | 'fungal';

export type WrinkleType = 'fine_lines' | 'deep_wrinkles' | 'crow_feet' | 'nasolabial_folds' | 'forehead_lines';

export type PigmentationType = 'melasma' | 'post_inflammatory' | 'sun_spots' | 'freckles' | 'age_spots';

export type SkinTextureType = 'rough' | 'smooth' | 'uneven' | 'bumpy' | 'scaly' | 'dehydrated';

export type PoreType = 'enlarged' | 'clogged' | 'normal' | 'minimal';

export type DetectedObject = {
  label: string;
  confidence: number;
  position: { x: number, y: number, width: number, height: number };
};

export type AnalysisResult = {
  conditions: SkinCondition[];
  overall: string;
  skinType: string;
  // Advanced model outputs
  acneTypes?: Record<AcneType, number>; // From CNN classification
  wrinkleTypes?: Record<WrinkleType, number>; // From wrinkle detection model
  pigmentationTypes?: Record<PigmentationType, number>; // From pigmentation analysis
  skinTextureTypes?: Record<SkinTextureType, number>; // From texture analysis
  poreTypes?: Record<PoreType, number>; // From pore analysis
  detectedObjects?: DetectedObject[]; // From YOLO detection
  usedAdvancedModels?: boolean;
};

export const analyzeSkinCondition = async (imageData: string): Promise<AnalysisResult> => {
  console.log('Analyzing skin condition...');
  
  try {
    // First load the general model
    await loadSkinAnalysisModel('general');
    
    // Try to load advanced models (but don't block analysis if they fail)
    const loadYolo = loadSkinAnalysisModel('yolo-detection');
    const loadCnn = loadSkinAnalysisModel('cnn-classification');
    const loadWrinkle = loadSkinAnalysisModel('wrinkle-detection');
    const loadPigment = loadSkinAnalysisModel('pigmentation-analysis');
    const loadTexture = loadSkinAnalysisModel('skin-texture-analysis');
    const loadPore = loadSkinAnalysisModel('pore-analysis');
    
    // For prototype, return mock data
    // In production, this would process the image with the ML models
    
    // Add some randomness for demo purposes
    const randomFactor = Math.random() * 0.2;
    
    const mockResult: AnalysisResult = {
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
            'Ensure you're using sufficient SPF daily to prevent further damage'
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
    
    // Try to wait for advanced models to load, with a timeout
    try {
      await Promise.all([
        Promise.race([loadYolo, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadCnn, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadWrinkle, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadPigment, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadTexture, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadPore, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))])
      ]);
      
      // If we get here, advanced models loaded successfully
      mockResult.usedAdvancedModels = true;
      
      // Add CNN model results - acne type classification
      mockResult.acneTypes = {
        papules: 0.15 + (Math.random() * 0.2),
        pustules: 0.25 + (Math.random() * 0.3),
        nodular: 0.05 + (Math.random() * 0.1),
        cystic: 0.08 + (Math.random() * 0.15),
        comedonal: 0.35 + (Math.random() * 0.3),
        hormonal: 0.20 + (Math.random() * 0.3),
        fungal: 0.02 + (Math.random() * 0.05)
      };
      
      // Add wrinkle analysis results
      mockResult.wrinkleTypes = {
        fine_lines: 0.4 + (Math.random() * 0.3),
        deep_wrinkles: 0.1 + (Math.random() * 0.15),
        crow_feet: 0.25 + (Math.random() * 0.2),
        nasolabial_folds: 0.3 + (Math.random() * 0.25),
        forehead_lines: 0.35 + (Math.random() * 0.25)
      };
      
      // Add pigmentation analysis results
      mockResult.pigmentationTypes = {
        melasma: 0.15 + (Math.random() * 0.2),
        post_inflammatory: 0.3 + (Math.random() * 0.25),
        sun_spots: 0.4 + (Math.random() * 0.3),
        freckles: 0.35 + (Math.random() * 0.25),
        age_spots: 0.2 + (Math.random() * 0.15)
      };
      
      // Add skin texture analysis results
      mockResult.skinTextureTypes = {
        rough: 0.3 + (Math.random() * 0.25),
        smooth: 0.4 + (Math.random() * 0.25),
        uneven: 0.35 + (Math.random() * 0.25),
        bumpy: 0.2 + (Math.random() * 0.2),
        scaly: 0.15 + (Math.random() * 0.15),
        dehydrated: 0.25 + (Math.random() * 0.25)
      };
      
      // Add pore analysis results
      mockResult.poreTypes = {
        enlarged: 0.4 + (Math.random() * 0.3),
        clogged: 0.35 + (Math.random() * 0.25),
        normal: 0.2 + (Math.random() * 0.15),
        minimal: 0.05 + (Math.random() * 0.1)
      };
      
      // Add YOLO model results - object detection 
      mockResult.detectedObjects = [
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
      ];
      
      // Update the overall analysis based on advanced model results
      let primaryAcneType = "";
      let maxConfidence = 0;
      
      for (const [type, confidence] of Object.entries(mockResult.acneTypes)) {
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          primaryAcneType = type;
        }
      }
      
      // Enhanced analysis with acne classification
      if (primaryAcneType) {
        // Find the acne condition and update it
        const acneCondition = mockResult.conditions.find(c => c.condition === 'Acne');
        if (acneCondition) {
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
      }
      
      // Update wrinkle recommendations if needed
      let primaryWrinkleType = "";
      maxConfidence = 0;
      
      if (mockResult.wrinkleTypes) {
        for (const [type, confidence] of Object.entries(mockResult.wrinkleTypes)) {
          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            primaryWrinkleType = type;
          }
        }
        
        // Find or add wrinkle condition
        const wrinkleCondition = mockResult.conditions.find(c => c.condition === 'Fine Lines');
        if (wrinkleCondition && primaryWrinkleType) {
          // Update condition name based on primary type
          if (primaryWrinkleType === 'deep_wrinkles') {
            wrinkleCondition.condition = 'Deep Wrinkles';
            wrinkleCondition.recommendations = [
              'Consider professional treatments like microneedling or laser',
              'Use high-concentration retinoids (consult a dermatologist)',
              'Add peptide serums to support collagen production',
              'Ensure you're using a high SPF sunscreen daily'
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
      }
      
      // Update pigmentation recommendations
      let primaryPigmentType = "";
      maxConfidence = 0;
      
      if (mockResult.pigmentationTypes) {
        for (const [type, confidence] of Object.entries(mockResult.pigmentationTypes)) {
          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            primaryPigmentType = type;
          }
        }
        
        // Find pigmentation condition
        const pigmentCondition = mockResult.conditions.find(c => c.condition === 'Hyperpigmentation');
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
      }
      
      toast.success('Advanced analysis complete', {
        description: 'Enhanced skin analysis with multiple advanced models applied successfully'
      });
    } catch (error) {
      console.log('Some advanced models could not be loaded in time, using partial advanced analysis');
    }
    
    console.log('Analysis complete:', mockResult);
    return mockResult;
  } catch (error) {
    console.error('Error analyzing skin condition:', error);
    toast.error('An error occurred during skin analysis. Please try again.');
    throw new Error('Analysis failed');
  }
};

export const preprocessImage = (imageData: string): string => {
  // In a real app, this would preprocess the image for better analysis
  // For the prototype, we'll just return the original image
  console.log('Preprocessing image...');
  return imageData;
};
