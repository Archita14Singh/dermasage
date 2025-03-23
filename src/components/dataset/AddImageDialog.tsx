
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
import { toast } from 'sonner';
import { Camera, Upload, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Process initial file if provided
    if (initialFile && open && handleFileUpload) {
      handleFileUpload(initialFile);
    }
  }, [open, initialFile, handleFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && handleFileUpload) {
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
