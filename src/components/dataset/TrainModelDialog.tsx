
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { modelTrainer } from '@/utils/skinAnalysis/modelTrainer';
import { Dataset } from '@/types/dataset';

interface TrainModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset;
}

const TrainModelDialog: React.FC<TrainModelDialogProps> = ({ 
  isOpen, 
  onClose,
  dataset
}) => {
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [validationSplit, setValidationSplit] = useState(0.2);
  const [augmentation, setAugmentation] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  
  const handleTrain = async () => {
    setIsTraining(true);
    setProgress(0);
    setStatus('Preparing...');
    
    try {
      const success = await modelTrainer.trainModel(dataset.id, {
        epochs,
        learningRate,
        batchSize,
        validationSplit,
        augmentation,
        onProgress: (progressData: any) => {
          setProgress(progressData.progress * 100);
          setStatus(progressData.status);
        }
      });
      
      if (success) {
        setStatus('Training complete!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatus('Training failed. Please try again.');
        setIsTraining(false);
      }
    } catch (error) {
      console.error('Error training model:', error);
      setStatus('Error training model. Please try again.');
      setIsTraining(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !isTraining && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Train AI Model</DialogTitle>
          <DialogDescription>
            Configure and train a custom skin analysis model using the images in "{dataset.name}".
          </DialogDescription>
        </DialogHeader>
        
        {!isTraining ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="epochs">Epochs</Label>
                <Input
                  id="epochs"
                  type="number"
                  min={1}
                  max={100}
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Number of training iterations</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learningRate">Learning Rate</Label>
                <Input
                  id="learningRate"
                  type="number"
                  min={0.0001}
                  max={0.1}
                  step={0.001}
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Model's learning speed</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  min={1}
                  max={128}
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Images per batch</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validationSplit">Validation Split</Label>
                <Input
                  id="validationSplit"
                  type="number"
                  min={0.1}
                  max={0.5}
                  step={0.1}
                  value={validationSplit}
                  onChange={(e) => setValidationSplit(parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Portion reserved for validation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="augmentation" 
                checked={augmentation}
                onCheckedChange={(checked) => setAugmentation(!!checked)}
              />
              <Label htmlFor="augmentation">Use data augmentation</Label>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-4">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm">{status}</p>
            <p className="text-center text-xs text-muted-foreground">
              {progress > 0 && progress < 100 ? `${Math.round(progress)}% complete` : ''}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isTraining}>
            Cancel
          </Button>
          <Button onClick={handleTrain} disabled={isTraining}>
            {isTraining ? 'Training...' : 'Start Training'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainModelDialog;
