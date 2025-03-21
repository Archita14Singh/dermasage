
import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '../ImageUpload';
import { toast } from 'sonner';

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
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset file input when dialog opens/closes
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [open]);

  const handleImageSelection = (data: string) => {
    if (!data) {
      toast.error("Failed to load image. Please try again.");
      return;
    }
    setUploadedImage(data);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Image to Dataset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload Image
            </label>
            <ImageUpload
              onImageSelected={handleImageSelection}
              onReset={() => setUploadedImage(null)}
              showPreview={!!uploadedImage}
              previewImage={uploadedImage}
              fileInputRef={fileInputRef}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image-label" className="text-sm font-medium">
              Image Label
            </label>
            <Input
              id="image-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Mild Acne"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="image-condition" className="text-sm font-medium">
                Skin Condition (optional)
              </label>
              <Input
                id="image-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., Acne"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image-severity" className="text-sm font-medium">
                Severity (optional)
              </label>
              <Select
                value={severity}
                onValueChange={(value) => setSeverity(value as 'low' | 'moderate' | 'high' | '')}
              >
                <SelectTrigger id="image-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            disabled={!uploadedImage || !label.trim()}
          >
            Add to Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageDialog;
