
import { useState } from 'react';
import { toast } from 'sonner';

interface UseImageFormOptions {
  onSuccess: () => void;
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

export const useImageForm = (options: UseImageFormOptions) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | '' | 'none'>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProduct, setHasProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productType, setProductType] = useState('');

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read image file');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('');
    setSelectedFile(null);
    setHasProduct(false);
    setProductName('');
    setProductBrand('');
    setProductType('');
  };

  const handleAddImage = () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please provide an image and label');
      return;
    }

    const productInfo = hasProduct ? {
      hasProduct: true,
      productName: productName.trim(),
      productBrand: productBrand.trim(),
      productType: productType
    } : { hasProduct: false };

    const result = options.saveFunction(
      uploadedImage,
      newImageLabel.trim(),
      newImageCondition.trim() || undefined,
      newImageSeverity === '' || newImageSeverity === 'none' ? undefined : newImageSeverity,
      productInfo
    );

    if (result) {
      resetForm();
      options.onSuccess();
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
