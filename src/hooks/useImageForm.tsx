
import { useState } from 'react';
import { toast } from 'sonner';

interface ImageFormOptions {
  onSuccess?: () => void;
  saveFunction: (
    imageData: string,
    label: string,
    condition?: string,
    severity?: 'low' | 'moderate' | 'high',
    productInfo?: {
      hasProduct: boolean;
      productName?: string;
      productBrand?: string;
      productType?: string;
    }
  ) => any;
}

export const useImageForm = (options: ImageFormOptions) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | '' | 'none'>('none');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // New product-related states
  const [hasProduct, setHasProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productType, setProductType] = useState('');
  
  const handleFileUpload = async (file: File) => {
    console.log("Processing file upload:", file.name);
    setIsLoading(true);
    setSelectedFile(file);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log("File converted to base64");
        setUploadedImage(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file');
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    console.log("Resetting image form");
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('none');
    setSelectedFile(null);
    setHasProduct(false);
    setProductName('');
    setProductBrand('');
    setProductType('');
    setIsLoading(false);
  };
  
  const handleAddImage = async () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please provide an image and label');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const productInfo = hasProduct ? {
        hasProduct: true,
        productName: productName.trim(),
        productBrand: productBrand.trim(),
        productType: productType
      } : { hasProduct: false };
      
      const severityToSave = newImageSeverity === '' || newImageSeverity === 'none' ? undefined : newImageSeverity;
      
      const result = options.saveFunction(
        uploadedImage,
        newImageLabel.trim(),
        newImageCondition.trim() || undefined,
        severityToSave,
        productInfo
      );
      
      if (result) {
        resetForm();
        options.onSuccess?.();
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image');
    } finally {
      setIsLoading(false);
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
    hasProduct,
    setHasProduct,
    productName,
    setProductName,
    productBrand,
    setProductBrand,
    productType,
    setProductType,
    handleFileUpload,
    resetForm,
    handleAddImage
  };
};
