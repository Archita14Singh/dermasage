
import React from 'react';
import { Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dataset } from '@/types/dataset';
import { toast } from 'sonner';

interface DatasetListProps {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onSelectDataset: (dataset: Dataset) => void;
  onDeleteDataset: (id: string) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  onDeleteDataset,
}) => {
  const exportDataset = (dataset: Dataset) => {
    try {
      const dataStr = JSON.stringify(dataset, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `${dataset.name.replace(/\s+/g, '_')}_dataset.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Dataset exported successfully');
    } catch (error) {
      console.error('Error exporting dataset:', error);
      toast.error('Failed to export dataset');
    }
  };

  return (
    <Card className="lg:w-64 flex-shrink-0 glass-card">
      <CardHeader>
        <CardTitle>Your Datasets</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {datasets.length === 0 ? (
              <p className="text-muted-foreground text-center p-4">
                No datasets yet. Create your first dataset to get started.
              </p>
            ) : (
              datasets.map(dataset => (
                <div 
                  key={dataset.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedDataset?.id === dataset.id ? 'bg-muted' : ''}`}
                  onClick={() => onSelectDataset(dataset)}
                >
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{dataset.name}</p>
                    <p className="text-xs text-muted-foreground">{dataset.images.length} images</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8" 
                      onClick={(e) => {
                        e.stopPropagation();
                        exportDataset(dataset);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDataset(dataset.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DatasetList;
