
import { useState } from 'react';
import { DatasetImage } from '@/types/dataset';
import { toast } from 'sonner';
import DatasetService from '@/services/DatasetService';

export const useImageForm = (datasetId: string, onSuccess: () => void) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetForm = () => {
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('');
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
        setUploadedImage(e.target.result.toString());
        setSelectedFile(file);
      }
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleImageSelected = (imageData: string, file: File) => {
    setIsLoading(true);
    setSelectedFile(file);
    setUploadedImage(imageData);
    setIsLoading(false);
  };
  
  const handleAddImage = () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please upload an image and provide a label');
      return;
    }
    
    try {
      const result = DatasetService.addImageToDataset(
        datasetId,
        uploadedImage,
        newImageLabel.trim(),
        newImageCondition.trim() || undefined,
        newImageSeverity as 'low' | 'moderate' | 'high' | undefined
      );
      
      if (result) {
        toast.success('Image added successfully');
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image to dataset');
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
