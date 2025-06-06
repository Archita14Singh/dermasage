
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dataset } from '@/types/dataset';
import DatasetService from '@/services/DatasetService';
import DatasetViewer from './DatasetViewer';
import DatasetList from './DatasetList';
import EmptyDatasetState from './EmptyDatasetState';
import CreateDatasetDialog from './CreateDatasetDialog';

const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetDescription, setNewDatasetDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadDatasets();
  }, []);
  
  const loadDatasets = () => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateDataset = () => {
    if (!newDatasetName.trim()) return;
    
    try {
      const newDataset = DatasetService.createDataset(
        newDatasetName.trim(),
        newDatasetDescription.trim()
      );
      
      loadDatasets();
      setSelectedDataset(newDataset);
      setIsCreateDialogOpen(false);
      setNewDatasetName('');
      setNewDatasetDescription('');
    } catch (error) {
      console.error('Error creating dataset:', error);
    }
  };
  
  const handleDeleteDataset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      try {
        const success = DatasetService.deleteDataset(id);
        
        if (success) {
          loadDatasets();
        }
      } catch (error) {
        console.error('Error deleting dataset:', error);
      }
    }
  };
  
  const handleDatasetUpdated = () => {
    loadDatasets();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading datasets...</p>
        </div>
      </div>
    );
  }
  
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
        <DatasetList
          datasets={datasets}
          selectedDataset={selectedDataset}
          onSelectDataset={setSelectedDataset}
          onDeleteDataset={handleDeleteDataset}
        />
        
        {/* Dataset Content */}
        <div className="flex-1">
          {selectedDataset ? (
            <DatasetViewer 
              dataset={selectedDataset} 
              onDatasetUpdated={handleDatasetUpdated} 
            />
          ) : (
            <EmptyDatasetState onCreateDataset={() => setIsCreateDialogOpen(true)} />
          )}
        </div>
      </div>
      
      {/* Create Dataset Dialog */}
      <CreateDatasetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        newDatasetName={newDatasetName}
        setNewDatasetName={setNewDatasetName}
        newDatasetDescription={newDatasetDescription}
        setNewDatasetDescription={setNewDatasetDescription}
        onCreateDataset={handleCreateDataset}
      />
    </div>
  );
};

export default DatasetManager;
