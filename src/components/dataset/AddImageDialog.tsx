
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageUploadSection from './ImageUploadSection';
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
  severity: 'low' | 'moderate' | 'high' | '';
  setSeverity: (severity: 'low' | 'moderate' | 'high' | '') => void;
  onSave: () => void;
  onCancel: () => void;
  initialFile?: File | null;
  isLoading?: boolean;
  handleFileUpload?: (file: File) => void;
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
  handleFileUpload
}) => {
  useEffect(() => {
    // Process initial file if provided
    if (initialFile && open && handleFileUpload) {
      handleFileUpload(initialFile);
    }
  }, [open, initialFile, handleFileUpload]);
  
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Image to Dataset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {handleFileUpload && (
            <ImageUploadSection
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              isLoading={isLoading}
              handleFileUpload={handleFileUpload}
            />
          )}
          
          <ImageMetadataForm
            label={label}
            setLabel={setLabel}
            condition={condition}
            setCondition={setCondition}
            severity={severity}
            setSeverity={setSeverity}
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
