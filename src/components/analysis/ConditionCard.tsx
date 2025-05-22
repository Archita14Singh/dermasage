
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SkinCondition } from '@/utils/skinAnalysis/types';
import SeverityBadge from './SeverityBadge';

interface ConditionCardProps {
  condition: SkinCondition;
}

const ConditionCard: React.FC<ConditionCardProps> = ({ condition }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{condition.condition}</CardTitle>
          <SeverityBadge severity={condition.severity} />
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

export default ConditionCard;
