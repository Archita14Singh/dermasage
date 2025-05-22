
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SeverityBadgeProps {
  severity: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
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

  return (
    <Badge variant={getSeverityColor(severity)} className="capitalize">
      {severity}
    </Badge>
  );
};

export default SeverityBadge;
