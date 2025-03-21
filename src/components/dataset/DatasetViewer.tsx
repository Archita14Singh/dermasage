
import React, { useState, useEffect } from 'react';
import { Edit, Plus } from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dataset, DatasetImage } from '@/types/dataset';
import DatasetService from '@/services/DatasetService';
import { toast } from 'sonner';

// Import refactored components
import DatasetImageGrid from './DatasetImageGrid';
import DatasetDetailsTable from './DatasetDetailsTable';
import EditDatasetDialog from './EditDatasetDialog';
import AddImageDialog from './AddImageDialog';
import ImageDetailsDialog from './ImageDetailsDialog';
import EmptyDatasetView from './EmptyDatasetView';

interface DatasetViewerProps {
  dataset: Dataset;
  onDatasetUpdated: () => void;
}

const DatasetViewer: React.FC<DatasetViewerProps> = ({ 
  dataset, 
  onDatasetUpdated 
}) => {
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(dataset.name);
  const [editedDescription, setEditedDescription] = useState(dataset.description);
  const [selectedImage, setSelectedImage] = useState<DatasetImage | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  
  useEffect(() => {
    setEditedName(dataset.name);
    setEditedDescription(dataset.description);
  }, [dataset]);
  
  const handleSaveEdit = () => {
    if (editedName.trim()) {
      DatasetService.updateDataset(dataset.id, {
        name: editedName.trim(),
        description: editedDescription.trim()
      });
      
      onDatasetUpdated();
      setIsEditDialogOpen(false);
    }
  };
  
  const handleAddImage = () => {
    if (!uploadedImage || !newImageLabel.trim()) {
      toast.error('Please upload an image and provide a label');
      return;
    }
    
    try {
      DatasetService.addImageToDataset(
        dataset.id,
        uploadedImage,
        newImageLabel.trim(),
        newImageCondition.trim() || undefined,
        newImageSeverity as 'low' | 'moderate' | 'high' | undefined
      );
      
      toast.success('Image added successfully');
      resetImageForm();
      onDatasetUpdated();
      setIsAddImageDialogOpen(false);
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image to dataset');
    }
  };
  
  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to remove this image from the dataset?')) {
      DatasetService.removeImageFromDataset(dataset.id, imageId);
      onDatasetUpdated();
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    }
  };
  
  const resetImageForm = () => {
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('');
    setSelectedFile(undefined);
  };
  
  const handleOpenAddImageDialog = () => {
    resetImageForm();
    setIsAddImageDialogOpen(true);
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setIsAddImageDialogOpen(true);
  };
  
  return (
    <Card className="h-full flex flex-col glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{dataset.name}</CardTitle>
          <CardDescription>
            {dataset.images.length} images • Last updated {dataset.updatedAt.toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" onClick={handleOpenAddImageDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <Tabs defaultValue="grid" className="h-full flex flex-col">
          <div className="px-6 pt-2 pb-0">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="details">Details View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="flex-1 p-6 pt-4">
            {dataset.images.length === 0 ? (
              <EmptyDatasetView 
                onAddImage={handleOpenAddImageDialog} 
                onFileSelected={handleFileSelected}
              />
            ) : (
              <DatasetImageGrid 
                images={dataset.images}
                onImageSelect={setSelectedImage}
                onImageDelete={handleDeleteImage}
              />
            )}
          </TabsContent>
          
          <TabsContent value="details" className="flex-1 p-6 pt-4">
            {dataset.images.length === 0 ? (
              <EmptyDatasetView 
                onAddImage={handleOpenAddImageDialog}
                onFileSelected={handleFileSelected}
              />
            ) : (
              <DatasetDetailsTable 
                images={dataset.images}
                onImageDelete={handleDeleteImage}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Dialogs */}
      <EditDatasetDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        name={editedName}
        setName={setEditedName}
        description={editedDescription}
        setDescription={setEditedDescription}
        onSave={handleSaveEdit}
      />
      
      <AddImageDialog
        open={isAddImageDialogOpen}
        onOpenChange={setIsAddImageDialogOpen}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        label={newImageLabel}
        setLabel={setNewImageLabel}
        condition={newImageCondition}
        setCondition={setNewImageCondition}
        severity={newImageSeverity}
        setSeverity={setNewImageSeverity}
        onSave={handleAddImage}
        onCancel={() => {
          setIsAddImageDialogOpen(false);
          resetImageForm();
        }}
        initialFile={selectedFile}
      />
      
      <ImageDetailsDialog
        selectedImage={selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        onDelete={handleDeleteImage}
      />
    </Card>
  );
};

export default DatasetViewer;
