
import { Dataset, DatasetImage } from '@/types/dataset';
import { toast } from 'sonner';
import { BaseService } from './BaseService';

/**
 * Service for managing dataset images
 */
export class DatasetImageService extends BaseService<Dataset> {
  constructor() {
    super('skinwise_datasets');
  }
  
  /**
   * Add an image to a dataset
   */
  addImageToDataset(
    datasetId: string, 
    imageData: string, 
    label: string, 
    condition?: string, 
    severity?: 'low' | 'moderate' | 'high'
  ): DatasetImage | null {
    if (!datasetId || !imageData || !label.trim()) {
      toast.error('Missing required data for adding image');
      return null;
    }
    
    // Check if the image data is valid
    if (!imageData.startsWith('data:image/')) {
      toast.error('Invalid image format');
      return null;
    }
    
    try {
      const datasets = this.getAllItems();
      const datasetIndex = datasets.findIndex(d => d.id === datasetId);
      
      if (datasetIndex === -1) {
        toast.error('Dataset not found');
        return null;
      }
      
      const newImage: DatasetImage = {
        id: crypto.randomUUID(),
        imageUrl: imageData,
        label: label.trim(),
        condition: condition?.trim(),
        severity,
        dateAdded: new Date()
      };
      
      datasets[datasetIndex].images.push(newImage);
      datasets[datasetIndex].updatedAt = new Date();
      
      this.saveAllItems(datasets);
      toast.success('Image added to dataset');
      
      return newImage;
    } catch (error) {
      console.error('Error adding image to dataset:', error);
      toast.error('Failed to add image to dataset');
      return null;
    }
  }
  
  /**
   * Remove an image from a dataset
   */
  removeImageFromDataset(datasetId: string, imageId: string): boolean {
    if (!datasetId || !imageId) {
      toast.error('Missing dataset or image ID');
      return false;
    }
    
    const datasets = this.getAllItems();
    const datasetIndex = datasets.findIndex(d => d.id === datasetId);
    
    if (datasetIndex === -1) {
      toast.error('Dataset not found');
      return false;
    }
    
    const dataset = datasets[datasetIndex];
    const initialImageCount = dataset.images.length;
    
    dataset.images = dataset.images.filter(img => img.id !== imageId);
    
    if (dataset.images.length === initialImageCount) {
      toast.error('Image not found in dataset');
      return false;
    }
    
    dataset.updatedAt = new Date();
    this.saveAllItems(datasets);
    toast.success('Image removed from dataset');
    
    return true;
  }
}
