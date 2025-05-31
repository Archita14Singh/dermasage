
import { analyzeSkinCondition } from './analyzer';
import DatasetService from '@/services/DatasetService';

type TrainingOptions = {
  epochs: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
  augmentation: boolean;
  onProgress: (progressData: { progress: number; status: string }) => void;
};

export const modelTrainer = {
  /**
   * Train a skin analysis model using the provided dataset
   * @param datasetId The ID of the dataset to use for training
   * @param options Training configuration options
   * @returns Promise<boolean> indicating success or failure
   */
  trainModel: async (datasetId: string, options: TrainingOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`Training model with dataset ${datasetId} and options:`, options);
      
      // Get the dataset to analyze what we're training on
      const dataset = DatasetService.getDataset(datasetId);
      if (!dataset) {
        console.error('Dataset not found');
        resolve(false);
        return;
      }
      
      // Analyze dataset for product learning capabilities
      const productImages = dataset.images.filter(img => img.hasProduct);
      const conditionImages = dataset.images.filter(img => img.condition);
      
      console.log(`Dataset analysis: ${conditionImages.length} condition images, ${productImages.length} product images`);
      
      // Mock training process with progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 0.1;
        
        if (progress < 0.2) {
          options.onProgress({ 
            progress, 
            status: 'Preparing dataset and splitting into training/validation sets...' 
          });
        } else if (progress < 0.4) {
          options.onProgress({ 
            progress, 
            status: 'Preprocessing images and applying augmentations...' 
          });
        } else if (progress < 0.5) {
          options.onProgress({ 
            progress, 
            status: 'Training skin condition detection model...' 
          });
        } else if (progress < 0.7) {
          if (productImages.length > 0) {
            options.onProgress({ 
              progress, 
              status: 'Training product recommendation model...' 
            });
          } else {
            options.onProgress({ 
              progress, 
              status: `Training model (Epoch ${Math.floor((progress - 0.4) * 20) + 1}/${options.epochs})...` 
            });
          }
        } else if (progress < 0.9) {
          options.onProgress({ 
            progress, 
            status: 'Evaluating model performance...' 
          });
        } else {
          options.onProgress({ 
            progress: 1, 
            status: 'Finalizing and saving model...' 
          });
          clearInterval(interval);
          
          // Simulate training completion
          setTimeout(() => {
            // Save the trained model info to localStorage
            const trainedModels = JSON.parse(localStorage.getItem('skinwise_models') || '[]');
            
            // Create learned product associations
            const productAssociations: Record<string, any[]> = {};
            productImages.forEach(img => {
              if (img.condition && img.productName) {
                if (!productAssociations[img.condition]) {
                  productAssociations[img.condition] = [];
                }
                productAssociations[img.condition].push({
                  name: img.productName,
                  brand: img.productBrand,
                  type: img.productType,
                  confidence: 0.8 + Math.random() * 0.2 // Mock confidence score
                });
              }
            });
            
            trainedModels.push({
              datasetId,
              trainedAt: new Date().toISOString(),
              epochs: options.epochs,
              augmentation: options.augmentation,
              includesProducts: dataset.includesProducts,
              productAssociations,
              conditionCount: conditionImages.length,
              productCount: productImages.length
            });
            localStorage.setItem('skinwise_models', JSON.stringify(trainedModels));
            
            resolve(true);
          }, 1000);
        }
      }, 500);
    });
  },
  
  /**
   * Analyze skin using a previously trained model
   * @param imageData Base64 image data to analyze
   * @param datasetId ID of the dataset associated with the trained model
   * @returns Analysis results
   */
  analyzeWithTrainedModel: async (imageData: string, datasetId: string): Promise<any> => {
    console.log(`Analyzing with trained model for dataset ${datasetId}`);
    
    // Check if model exists
    const trainedModels = JSON.parse(localStorage.getItem('skinwise_models') || '[]');
    const model = trainedModels.find((m: any) => m.datasetId === datasetId);
    
    if (!model) {
      console.error('Model not found for dataset:', datasetId);
      throw new Error('Trained model not found');
    }
    
    // Use the standard analysis as base
    const baseResults = await analyzeSkinCondition(imageData);
    
    // Enhanced results with learned product recommendations
    const enhancedResults = {
      ...baseResults,
      usedCustomModel: true,
      customModelInfo: {
        datasetId,
        trainedAt: model.trainedAt,
        epochs: model.epochs,
        includesProducts: model.includesProducts
      }
    };
    
    // Add learned product recommendations if available
    if (model.includesProducts && model.productAssociations) {
      enhancedResults.learnedProductRecommendations = [];
      
      // Get the primary detected condition
      const primaryCondition = enhancedResults.conditions[0]?.condition.toLowerCase();
      
      if (primaryCondition && model.productAssociations[primaryCondition]) {
        enhancedResults.learnedProductRecommendations = model.productAssociations[primaryCondition]
          .sort((a: any, b: any) => b.confidence - a.confidence)
          .slice(0, 3); // Top 3 learned recommendations
      }
    }
    
    return enhancedResults;
  }
};
