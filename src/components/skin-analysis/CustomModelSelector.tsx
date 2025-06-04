
import React from 'react';
import { Brain } from 'lucide-react';
import { Dataset } from '@/types/dataset';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CustomModelSelectorProps {
  datasets: Dataset[];
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;
  useCustomModel: boolean;
  setUseCustomModel: (use: boolean) => void;
  trainedModelCount: number;
}

const CustomModelSelector: React.FC<CustomModelSelectorProps> = ({
  datasets,
  selectedDatasetId,
  setSelectedDatasetId,
  useCustomModel,
  setUseCustomModel,
  trainedModelCount
}) => {
  // Function to check if a dataset has a trained model
  const hasTrainedModel = (datasetId: string) => {
    const models = JSON.parse(localStorage.getItem('dermasage_models') || '[]');
    return models.some((model: any) => model.datasetId === datasetId);
  };
  
  if (datasets.length === 0 || trainedModelCount === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
      <div className="flex items-center space-x-2">
        <Brain className="text-primary h-5 w-5" />
        <h3 className="font-medium">Your custom trained models</h3>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-shrink-0">
          <Select
            value={selectedDatasetId || ''}
            onValueChange={(value) => setSelectedDatasetId(value || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets
                .filter(dataset => hasTrainedModel(dataset.id))
                .map(dataset => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name} Model
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="use-custom-model"
            checked={useCustomModel}
            onChange={() => setUseCustomModel(!useCustomModel)}
            disabled={!selectedDatasetId}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="use-custom-model" className="text-sm">
            Use custom trained model
          </label>
        </div>
      </div>
      
      {useCustomModel && selectedDatasetId && (
        <p className="text-xs text-muted-foreground">
          Your analysis will use the custom model trained on your "{
            datasets.find(d => d.id === selectedDatasetId)?.name
          }" dataset.
        </p>
      )}
    </div>
  );
};

export default CustomModelSelector;
