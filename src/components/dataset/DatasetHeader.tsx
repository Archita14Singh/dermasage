
import React from 'react';
import { Edit, Plus } from 'lucide-react';
import { 
  CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dataset } from '@/types/dataset';

interface DatasetHeaderProps {
  dataset: Dataset;
  onEditClick: () => void;
  onAddImageClick: () => void;
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({ 
  dataset, 
  onEditClick, 
  onAddImageClick 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle>{dataset.name}</CardTitle>
        <CardDescription>
          {dataset.images.length} images • Last updated {dataset.updatedAt.toLocaleDateString()}
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button size="sm" onClick={onAddImageClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>
    </CardHeader>
  );
};

export default DatasetHeader;
