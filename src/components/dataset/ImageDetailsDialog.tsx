
import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatasetImage } from '@/types/dataset';

interface ImageDetailsDialogProps {
  selectedImage: DatasetImage | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (imageId: string) => void;
}

const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({
  selectedImage,
  onOpenChange,
  onDelete
}) => {
  if (!selectedImage) return null;
  
  return (
    <Dialog open={!!selectedImage} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedImage.label}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md overflow-hidden max-h-[60vh]">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.label}
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            {selectedImage.condition && (
              <div>
                <p className="text-sm font-medium">Condition</p>
                <p>{selectedImage.condition}</p>
              </div>
            )}
            
            {selectedImage.severity && (
              <div>
                <p className="text-sm font-medium">Severity</p>
                <p className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  selectedImage.severity === 'high' ? 'bg-red-100 text-red-800' : 
                  selectedImage.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedImage.severity}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium">Date Added</p>
              <p>{selectedImage.dateAdded.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={() => {
              onDelete(selectedImage.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove from Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;
