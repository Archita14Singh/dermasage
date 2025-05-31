
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ImageMetadataFormProps {
  label: string;
  setLabel: (label: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  severity: 'low' | 'moderate' | 'high' | '' | 'none';
  setSeverity: (severity: 'low' | 'moderate' | 'high' | '' | 'none') => void;
  hasProduct?: boolean;
  setHasProduct?: (hasProduct: boolean) => void;
  productName?: string;
  setProductName?: (productName: string) => void;
  productBrand?: string;
  setProductBrand?: (productBrand: string) => void;
  productType?: string;
  setProductType?: (productType: string) => void;
}

const ImageMetadataForm: React.FC<ImageMetadataFormProps> = ({
  label,
  setLabel,
  condition,
  setCondition,
  severity,
  setSeverity,
  hasProduct = false,
  setHasProduct,
  productName = '',
  setProductName,
  productBrand = '',
  setProductBrand,
  productType = '',
  setProductType
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label">Image Label *</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Severe acne on forehead"
        />
      </div>
      
      <div>
        <Label htmlFor="condition">Skin Condition</Label>
        <Input
          id="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g., acne, eczema, rosacea"
        />
      </div>
      
      <div>
        <Label htmlFor="severity">Severity</Label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not specified</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Information Section */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="has-product"
            checked={hasProduct}
            onCheckedChange={(checked) => setHasProduct?.(!!checked)}
          />
          <Label htmlFor="has-product" className="text-sm font-medium">
            This image shows a product being used
          </Label>
        </div>

        {hasProduct && (
          <div className="space-y-3 ml-6">
            <div>
              <Label htmlFor="product-name" className="text-sm">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName?.(e.target.value)}
                placeholder="e.g., CeraVe Acne Foaming Cleanser"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="product-brand" className="text-sm">Brand</Label>
              <Input
                id="product-brand"
                value={productBrand}
                onChange={(e) => setProductBrand?.(e.target.value)}
                placeholder="e.g., CeraVe, The Ordinary"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="product-type" className="text-sm">Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleanser">Cleanser</SelectItem>
                  <SelectItem value="moisturizer">Moisturizer</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="serum">Serum</SelectItem>
                  <SelectItem value="sunscreen">Sunscreen</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageMetadataForm;
