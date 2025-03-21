
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyDatasetStateProps {
  onCreateDataset: () => void;
}

const EmptyDatasetState: React.FC<EmptyDatasetStateProps> = ({ onCreateDataset }) => {
  return (
    <Card className="h-full flex items-center justify-center glass-card">
      <CardContent className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">No Dataset Selected</h3>
        <p className="text-muted-foreground mb-4">
          Select a dataset from the list or create a new one to view its contents.
        </p>
        <Button onClick={onCreateDataset}>
          <Plus className="w-4 h-4 mr-2" />
          Create Dataset
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyDatasetState;
