
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
        }
      ],
      overall: 'Your skin shows signs of combination type with some inflammatory concerns. The primary issues appear to be acne and dryness, with moderate redness. A consistent skincare routine would help address these concerns.',
      skinType: 'Combination',
      usedAdvancedModels: false
    };
    
    // Try to wait for advanced models to load, with a timeout
    try {
      await Promise.all([
        Promise.race([loadYolo, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))]),
        Promise.race([loadCnn, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))])
      ]);
      
      // If we get here, both advanced models loaded successfully
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
      
      toast.success('Advanced analysis complete', {
        description: 'Enhanced skin analysis with CNN and YOLO models applied successfully'
      });
    } catch (error) {
      console.log('Advanced models could not be loaded in time, using basic analysis only');
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
