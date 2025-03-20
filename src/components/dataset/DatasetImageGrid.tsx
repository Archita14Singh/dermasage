
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatasetImage } from '@/types/dataset';

interface DatasetImageGridProps {
  images: DatasetImage[];
  onImageSelect: (image: DatasetImage) => void;
  onImageDelete: (imageId: string) => void;
}

const DatasetImageGrid: React.FC<DatasetImageGridProps> = ({
  images,
  onImageSelect,
  onImageDelete
}) => {
  return (
    <ScrollArea className="h-[500px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden border">
            <img
              src={image.imageUrl}
              alt={image.label}
              className="w-full h-full object-cover"
              onClick={() => onImageSelect(image)}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageDelete(image.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate">
              {image.label}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DatasetImageGrid;
