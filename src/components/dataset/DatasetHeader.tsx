
import React from 'react';
import { Edit, Plus, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dataset } from '@/types/dataset';
import { formatDistanceToNow } from 'date-fns';

interface DatasetHeaderProps {
  dataset: Dataset;
  onEditClick: () => void;
  onAddImageClick: () => void;
  onTrainModelClick?: () => void; // Add this optional prop
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  dataset,
  onEditClick,
  onAddImageClick,
  onTrainModelClick
}) => {
  const imageCount = dataset.images.length;
  const lastUpdated = formatDistanceToNow(new Date(dataset.updatedAt), { addSuffix: true });
  
  return (
    <CardHeader className="border-b flex flex-row items-center justify-between py-4">
      <div className="space-y-1 flex-1">
        <CardTitle>{dataset.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {dataset.description || 'No description provided'}
        </CardDescription>
        <CardDescription>
          {imageCount} {imageCount === 1 ? 'image' : 'images'} • Last updated {lastUpdated}
        </CardDescription>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Edit
        </Button>
        {onTrainModelClick && (
          <Button variant="outline" size="sm" onClick={onTrainModelClick}>
            <Brain className="mr-2 h-3.5 w-3.5" />
            Train Model
          </Button>
        )}
        <Button size="sm" onClick={onAddImageClick}>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add Image
        </Button>
      </div>
    </CardHeader>
  );
};

export default DatasetHeader;
