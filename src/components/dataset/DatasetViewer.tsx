
import React, { useState, useEffect } from 'react';
import { 
  Card
} from '@/components/ui/card';
import { Dataset, DatasetImage } from '@/types/dataset';
import DatasetService from '@/services/DatasetService';

// Import refactored components
import EditDatasetDialog from './EditDatasetDialog';
import AddImageDialog from './AddImageDialog';
import ImageDetailsDialog from './ImageDetailsDialog';
import DatasetHeader from './DatasetHeader';
import DatasetContent from './DatasetContent';
import { useImageForm } from '@/hooks/useImageForm';

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
  
  const {
    uploadedImage,
    setUploadedImage,
    newImageLabel,
    setNewImageLabel,
    newImageCondition,
    setNewImageCondition,
    newImageSeverity,
    setNewImageSeverity,
    selectedFile,
    setSelectedFile,
    resetForm,
    handleAddImage
  } = useImageForm(dataset.id, onDatasetUpdated);
  
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
  
  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to remove this image from the dataset?')) {
      DatasetService.removeImageFromDataset(dataset.id, imageId);
      onDatasetUpdated();
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    }
  };
  
  const handleOpenAddImageDialog = () => {
    resetForm();
    setIsAddImageDialogOpen(true);
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setIsAddImageDialogOpen(true);
  };
  
  return (
    <Card className="h-full flex flex-col glass-card">
      <DatasetHeader
        dataset={dataset}
        onEditClick={() => setIsEditDialogOpen(true)}
        onAddImageClick={handleOpenAddImageDialog}
      />
      
      <DatasetContent
        images={dataset.images}
        onImageSelect={setSelectedImage}
        onImageDelete={handleDeleteImage}
        onAddImage={handleOpenAddImageDialog}
        onFileSelected={handleFileSelected}
      />
      
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
          resetForm();
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
