
export interface DatasetImage {
  id: string;
  imageUrl: string;
  label: string;
  condition?: string;
  severity?: 'low' | 'moderate' | 'high';
  dateAdded: Date;
  metadata?: Record<string, any>;
  // New fields for product learning
  hasProduct?: boolean;
  productName?: string;
  productBrand?: string;
  productType?: 'cleanser' | 'moisturizer' | 'treatment' | 'serum' | 'sunscreen' | 'other';
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  images: DatasetImage[];
  createdAt: Date;
  updatedAt: Date;
  // New field to track if this dataset includes product learning
  includesProducts?: boolean;
}
