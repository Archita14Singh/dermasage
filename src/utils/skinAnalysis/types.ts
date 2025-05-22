
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

export type ConditionSeverity = 'low' | 'mild' | 'moderate' | 'high';

export type AcneType = 'hormonal' | 'cystic' | 'comedonal' | 'fungal';

export interface EnvironmentalFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
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

export interface AnalysisResult {
  skinType: SkinType;
  overall: string;
  conditions: SkinCondition[];
  usedAdvancedModels?: boolean;
  detectedObjects?: DetectedObject[];
  acneTypes?: {
    [key in AcneType]?: number;
  };
  environmentalFactors?: EnvironmentalFactor[];
}
