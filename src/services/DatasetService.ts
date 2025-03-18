
import { Dataset, DatasetImage } from '@/types/dataset';
import { toast } from 'sonner';

// For demo purposes, we'll use localStorage to persist datasets
// In a real application, this would connect to a backend API
class DatasetService {
  private static STORAGE_KEY = 'skinwise_datasets';
  
  // Get all datasets
  static getDatasets(): Dataset[] {
    try {
      const datasetsJson = localStorage.getItem(this.STORAGE_KEY);
      if (!datasetsJson) return [];
      return JSON.parse(datasetsJson, (key, value) => {
        // Convert date strings back to Date objects
        if (key === 'createdAt' || key === 'updatedAt' || key === 'dateAdded') {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error('Error loading datasets:', error);
      return [];
    }
  }
  
  // Save all datasets
  private static saveDatasets(datasets: Dataset[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datasets));
  }
  
  // Create a new dataset
  static createDataset(name: string, description: string): Dataset {
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
    this.saveDatasets(datasets);
    toast.success(`Dataset "${name}" created successfully`);
    
    return newDataset;
  }
  
  // Get a dataset by ID
  static getDataset(id: string): Dataset | undefined {
    const datasets = this.getDatasets();
    return datasets.find(dataset => dataset.id === id);
  }
  
  // Add an image to a dataset
  static addImageToDataset(datasetId: string, imageData: string, label: string, condition?: string, severity?: 'low' | 'moderate' | 'high'): DatasetImage | null {
    const datasets = this.getDatasets();
    const datasetIndex = datasets.findIndex(d => d.id === datasetId);
    
    if (datasetIndex === -1) {
      toast.error('Dataset not found');
      return null;
    }
    
    const newImage: DatasetImage = {
      id: crypto.randomUUID(),
      imageUrl: imageData,
      label,
      condition,
      severity,
      dateAdded: new Date()
    };
    
    datasets[datasetIndex].images.push(newImage);
    datasets[datasetIndex].updatedAt = new Date();
    
    this.saveDatasets(datasets);
    toast.success('Image added to dataset');
    
    return newImage;
  }
  
  // Remove an image from a dataset
  static removeImageFromDataset(datasetId: string, imageId: string): boolean {
    const datasets = this.getDatasets();
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
    this.saveDatasets(datasets);
    toast.success('Image removed from dataset');
    
    return true;
  }
  
  // Delete a dataset
  static deleteDataset(id: string): boolean {
    const datasets = this.getDatasets();
    const initialCount = datasets.length;
    
    const filteredDatasets = datasets.filter(d => d.id !== id);
    
    if (filteredDatasets.length === initialCount) {
      toast.error('Dataset not found');
      return false;
    }
    
    this.saveDatasets(filteredDatasets);
    toast.success('Dataset deleted');
    
    return true;
  }
  
  // Update dataset details
  static updateDataset(id: string, updates: { name?: string; description?: string }): Dataset | null {
    const datasets = this.getDatasets();
    const datasetIndex = datasets.findIndex(d => d.id === id);
    
    if (datasetIndex === -1) {
      toast.error('Dataset not found');
      return null;
    }
    
    if (updates.name) {
      datasets[datasetIndex].name = updates.name;
    }
    
    if (updates.description) {
      datasets[datasetIndex].description = updates.description;
    }
    
    datasets[datasetIndex].updatedAt = new Date();
    this.saveDatasets(datasets);
    toast.success('Dataset updated');
    
    return datasets[datasetIndex];
  }
}

export default DatasetService;
