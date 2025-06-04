
import React from 'react';
import DatasetManager from '@/components/dataset/DatasetManager';

const DatasetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container py-8 max-w-7xl mx-auto">
        <DatasetManager />
      </div>
    </div>
  );
};

export default DatasetPage;
