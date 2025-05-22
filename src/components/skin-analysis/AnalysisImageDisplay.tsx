
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingOverlay from '@/components/LoadingOverlay';

interface AnalysisImageDisplayProps {
  image: string | null;
  status: 'loading' | 'analyzing' | 'complete' | 'error';
  useCustomModel: boolean;
  handleReset?: () => void;
}

const AnalysisImageDisplay: React.FC<AnalysisImageDisplayProps> = ({
  image,
  status,
  useCustomModel,
  handleReset
}) => {
  const showLoadingOverlay = status === 'loading' || status === 'analyzing';
  const showResetButton = status === 'complete' && handleReset;
  
  return (
    <div className={`relative ${status === 'complete' ? 'aspect-square max-h-[400px]' : 'aspect-square max-h-[500px]'} rounded-xl overflow-hidden shadow-sm`}>
      {image && (
        <img
          src={image}
          alt={status === 'complete' ? "Analyzed skin" : "Uploaded skin"}
          className="w-full h-full object-cover"
        />
      )}
      
      {showLoadingOverlay && (
        <LoadingOverlay 
          message={status === 'loading' ? "Processing Image" : "Analyzing Skin Condition"}
          subMessage={status === 'analyzing' ? 
            useCustomModel ? 
              "Using your custom trained model to analyze your skin" : 
              "Our AI is analyzing your skin for acne, dryness, oiliness, redness, and pigmentation"
            : undefined}
        />
      )}
      
      {showResetButton && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 rounded-full bg-white/80 shadow-sm hover:bg-white"
          onClick={handleReset}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default AnalysisImageDisplay;
