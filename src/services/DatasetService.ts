
import { Dataset } from '@/types/dataset';
import { toast } from 'sonner';
import { BaseService } from './BaseService';
import { DatasetImageService } from './DatasetImageService';

/**
 * Service for managing datasets
 */
class DatasetService extends BaseService<Dataset> {
  private static STORAGE_KEY = 'skinwise_datasets';
  private imageService: DatasetImageService;
  
  constructor() {
    super(DatasetService.STORAGE_KEY);
    this.imageService = new DatasetImageService();
  }
  
  /**
   * Get all datasets
   */
  getDatasets(): Dataset[] {
    return this.getAllItems();
  }
  
  /**
   * Create a new dataset
   */
  createDataset(name: string, description: string): Dataset {
    if (!name.trim()) {
      throw new Error('Dataset name is required');
    }
    
    const datasets = this.getDatasets();
    
    const newDataset: Dataset = {
      id: crypto.randomUUID(),
      name,
      description,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    datasets.push(newDataset);
    this.saveAllItems(datasets);
    toast.success(`Dataset "${name}" created successfully`);
    
    return newDataset;
  }
  
  /**
   * Get a dataset by ID
   */
  getDataset(id: string): Dataset | undefined {
    if (!id) return undefined;
    
    const datasets = this.getDatasets();
    return datasets.find(dataset => dataset.id === id);
  }
  
  /**
   * Delete a dataset
   */
  deleteDataset(id: string): boolean {
    if (!id) {
      toast.error('Missing dataset ID');
      return false;
    }
    
    const datasets = this.getDatasets();
    const initialCount = datasets.length;
    
    const filteredDatasets = datasets.filter(d => d.id !== id);
    
    if (filteredDatasets.length === initialCount) {
      toast.error('Dataset not found');
      return false;
    }
    
    this.saveAllItems(filteredDatasets);
    toast.success('Dataset deleted');
    
    return true;
  }
  
  /**
   * Update dataset details
   */
  updateDataset(id: string, updates: { name?: string; description?: string }): Dataset | null {
    if (!id) {
      toast.error('Missing dataset ID');
      return null;
    }
    
    const datasets = this.getDatasets();
    const datasetIndex = datasets.findIndex(d => d.id === id);
    
    if (datasetIndex === -1) {
      toast.error('Dataset not found');
      return null;
    }
    
    if (updates.name !== undefined) {
      datasets[datasetIndex].name = updates.name.trim();
    }
    
    if (updates.description !== undefined) {
      datasets[datasetIndex].description = updates.description.trim();
    }
    
    datasets[datasetIndex].updatedAt = new Date();
    this.saveAllItems(datasets);
    toast.success('Dataset updated');
    
    return datasets[datasetIndex];
  }
  
  // Image-related methods that forward to the image service
  
  /**
   * Add an image to a dataset
   */
  addImageToDataset(
    datasetId: string, 
    imageData: string, 
    label: string, 
    condition?: string, 
    severity?: 'low' | 'moderate' | 'high'
  ) {
    return this.imageService.addImageToDataset(datasetId, imageData, label, condition, severity);
  }
  
  /**
   * Remove an image from a dataset
   */
  removeImageFromDataset(datasetId: string, imageId: string) {
    return this.imageService.removeImageFromDataset(datasetId, imageId);
  }
}

// Create and export a singleton instance
export default new DatasetService();
