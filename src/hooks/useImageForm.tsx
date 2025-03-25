
import { useState } from 'react';
import { toast } from 'sonner';

export interface ImageFormOptions {
  onSuccess?: () => void;
  initialLabel?: string;
  initialCondition?: string;
  initialSeverity?: 'low' | 'moderate' | 'high' | '';
  saveFunction?: (
    imageData: string,
    label: string,
    condition?: string,
    severity?: 'low' | 'moderate' | 'high' | undefined
  ) => any;
}

export const useImageForm = (options: ImageFormOptions = {}) => {
  const {
    onSuccess,
    initialLabel = '',
    initialCondition = '',
    initialSeverity = '',
    saveFunction
  } = options;
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState(initialLabel);
  const [newImageCondition, setNewImageCondition] = useState(initialCondition);
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | ''>(initialSeverity);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetForm = () => {
    setUploadedImage(null);
    setNewImageLabel(initialLabel);
    setNewImageCondition(initialCondition);
    setNewImageSeverity(initialSeverity);
    setSelectedFile(null);
  };

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    
    if (!file) {
      setIsLoading(false);
      return;
    }

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      setIsLoading(false);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        console.log("File loaded successfully");
        setUploadedImage(e.target.result.toString());
        setSelectedFile(file);
      }
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      console.error("File reading error");
      toast.error('Error reading file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleImageSelected = (imageData: string, file: File) => {
    setIsLoading(true);
    try {
      console.log("Image selected", { fileSize: file.size, fileName: file.name });
      setSelectedFile(file);
      setUploadedImage(imageData);
    } catch (error) {
      console.error("Error in handleImageSelected", error);
      toast.error('Error processing image');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddImage = async () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please upload an image and provide a label');
      return;
    }
    
    try {
      if (saveFunction) {
        const result = await saveFunction(
          uploadedImage,
          newImageLabel.trim(),
          newImageCondition.trim() || undefined,
          newImageSeverity || undefined
        );
        
        if (result) {
          toast.success('Image added successfully');
          resetForm();
          onSuccess?.();
        }
      } else {
        console.warn('No save function provided to useImageForm');
        toast.success('Image processed successfully');
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to process image');
    }
  };
  
  return {
    uploadedImage,
    setUploadedImage,
    newImageLabel,
    setNewImageLabel,
    newImageCondition,
    setNewImageCondition,
    newImageSeverity,
    setNewImageSeverity,
    selectedFile,
    setSelectedFile,
    isLoading,
    handleFileUpload,
    handleImageSelected,
    resetForm,
    handleAddImage
  };
};
