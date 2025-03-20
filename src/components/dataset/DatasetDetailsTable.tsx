
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatasetImage } from '@/types/dataset';

interface DatasetDetailsTableProps {
  images: DatasetImage[];
  onImageDelete: (imageId: string) => void;
}

const DatasetDetailsTable: React.FC<DatasetDetailsTableProps> = ({
  images,
  onImageDelete
}) => {
  return (
    <ScrollArea className="h-[500px]">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4 font-medium">Preview</th>
            <th className="text-left py-2 px-4 font-medium">Label</th>
            <th className="text-left py-2 px-4 font-medium">Condition</th>
            <th className="text-left py-2 px-4 font-medium">Severity</th>
            <th className="text-left py-2 px-4 font-medium">Date Added</th>
            <th className="text-left py-2 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map(image => (
            <tr key={image.id} className="border-b hover:bg-muted/50">
              <td className="py-2 px-4">
                <div className="h-12 w-12 rounded overflow-hidden">
                  <img 
                    src={image.imageUrl} 
                    alt={image.label} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </td>
              <td className="py-2 px-4">{image.label}</td>
              <td className="py-2 px-4">{image.condition || '-'}</td>
              <td className="py-2 px-4">
                {image.severity ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    image.severity === 'high' ? 'bg-red-100 text-red-800' : 
                    image.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {image.severity}
                  </span>
                ) : '-'}
              </td>
              <td className="py-2 px-4">{image.dateAdded.toLocaleDateString()}</td>
              <td className="py-2 px-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => onImageDelete(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default DatasetDetailsTable;
