
// Types for skin analysis results and conditions

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
