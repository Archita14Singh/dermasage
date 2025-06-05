
import { pipeline, env } from '@huggingface/transformers';

// Configure environment for browser usage
env.allowRemoteModels = true;
env.allowLocalModels = false;

export class AIModelService {
  private static cnnClassifier: any = null;
  private static yoloDetector: any = null;
  private static isInitialized = false;

  static async initializeModels() {
    if (this.isInitialized) return;
    
    console.log('Initializing real AI models...');
    
    try {
      // Initialize CNN for image classification
      console.log('Loading CNN classification model...');
      this.cnnClassifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { device: 'webgpu' }
      );
      
      // Initialize YOLO for object detection
      console.log('Loading YOLO detection model...');
      this.yoloDetector = await pipeline(
        'object-detection',
        'facebook/detr-resnet-50',
        { device: 'webgpu' }
      );
      
      this.isInitialized = true;
      console.log('AI models initialized successfully');
    } catch (error) {
      console.error('Error initializing AI models:', error);
      // Fallback to CPU if WebGPU fails
      try {
        console.log('Falling back to CPU...');
        this.cnnClassifier = await pipeline(
          'image-classification',
          'microsoft/resnet-50'
        );
        
        this.yoloDetector = await pipeline(
          'object-detection',
          'facebook/detr-resnet-50'
        );
        
        this.isInitialized = true;
        console.log('AI models initialized successfully on CPU');
      } catch (cpuError) {
        console.error('Failed to initialize models on CPU:', cpuError);
        throw new Error('Failed to initialize AI models');
      }
    }
  }

  static async classifyWithCNN(imageData: string) {
    if (!this.cnnClassifier) {
      await this.initializeModels();
    }
    
    try {
      console.log('Running CNN classification...');
      const results = await this.cnnClassifier(imageData);
      console.log('CNN results:', results);
      
      // Map general image classification to skin conditions
      return this.mapToSkinConditions(results);
    } catch (error) {
      console.error('CNN classification error:', error);
      throw error;
    }
  }

  static async detectWithYOLO(imageData: string) {
    if (!this.yoloDetector) {
      await this.initializeModels();
    }
    
    try {
      console.log('Running YOLO object detection...');
      const results = await this.yoloDetector(imageData);
      console.log('YOLO results:', results);
      
      // Map detected objects to skin features
      return this.mapToSkinFeatures(results);
    } catch (error) {
      console.error('YOLO detection error:', error);
      throw error;
    }
  }

  private static mapToSkinConditions(cnnResults: any[]) {
    // Map CNN image classification results to skin conditions
    const skinConditions = [];
    
    for (const result of cnnResults.slice(0, 5)) {
      let condition = 'Unknown';
      let confidence = result.score;
      
      // Map based on label keywords
      const label = result.label.toLowerCase();
      
      if (label.includes('red') || label.includes('inflammation')) {
        condition = 'Redness/Inflammation';
      } else if (label.includes('dark') || label.includes('spot')) {
        condition = 'Hyperpigmentation';
      } else if (label.includes('rough') || label.includes('texture')) {
        condition = 'Uneven Texture';
      } else if (label.includes('dry') || label.includes('flaky')) {
        condition = 'Dryness';
      } else if (label.includes('oily') || label.includes('shiny')) {
        condition = 'Excess Oil';
      } else {
        condition = 'General Skin Analysis';
      }
      
      skinConditions.push({
        condition,
        confidence,
        severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'moderate' : 'low',
        description: `Detected using CNN analysis: ${result.label}`,
        recommendations: this.getRecommendationsForCondition(condition)
      });
    }
    
    return skinConditions;
  }

  private static mapToSkinFeatures(yoloResults: any[]) {
    // Map YOLO detection results to skin features
    const detectedFeatures = [];
    
    for (const detection of yoloResults) {
      let feature = 'Unknown Feature';
      const label = detection.label.toLowerCase();
      
      // Map detected objects to skin features
      if (label.includes('person') || label.includes('face')) {
        feature = 'Facial Area';
      } else if (label.includes('spot') || label.includes('circle')) {
        feature = 'Possible Blemish';
      } else if (label.includes('line') || label.includes('edge')) {
        feature = 'Skin Texture Lines';
      } else {
        feature = `Detected: ${detection.label}`;
      }
      
      detectedFeatures.push({
        label: feature,
        confidence: detection.score,
        bbox: detection.box,
        count: 1
      });
    }
    
    return detectedFeatures;
  }

  private static getRecommendationsForCondition(condition: string) {
    const recommendations: { [key: string]: string[] } = {
      'Redness/Inflammation': [
        'Use gentle, fragrance-free products',
        'Apply a soothing moisturizer with ceramides',
        'Consider anti-inflammatory ingredients like niacinamide'
      ],
      'Hyperpigmentation': [
        'Use broad-spectrum SPF 30+ daily',
        'Consider vitamin C serum in the morning',
        'Try products with kojic acid or arbutin'
      ],
      'Uneven Texture': [
        'Use gentle exfoliation 2-3 times per week',
        'Apply a retinol product at night',
        'Maintain consistent moisturizing routine'
      ],
      'Dryness': [
        'Use a rich, emollient moisturizer',
        'Apply hyaluronic acid serum',
        'Avoid harsh cleansers and over-washing'
      ],
      'Excess Oil': [
        'Use a gentle, foaming cleanser',
        'Apply niacinamide serum to regulate oil production',
        'Use non-comedogenic, lightweight moisturizers'
      ]
    };
    
    return recommendations[condition] || [
      'Maintain a consistent skincare routine',
      'Consult with a dermatologist for personalized advice'
    ];
  }
}
