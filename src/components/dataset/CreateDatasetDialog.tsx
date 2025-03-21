
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDatasetName: string;
  setNewDatasetName: (name: string) => void;
  newDatasetDescription: string;
  setNewDatasetDescription: (description: string) => void;
  onCreateDataset: () => void;
}

const CreateDatasetDialog: React.FC<CreateDatasetDialogProps> = ({
  open,
  onOpenChange,
  newDatasetName,
  setNewDatasetName,
  newDatasetDescription,
  setNewDatasetDescription,
  onCreateDataset,
}) => {
  const resetForm = () => {
    setNewDatasetName('');
    setNewDatasetDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
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
            onOpenChange(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={onCreateDataset} disabled={!newDatasetName.trim()}>
            Create Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDatasetDialog;
