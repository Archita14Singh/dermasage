
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import { toast } from 'sonner';
import type { JournalEntry } from '@/hooks/useJournalEntries';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Omit<JournalEntry, 'id'>) => string;
  currentDate: Date;
}

const AddEntryDialog: React.FC<AddEntryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  currentDate
}) => {
  const [newEntryImage, setNewEntryImage] = useState<string | null>(null);
  const [newEntryNotes, setNewEntryNotes] = useState('');
  const [newEntryProduct, setNewEntryProduct] = useState('');
  const [newEntryProducts, setNewEntryProducts] = useState<string[]>([]);
  const [newEntryConcerns, setNewEntryConcerns] = useState<string[]>([]);
  
  const handleImageSelected = (imageData: string) => {
    setNewEntryImage(imageData);
  };
  
  const handleAddProduct = () => {
    if (newEntryProduct.trim()) {
      setNewEntryProducts([...newEntryProducts, newEntryProduct.trim()]);
      setNewEntryProduct('');
    }
  };
  
  const handleRemoveProduct = (index: number) => {
    setNewEntryProducts(newEntryProducts.filter((_, i) => i !== index));
  };
  
  const handleToggleConcern = (concern: string) => {
    if (newEntryConcerns.includes(concern)) {
      setNewEntryConcerns(newEntryConcerns.filter(c => c !== concern));
    } else {
      setNewEntryConcerns([...newEntryConcerns, concern]);
    }
  };
  
  const handleSaveEntry = () => {
    if (!newEntryImage) {
      toast.error('Please upload an image for your journal entry');
      return;
    }
    
    if (!newEntryNotes.trim()) {
      toast.error('Please add some notes about your skin condition');
      return;
    }
    
    const newEntry: Omit<JournalEntry, 'id'> = {
      date: currentDate,
      image: newEntryImage,
      notes: newEntryNotes,
      products: newEntryProducts,
      concerns: newEntryConcerns,
    };
    
    onSave(newEntry);
    
    // Clear form
    setNewEntryImage(null);
    setNewEntryNotes('');
    setNewEntryProducts([]);
    setNewEntryConcerns([]);
    onOpenChange(false);
    
    toast.success('Journal entry added successfully');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Journal Entry</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image">Skin Photo</Label>
            {newEntryImage ? (
              <div className="relative aspect-square max-h-[200px] rounded-xl overflow-hidden shadow-sm">
                <img
                  src={newEntryImage}
                  alt="Uploaded skin"
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 rounded-full bg-white/80 shadow-sm hover:bg-white h-8 w-8"
                  onClick={() => setNewEntryImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <ImageUploader
                onImageSelected={handleImageSelected}
                className="h-[150px]"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newEntryNotes}
              onChange={(e) => setNewEntryNotes(e.target.value)}
              placeholder="How does your skin look and feel today?"
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Skin Concerns</Label>
            <div className="flex flex-wrap gap-2">
              {['acne', 'redness', 'dryness', 'oiliness', 'texture', 'hyperpigmentation', 'aging'].map((concern) => (
                <Badge
                  key={concern}
                  variant={newEntryConcerns.includes(concern) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleToggleConcern(concern)}
                >
                  {concern}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="products">Products Used</Label>
            <div className="flex space-x-2">
              <Input
                id="products"
                value={newEntryProduct}
                onChange={(e) => setNewEntryProduct(e.target.value)}
                placeholder="Product name"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddProduct}>Add</Button>
            </div>
            
            {newEntryProducts.length > 0 && (
              <div className="mt-2">
                <ul className="space-y-1">
                  {newEntryProducts.map((product, index) => (
                    <li key={index} className="flex justify-between items-center text-sm p-2 border rounded-md">
                      <span>{product}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveEntry}>Save Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
