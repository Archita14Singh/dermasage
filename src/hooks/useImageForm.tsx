
import { useState } from 'react';
import { DatasetImage } from '@/types/dataset';
import { toast } from 'sonner';
import DatasetService from '@/services/DatasetService';

export const useImageForm = (datasetId: string, onSuccess: () => void) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  
  const resetForm = () => {
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('');
    setSelectedFile(undefined);
  };
  
  const handleAddImage = () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please upload an image and provide a label');
      return;
    }
    
    try {
      DatasetService.addImageToDataset(
        datasetId,
        uploadedImage,
        newImageLabel.trim(),
        newImageCondition.trim() || undefined,
        newImageSeverity as 'low' | 'moderate' | 'high' | undefined
      );
      
      toast.success('Image added successfully');
      resetForm();
      onSuccess();
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
    resetForm,
    handleAddImage
  };
};
