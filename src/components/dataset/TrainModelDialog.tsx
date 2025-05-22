import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dataset } from '@/types/dataset';
import { modelTrainer } from '@/utils/skinAnalysis/modelTrainer';

interface TrainModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: Dataset;
  onModelTrained: () => void;
}

const TrainModelDialog: React.FC<TrainModelDialogProps> = ({
  open,
  onOpenChange,
  dataset,
  onModelTrained
}) => {
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(16);
  const [validationSplit, setValidationSplit] = useState(20); // 0-100
  const [augmentation, setAugmentation] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  
  const handleStartTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setStatus('Preparing...');
    
    try {
      const success = await modelTrainer.trainModel(dataset, {
        epochs,
        learningRate,
        batchSize,
        validationSplit: validationSplit / 100,
        augmentation,
        onProgress: (progressData) => {
          setProgress(progressData.progress);
          
          switch (progressData.status) {
            case 'preparing':
              setStatus('Preparing training data...');
              break;
            case 'training':
              setStatus(`Training (Epoch ${progressData.currentEpoch}/${progressData.totalEpochs})...`);
              break;
            case 'validating':
              setStatus('Validating model...');
              break;
            case 'complete':
              setStatus('Training complete!');
              setAccuracy(progressData.accuracy);
              break;
            case 'error':
              setStatus(`Error: ${progressData.error}`);
              break;
            default:
              setStatus('Processing...');
              break;
          }
        }
      });
      
      if (success) {
        onModelTrained();
        // Keep dialog open to show results
      }
    } catch (error) {
      console.error('Error during training:', error);
      setStatus('Training failed');
    } finally {
      setIsTraining(false);
    }
  };
  
  const handleClose = () => {
    if (!isTraining) {
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Train Model from Dataset</DialogTitle>
          <DialogDescription>
            Train a custom skin analysis model using your dataset: {dataset.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isTraining && !accuracy ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="epochs">Epochs: {epochs}</Label>
                </div>
                <Slider
                  id="epochs"
                  min={1}
                  max={50}
                  step={1}
                  value={[epochs]}
                  onValueChange={(value) => setEpochs(value[0])}
                  disabled={isTraining}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="learning-rate">Learning Rate: {learningRate}</Label>
                </div>
                <Slider
                  id="learning-rate"
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  value={[learningRate]}
                  onValueChange={(value) => setLearningRate(value[0])}
                  disabled={isTraining}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="batch-size">Batch Size: {batchSize}</Label>
                </div>
                <Slider
                  id="batch-size"
                  min={4}
                  max={64}
                  step={4}
                  value={[batchSize]}
                  onValueChange={(value) => setBatchSize(value[0])}
                  disabled={isTraining}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="validation-split">Validation Split: {validationSplit}%</Label>
                </div>
                <Slider
                  id="validation-split"
                  min={10}
                  max={30}
                  step={5}
                  value={[validationSplit]}
                  onValueChange={(value) => setValidationSplit(value[0])}
                  disabled={isTraining}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="augmentation"
                  checked={augmentation}
                  onCheckedChange={setAugmentation}
                  disabled={isTraining}
                />
                <Label htmlFor="augmentation">Use data augmentation</Label>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Dataset size: {dataset.images.length} images
                </p>
                {dataset.images.length < 10 && (
                  <p className="text-sm text-destructive">
                    Warning: Dataset should have at least 10 images for better results.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Training Progress</Label>
                <Progress value={progress} className="h-2" />
              </div>
              
              <p className="text-center text-sm">{status}</p>
              
              {accuracy !== undefined && (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-lg font-medium">Training Complete!</p>
                  <p className="text-2xl font-bold text-primary">{accuracy.toFixed(1)}% Accuracy</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your model has been saved and is ready to use.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!isTraining && !accuracy && (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isTraining}>
                Cancel
              </Button>
              <Button 
                onClick={handleStartTraining} 
                disabled={isTraining || dataset.images.length < 3}
              >
                Start Training
              </Button>
            </>
          )}
          
          {accuracy !== undefined && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainModelDialog;
