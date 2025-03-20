
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Dataset } from '@/types/dataset';
import DatasetService from '@/services/DatasetService';
import DatasetViewer from './DatasetViewer';
import { toast } from 'sonner';

const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetDescription, setNewDatasetDescription] = useState('');
  
  useEffect(() => {
    loadDatasets();
  }, []);
  
  const loadDatasets = () => {
    const loadedDatasets = DatasetService.getDatasets();
    setDatasets(loadedDatasets);
    
    // If we have a selected dataset, refresh it with the latest data
    if (selectedDataset) {
      const updatedDataset = loadedDatasets.find(d => d.id === selectedDataset.id);
      if (updatedDataset) {
        setSelectedDataset(updatedDataset);
      } else {
        // If the selected dataset no longer exists, select the first dataset
        setSelectedDataset(loadedDatasets.length > 0 ? loadedDatasets[0] : null);
      }
    } 
    // Select the first dataset if one exists and none is selected
    else if (loadedDatasets.length > 0 && !selectedDataset) {
      setSelectedDataset(loadedDatasets[0]);
    }
  };
  
  const handleCreateDataset = () => {
    if (!newDatasetName.trim()) return;
    
    const newDataset = DatasetService.createDataset(
      newDatasetName.trim(),
      newDatasetDescription.trim()
    );
    
    loadDatasets();
    setSelectedDataset(newDataset);
    setIsCreateDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteDataset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      const success = DatasetService.deleteDataset(id);
      
      if (success) {
        loadDatasets();
      }
    }
  };
  
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
  
  const resetForm = () => {
    setNewDatasetName('');
    setNewDatasetDescription('');
  };
  
  const handleDatasetUpdated = () => {
    loadDatasets();
  };
  
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skin Condition Datasets</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Dataset
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Dataset List */}
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
                      onClick={() => setSelectedDataset(dataset)}
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
                            handleDeleteDataset(dataset.id);
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
        
        {/* Dataset Content */}
        <div className="flex-1">
          {selectedDataset ? (
            <DatasetViewer 
              dataset={selectedDataset} 
              onDatasetUpdated={handleDatasetUpdated} 
            />
          ) : (
            <Card className="h-full flex items-center justify-center glass-card">
              <CardContent className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No Dataset Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a dataset from the list or create a new one to view its contents.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Dataset
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Create Dataset Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dataset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="dataset-name" className="text-sm font-medium">
                Dataset Name
              </label>
              <Input
                id="dataset-name"
                value={newDatasetName}
                onChange={(e) => setNewDatasetName(e.target.value)}
                placeholder="e.g., Acne Classification Dataset"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dataset-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="dataset-description"
                value={newDatasetDescription}
                onChange={(e) => setNewDatasetDescription(e.target.value)}
                placeholder="Describe the purpose of this dataset..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateDataset} disabled={!newDatasetName.trim()}>
              Create Dataset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatasetManager;
