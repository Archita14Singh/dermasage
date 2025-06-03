
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import ImageMetadataForm from './ImageMetadataForm';

interface AddImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadedImage: string | null;
  setUploadedImage: (data: string | null) => void;
  label: string;
  setLabel: (label: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  severity: 'low' | 'moderate' | 'high' | '' | 'none';
  setSeverity: (severity: 'low' | 'moderate' | 'high' | '' | 'none') => void;
  onSave: () => void;
  onCancel: () => void;
  initialFile?: File | null;
  isLoading?: boolean;
  handleFileUpload?: (file: File) => void;
  // New product-related props
  hasProduct?: boolean;
  setHasProduct?: (hasProduct: boolean) => void;
  productName?: string;
  setProductName?: (productName: string) => void;
  productBrand?: string;
  setProductBrand?: (productBrand: string) => void;
  productType?: string;
  setProductType?: (productType: string) => void;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({
  open,
  onOpenChange,
  uploadedImage,
  setUploadedImage,
  label,
  setLabel,
  condition,
  setCondition,
  severity,
  setSeverity,
  onSave,
  onCancel,
  initialFile,
  isLoading = false,
  handleFileUpload,
  hasProduct = false,
  setHasProduct,
  productName = '',
  setProductName,
  productBrand = '',
  setProductBrand,
  productType = '',
  setProductType
}) => {
  useEffect(() => {
    // Process initial file if provided
    if (initialFile && open && handleFileUpload) {
      console.log("Processing initial file in AddImageDialog");
      handleFileUpload(initialFile);
    }
  }, [open, initialFile, handleFileUpload]);
  
  const handleImageSelected = (imageData: string, file: File) => {
    console.log("Image selected in AddImageDialog");
    if (handleFileUpload) {
      handleFileUpload(file);
    } else {
      setUploadedImage(imageData);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Image to Dataset</DialogTitle>
          <DialogDescription>
            Upload an image and provide details to add it to your dataset for training.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ImageUploader
            onImageSelected={handleImageSelected}
            showPreview={!!uploadedImage}
            previewImage={uploadedImage}
            isLoading={isLoading}
            onReset={() => setUploadedImage(null)}
          />
          
          <ImageMetadataForm
            label={label}
            setLabel={setLabel}
            condition={condition}
            setCondition={setCondition}
            severity={severity}
            setSeverity={setSeverity}
            hasProduct={hasProduct}
            setHasProduct={setHasProduct}
            productName={productName}
            setProductName={setProductName}
            productBrand={productBrand}
            setProductBrand={setProductBrand}
            productType={productType}
            setProductType={setProductType}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            disabled={!uploadedImage || !label.trim() || isLoading}
          >
            Add to Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageDialog;
