
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

export type ConditionSeverity = 'low' | 'mild' | 'moderate' | 'high';

export type AcneType = 'hormonal' | 'cystic' | 'comedonal' | 'fungal';

export type ImpactLevel = 'high' | 'medium' | 'low';

export interface EnvironmentalFactor {
  factor: string;
  impact: ImpactLevel;
  recommendations: string[];
}

export interface SkinCondition {
  condition: string;
  severity: ConditionSeverity;
  confidence: number;
  recommendations: string[];
}

export interface DetectedObject {
  label: string;
  confidence: number;
  count?: number;
}

export interface WrinkleTypes {
  deep_wrinkles?: number;
  crow_feet?: number;
  nasolabial_folds?: number;
}

export interface PigmentationTypes {
  melasma?: number;
  post_inflammatory?: number;
  sun_spots?: number;
}

export interface AnalysisResult {
  skinType: SkinType;
  overall: string;
  conditions: SkinCondition[];
  usedAdvancedModels?: boolean;
  detectedObjects?: DetectedObject[];
  acneTypes?: {
    [key in AcneType]?: number;
  };
  wrinkleTypes?: WrinkleTypes;
  pigmentationTypes?: PigmentationTypes;
  environmentalFactors?: EnvironmentalFactor[];
}
