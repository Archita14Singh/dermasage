
import React, { useState, useCallback, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysisUtils';
import AnalysisResult from './AnalysisResult';

type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error';

const SkinAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);
  
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file.');
      return;
    }
    
    setStatus('loading');
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (e.target?.result) {
        setImage(e.target.result.toString());
        
        try {
          setStatus('analyzing');
          
          // First ensure the model is loaded
          await loadSkinAnalysisModel();
          
          // Mock delay to simulate processing time for now
          // In a real app, this would be actual model inference
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // For the prototype, we'll use mock analysis results
          // In production, this would call the actual model
          const results = await analyzeSkinCondition(e.target.result.toString());
          
          setAnalysisResults(results);
          setStatus('complete');
        } catch (error) {
          console.error('Error analyzing image:', error);
          setStatus('error');
          toast.error('An error occurred during analysis. Please try again.');
        }
      }
    };
    
    reader.onerror = () => {
      setStatus('error');
      toast.error('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleCapture = () => {
    // This would trigger device camera in a mobile app
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleReset = () => {
    setImage(null);
    setStatus('idle');
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div 
          className={cn(
            "flex flex-col items-center justify-center text-center p-8 h-[400px] border-2 border-dashed rounded-xl transition-all duration-300 bg-white/50",
            dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-skin-blue/20 rounded-full flex items-center justify-center mb-4 animate-float">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload your skin image</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Drag and drop your photo here, or click the buttons below to upload or take a picture
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-input hover:bg-secondary text-foreground shadow-subtle"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
            <Button onClick={handleCapture}>
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      );
    }
    
    if (status === 'loading' || status === 'analyzing') {
      return (
        <div className="relative aspect-square max-h-[500px] rounded-xl overflow-hidden shadow-sm">
          {image && (
            <img
              src={image}
              alt="Uploaded skin"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs text-white">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {status === 'loading' ? 'Processing Image' : 'Analyzing Skin Condition'}
            </h3>
            <div className="flex">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
            {status === 'analyzing' && (
              <p className="text-sm text-white/80 mt-4 max-w-sm text-center">
                Our AI is analyzing your skin for acne, dryness, oiliness, redness, and pigmentation
              </p>
            )}
          </div>
        </div>
      );
    }
    
    if (status === 'complete' && analysisResults) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="relative aspect-square max-h-[400px] rounded-xl overflow-hidden shadow-sm">
            {image && (
              <img
                src={image}
                alt="Analyzed skin"
                className="w-full h-full object-cover"
              />
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 rounded-full bg-white/80 shadow-sm hover:bg-white"
              onClick={handleReset}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <AnalysisResult results={analysisResults} />
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-destructive/20 rounded-xl bg-destructive/5">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't analyze your image. Please try again with a different photo or adjust lighting conditions.
          </p>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SkinAnalysis;
