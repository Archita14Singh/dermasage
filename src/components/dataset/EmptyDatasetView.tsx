
import React from 'react';
import { InfoIcon, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDatasetViewProps {
  onAddImage: () => void;
}

const EmptyDatasetView: React.FC<EmptyDatasetViewProps> = ({ onAddImage }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <InfoIcon className="w-8 h-8 text-primary/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        This dataset doesn't have any images. Add some images to start building your dataset.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onAddImage}
          className="bg-white border border-input hover:bg-secondary text-foreground shadow-subtle"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Image
        </Button>
        <Button onClick={onAddImage}>
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </div>
    </div>
  );
};

export default EmptyDatasetView;
