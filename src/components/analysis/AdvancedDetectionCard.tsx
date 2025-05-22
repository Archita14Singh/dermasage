
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetectedObject } from '@/utils/skinAnalysis/types';

interface AdvancedDetectionCardProps {
  detectedObjects: DetectedObject[];
}

const AdvancedDetectionCard: React.FC<AdvancedDetectionCardProps> = ({ detectedObjects }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Advanced Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {detectedObjects.map((obj, idx) => (
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
  );
};

export default AdvancedDetectionCard;
