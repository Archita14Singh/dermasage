
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadSectionProps {
  uploadedImage: string | null;
  setUploadedImage: (data: string | null) => void;
  isLoading: boolean;
  handleFileUpload: (file: File) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadedImage,
  setUploadedImage,
  isLoading,
  handleFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Upload Image
      </label>
      {isLoading ? (
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-xl bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Processing image...</span>
        </div>
      ) : uploadedImage ? (
        <div className="relative rounded-lg overflow-hidden bg-white">
          <img
            src={uploadedImage}
            alt="Preview"
            className="max-h-48 w-auto mx-auto object-contain rounded-lg"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full bg-white/80 shadow-sm hover:bg-white"
            onClick={() => setUploadedImage(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 bg-white/50">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload your image</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Select or take a photo to add to your dataset
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleUploadClick}
              className="bg-white border border-input hover:bg-secondary text-foreground shadow-subtle"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
            <Button onClick={handleTakePhoto}>
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};

export default ImageUploadSection;
