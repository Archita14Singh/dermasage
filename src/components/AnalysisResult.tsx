
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, ThermometerSun, CloudRain, Wind } from 'lucide-react';
import { EnvironmentalFactor } from '@/utils/skinAnalysis';

interface AnalysisResultProps {
  results: any; // Using any for prototype purposes
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ results }) => {
  const { skinType, overall, conditions = [], usedAdvancedModels = false } = results;
  
  // Get the top conditions sorted by confidence
  const sortedConditions = [...conditions].sort((a, b) => b.confidence - a.confidence);
  
  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      case 'mild': return 'outline';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };
  
  // Generate icon for environmental factor
  const getEnvironmentalIcon = (factor: string) => {
    if (factor.toLowerCase().includes('humid')) return <Droplets className="h-5 w-5 text-blue-500" />;
    if (factor.toLowerCase().includes('uv')) return <ThermometerSun className="h-5 w-5 text-amber-500" />;
    if (factor.toLowerCase().includes('pollut')) return <Wind className="h-5 w-5 text-slate-500" />;
    return <CloudRain className="h-5 w-5 text-indigo-500" />;
  };
  
  // Get impact color for environmental factors
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="conditions">Conditions</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      {/* Summary Tab */}
      <TabsContent value="summary" className="space-y-4">
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Skin Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className="px-3 py-1 capitalize">{skinType}</Badge>
                {usedAdvancedModels && (
                  <Badge variant="outline" className="bg-skin-purple/10 text-skin-purple">
                    Advanced Analysis
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-3">{overall}</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Top Concerns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedConditions.slice(0, 3).map((condition, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{condition.condition}</span>
                    <Badge variant={getSeverityColor(condition.severity)} className="capitalize">
                      {condition.severity}
                    </Badge>
                  </div>
                  <Progress value={condition.confidence * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Environmental Factors */}
          {results.environmentalFactors && results.environmentalFactors.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Environmental Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.environmentalFactors.map((factor: EnvironmentalFactor, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEnvironmentalIcon(factor.factor)}
                      <span>{factor.factor}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getImpactColor(factor.impact)} border-current`}
                    >
                      {factor.impact} impact
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Conditions Tab */}
      <TabsContent value="conditions" className="space-y-4">
        {sortedConditions.map((condition, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{condition.condition}</CardTitle>
                <Badge variant={getSeverityColor(condition.severity)} className="capitalize">
                  {condition.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Confidence:</span>
                <Progress value={condition.confidence * 100} className="h-2 flex-grow" />
                <span>{Math.round(condition.confidence * 100)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground">
                {getConditionDescription(condition.condition, condition.severity)}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
        
        {/* Display advanced model results if available */}
        {results.usedAdvancedModels && results.detectedObjects && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.detectedObjects.map((obj: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{obj.label}</span>
                  <div className="flex items-center gap-2">
                    {obj.count && <span className="text-sm text-muted-foreground">{obj.count} detected</span>}
                    <Badge variant="outline">{Math.round(obj.confidence * 100)}% confidence</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Recommendations Tab */}
      <TabsContent value="recommendations" className="space-y-4">
        {sortedConditions.map((condition, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">For {condition.condition}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {condition.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        
        {/* Environmental recommendations */}
        {results.environmentalFactors && results.environmentalFactors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Environmental Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.environmentalFactors.map((factor: EnvironmentalFactor, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getEnvironmentalIcon(factor.factor)}
                    <span className="font-medium">{factor.factor}</span>
                  </div>
                  <ul className="space-y-1 list-disc pl-8">
                    {factor.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

// Helper function to get descriptions for conditions
function getConditionDescription(condition: string, severity: string): string {
  const conditions: Record<string, Record<string, string>> = {
    "Acne": {
      high: "Significant inflammatory acne with multiple papules, pustules, and possibly nodules requiring targeted treatment.",
      moderate: "Several acne lesions including whiteheads, blackheads, and some inflammatory spots.",
      mild: "Occasional breakouts with a few comedones and minimal inflammation.",
      low: "Very minor breakouts, primarily small comedones with little to no inflammation."
    },
    "Dryness": {
      high: "Severe lack of moisture causing flakiness, tightness, and potential cracking of the skin.",
      moderate: "Noticeable dryness with some flaking and occasional tightness.",
      mild: "Slight dryness, particularly after washing or in certain facial areas.",
      low: "Minimal dryness that's only occasionally noticeable."
    },
    "Hyperpigmentation": {
      high: "Significant dark spots and uneven tone covering multiple areas of the face.",
      moderate: "Noticeable dark spots or patches in several areas.",
      mild: "A few small areas of discoloration or post-inflammatory marks.",
      low: "Very minor, barely noticeable spots of discoloration."
    },
    "Redness": {
      high: "Persistent, significant redness across large areas of the face that may indicate rosacea or inflammation.",
      moderate: "Noticeable redness in several areas that may worsen with triggers.",
      mild: "Occasional flushing or mild redness, typically in the cheeks or nose.",
      low: "Very slight redness that's only noticeable occasionally."
    }
  };
  
  // Return description if available, otherwise a default message
  return conditions[condition]?.[severity.toLowerCase()] || 
    `${severity.charAt(0).toUpperCase() + severity.slice(1)} level of ${condition.toLowerCase()} detected.`;
}

export default AnalysisResult;
