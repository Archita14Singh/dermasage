
export interface DatasetImage {
  id: string;
  imageUrl: string;
  label: string;
  condition?: string;
  severity?: 'low' | 'moderate' | 'high';
  dateAdded: Date;
  metadata?: Record<string, any>;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  images: DatasetImage[];
  createdAt: Date;
  updatedAt: Date;
}
