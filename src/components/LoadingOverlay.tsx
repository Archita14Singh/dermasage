
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Processing", 
  subMessage 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs text-white rounded-xl z-10">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <div className="flex">
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
      </div>
      {subMessage && (
        <p className="text-sm text-white/80 mt-4 max-w-sm text-center">
          {subMessage}
        </p>
      )}
    </div>
  );
};

export default LoadingOverlay;
