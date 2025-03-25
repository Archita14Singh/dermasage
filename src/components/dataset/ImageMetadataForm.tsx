
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageMetadataFormProps {
  label: string;
  setLabel: (label: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  severity: 'low' | 'moderate' | 'high' | '';
  setSeverity: (severity: 'low' | 'moderate' | 'high' | '') => void;
}

const ImageMetadataForm: React.FC<ImageMetadataFormProps> = ({
  label,
  setLabel,
  condition,
  setCondition,
  severity,
  setSeverity
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="image-label" className="text-sm font-medium">
          Image Label
        </label>
        <Input
          id="image-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Mild Acne"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="image-condition" className="text-sm font-medium">
            Skin Condition (optional)
          </label>
          <Input
            id="image-condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g., Acne"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="image-severity" className="text-sm font-medium">
            Severity (optional)
          </label>
          <Select
            value={severity}
            onValueChange={(value) => setSeverity(value as 'low' | 'moderate' | 'high' | '')}
          >
            <SelectTrigger id="image-severity">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default ImageMetadataForm;
