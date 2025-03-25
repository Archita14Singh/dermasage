
import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ImageUploaderProps {
  onImageSelected: (imageData: string, file: File) => void;
  onReset?: () => void;
  showPreview?: boolean;
  previewImage?: string | null;
  isLoading?: boolean;
  className?: string;
  dragAndDrop?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onReset,
  showPreview = false,
  previewImage = null,
  isLoading = false,
  className,
  dragAndDrop = true,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    console.log("Processing file in ImageUploader", file.name);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        console.log("File read successful in ImageUploader");
        onImageSelected(e.target.result.toString(), file);
      }
    };
    
    reader.onerror = () => {
      console.error("Error reading file in ImageUploader");
      toast.error('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };
  
  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-xl bg-white/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Processing image...</span>
      </div>
    );
  }
  
  if (showPreview && previewImage) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-white">
        <img
          src={previewImage}
          alt="Preview"
          className="max-h-48 w-auto mx-auto object-contain rounded-lg"
        />
        {onReset && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full bg-white/80 shadow-sm hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              onReset();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 bg-white/50",
        dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
        <Upload className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">Upload your image</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {dragAndDrop ? 
          "Drag and drop your photo here, or click the buttons below to upload or take a picture" : 
          "Select or take a photo to upload"}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSelectImage}
          className="bg-white border border-input hover:bg-secondary text-foreground shadow-subtle"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Image
        </Button>
        <Button onClick={handleCapture}>
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </div>
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

export default ImageUploader;
