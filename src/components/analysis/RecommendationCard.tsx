
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendationCardProps {
  title: string;
  recommendations: string[];
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, recommendations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc pl-5">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              {rec}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
