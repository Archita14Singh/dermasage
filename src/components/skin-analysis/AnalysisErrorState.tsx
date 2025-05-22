
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisErrorStateProps {
  onReset: () => void;
}

const AnalysisErrorState: React.FC<AnalysisErrorStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-destructive/20 rounded-xl bg-destructive/5">
      <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
        <X className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
      <p className="text-muted-foreground mb-6">
        We couldn't analyze your image. Please try again with a different photo or adjust lighting conditions.
      </p>
      <Button onClick={onReset}>Try Again</Button>
    </div>
  );
};

export default AnalysisErrorState;
