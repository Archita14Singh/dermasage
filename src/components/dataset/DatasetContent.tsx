
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatasetImage } from '@/types/dataset';
import DatasetImageGrid from './DatasetImageGrid';
import DatasetDetailsTable from './DatasetDetailsTable';
import EmptyDatasetView from './EmptyDatasetView';

interface DatasetContentProps {
  images: DatasetImage[];
  onImageSelect: (image: DatasetImage) => void;
  onImageDelete: (imageId: string) => void;
  onAddImage: () => void;
  onFileSelected: (file: File) => void;
}

const DatasetContent: React.FC<DatasetContentProps> = ({
  images,
  onImageSelect,
  onImageDelete,
  onAddImage,
  onFileSelected
}) => {
  return (
    <CardContent className="flex-1 p-0">
      <Tabs defaultValue="grid" className="h-full flex flex-col">
        <div className="px-6 pt-2 pb-0">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="details">Details View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="flex-1 p-6 pt-4">
          {images.length === 0 ? (
            <EmptyDatasetView 
              onAddImage={onAddImage} 
              onFileSelected={onFileSelected}
            />
          ) : (
            <DatasetImageGrid 
              images={images}
              onImageSelect={onImageSelect}
              onImageDelete={onImageDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="details" className="flex-1 p-6 pt-4">
          {images.length === 0 ? (
            <EmptyDatasetView 
              onAddImage={onAddImage}
              onFileSelected={onFileSelected}
            />
          ) : (
            <DatasetDetailsTable 
              images={images}
              onImageDelete={onImageDelete}
            />
          )}
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};

export default DatasetContent;
