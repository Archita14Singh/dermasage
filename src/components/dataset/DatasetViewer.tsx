
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
import TrainModelDialog from './TrainModelDialog';
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
  const [isTrainModelDialogOpen, setIsTrainModelDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(dataset.name);
  const [editedDescription, setEditedDescription] = useState(dataset.description);
  const [selectedImage, setSelectedImage] = useState<DatasetImage | null>(null);
  
  const imageFormOptions = {
    onSuccess: () => {
      console.log('Image added successfully, updating dataset');
      setIsAddImageDialogOpen(false);
      onDatasetUpdated();
    },
    saveFunction: (
      imageData: string,
      label: string,
      condition?: string,
      severity?: 'low' | 'moderate' | 'high',
      productInfo?: {
        hasProduct: boolean;
        productName?: string;
        productBrand?: string;
        productType?: string;
      }
    ) => {
      console.log("Saving image to dataset", { datasetId: dataset.id, label, productInfo });
      
      return DatasetService.addImageToDataset(
        dataset.id,
        imageData,
        label,
        condition,
        severity,
        productInfo
      );
    }
  };
  
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
    isLoading,
    hasProduct,
    setHasProduct,
    productName,
    setProductName,
    productBrand,
    setProductBrand,
    productType,
    setProductType,
    handleFileUpload,
    resetForm,
    handleAddImage
  } = useImageForm(imageFormOptions);
  
  useEffect(() => {
    setEditedName(dataset.name);
    setEditedDescription(dataset.description);
  }, [dataset]);
  
  const handleOpenAddImageDialog = () => {
    console.log("Opening add image dialog");
    resetForm();
    setIsAddImageDialogOpen(true);
  };

  const handleFileSelected = (file: File) => {
    console.log("File selected in DatasetViewer", file.name);
    setSelectedFile(file);
    setIsAddImageDialogOpen(true);
  };
  
  return (
    <Card className="h-full flex flex-col glass-card">
      <DatasetHeader
        dataset={dataset}
        onEditClick={() => setIsEditDialogOpen(true)}
        onAddImageClick={handleOpenAddImageDialog}
        onTrainModelClick={() => setIsTrainModelDialogOpen(true)}
      />
      
      <DatasetContent
        images={dataset.images}
        onImageSelect={setSelectedImage}
        onImageDelete={(imageId) => {
          if (window.confirm('Are you sure you want to remove this image from the dataset?')) {
            DatasetService.removeImageFromDataset(dataset.id, imageId);
            onDatasetUpdated();
            if (selectedImage?.id === imageId) {
              setSelectedImage(null);
            }
          }
        }}
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
        onSave={() => {
          if (editedName.trim()) {
            DatasetService.updateDataset(dataset.id, {
              name: editedName.trim(),
              description: editedDescription.trim()
            });
            
            onDatasetUpdated();
            setIsEditDialogOpen(false);
          }
        }}
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
        hasProduct={hasProduct}
        setHasProduct={setHasProduct}
        productName={productName}
        setProductName={setProductName}
        productBrand={productBrand}
        setProductBrand={setProductBrand}
        productType={productType}
        setProductType={setProductType}
        onSave={handleAddImage}
        onCancel={() => {
          console.log("Cancelling add image dialog");
          setIsAddImageDialogOpen(false);
          resetForm();
        }}
        initialFile={selectedFile}
        isLoading={isLoading}
        handleFileUpload={handleFileUpload}
      />
      
      <ImageDetailsDialog
        selectedImage={selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        onDelete={(imageId) => {
          if (window.confirm('Are you sure you want to remove this image from the dataset?')) {
            DatasetService.removeImageFromDataset(dataset.id, imageId);
            onDatasetUpdated();
            if (selectedImage?.id === imageId) {
              setSelectedImage(null);
            }
          }
        }}
      />
      
      <TrainModelDialog
        isOpen={isTrainModelDialogOpen}
        onOpenChange={setIsTrainModelDialogOpen}
        dataset={dataset}
        onModelTrained={onDatasetUpdated}
      />
    </Card>
  );
};

export default DatasetViewer;
