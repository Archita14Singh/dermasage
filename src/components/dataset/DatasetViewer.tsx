
import React, { useState } from 'react';
import { Edit, Plus, Trash2, InfoIcon } from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dataset, DatasetImage } from '@/types/dataset';
import DatasetService from '@/services/DatasetService';
import ImageUpload from '../ImageUpload';

interface DatasetViewerProps {
  dataset: Dataset;
  onDatasetUpdated: () => void;
}

const DatasetViewer: React.FC<DatasetViewerProps> = ({ 
  dataset, 
  onDatasetUpdated 
}) => {
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(dataset.name);
  const [editedDescription, setEditedDescription] = useState(dataset.description);
  const [selectedImage, setSelectedImage] = useState<DatasetImage | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageCondition, setNewImageCondition] = useState('');
  const [newImageSeverity, setNewImageSeverity] = useState<'low' | 'moderate' | 'high' | ''>('');
  
  const handleSaveEdit = () => {
    if (editedName.trim()) {
      DatasetService.updateDataset(dataset.id, {
        name: editedName.trim(),
        description: editedDescription.trim()
      });
      
      onDatasetUpdated();
      setIsEditDialogOpen(false);
    }
  };
  
  const handleAddImage = () => {
    if (!uploadedImage || !newImageLabel.trim()) return;
    
    DatasetService.addImageToDataset(
      dataset.id,
      uploadedImage,
      newImageLabel.trim(),
      newImageCondition || undefined,
      newImageSeverity as 'low' | 'moderate' | 'high' | undefined
    );
    
    resetImageForm();
    onDatasetUpdated();
    setIsAddImageDialogOpen(false);
  };
  
  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to remove this image from the dataset?')) {
      DatasetService.removeImageFromDataset(dataset.id, imageId);
      onDatasetUpdated();
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    }
  };
  
  const resetImageForm = () => {
    setUploadedImage(null);
    setNewImageLabel('');
    setNewImageCondition('');
    setNewImageSeverity('');
  };
  
  // Reset form state when dialog is opened to ensure fresh state
  const handleOpenAddImageDialog = () => {
    resetImageForm();
    setIsAddImageDialogOpen(true);
  };
  
  return (
    <Card className="h-full flex flex-col glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{dataset.name}</CardTitle>
          <CardDescription>
            {dataset.images.length} images • Last updated {dataset.updatedAt.toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" onClick={handleOpenAddImageDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <Tabs defaultValue="grid" className="h-full flex flex-col">
          <div className="px-6 pt-2 pb-0">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="details">Details View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="flex-1 p-6 pt-4">
            {dataset.images.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <InfoIcon className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  This dataset doesn't have any images. Add some images to start building your dataset.
                </p>
                <Button onClick={() => setIsAddImageDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Image
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {dataset.images.map(image => (
                    <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={image.imageUrl}
                        alt={image.label}
                        className="w-full h-full object-cover"
                        onClick={() => setSelectedImage(image)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate">
                        {image.label}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="flex-1 p-6 pt-4">
            {dataset.images.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <InfoIcon className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  This dataset doesn't have any images. Add some images to start building your dataset.
                </p>
                <Button onClick={() => setIsAddImageDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Image
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Preview</th>
                      <th className="text-left py-2 px-4 font-medium">Label</th>
                      <th className="text-left py-2 px-4 font-medium">Condition</th>
                      <th className="text-left py-2 px-4 font-medium">Severity</th>
                      <th className="text-left py-2 px-4 font-medium">Date Added</th>
                      <th className="text-left py-2 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.images.map(image => (
                      <tr key={image.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <img 
                              src={image.imageUrl} 
                              alt={image.label} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-4">{image.label}</td>
                        <td className="py-2 px-4">{image.condition || '-'}</td>
                        <td className="py-2 px-4">
                          {image.severity ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              image.severity === 'high' ? 'bg-red-100 text-red-800' : 
                              image.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {image.severity}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-4">{image.dateAdded.toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Edit Dataset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dataset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Dataset Name
              </label>
              <Input
                id="edit-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editedName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Image Dialog */}
      <Dialog 
        open={isAddImageDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            resetImageForm();
          }
          setIsAddImageDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Image to Dataset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Image
              </label>
              <ImageUpload
                onImageSelected={(data) => setUploadedImage(data)}
                onReset={() => setUploadedImage(null)}
                showPreview={!!uploadedImage}
                previewImage={uploadedImage}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image-label" className="text-sm font-medium">
                Image Label
              </label>
              <Input
                id="image-label"
                value={newImageLabel}
                onChange={(e) => setNewImageLabel(e.target.value)}
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
                  value={newImageCondition}
                  onChange={(e) => setNewImageCondition(e.target.value)}
                  placeholder="e.g., Acne"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image-severity" className="text-sm font-medium">
                  Severity (optional)
                </label>
                <Select
                  value={newImageSeverity}
                  onValueChange={(value) => setNewImageSeverity(value as 'low' | 'moderate' | 'high' | '')}
                >
                  <SelectTrigger id="image-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddImageDialogOpen(false);
              resetImageForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddImage} 
              disabled={!uploadedImage || !newImageLabel.trim()}
            >
              Add to Dataset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        {selectedImage && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.label}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md overflow-hidden max-h-[60vh]">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.label}
                  className="w-full h-auto object-contain"
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                {selectedImage.condition && (
                  <div>
                    <p className="text-sm font-medium">Condition</p>
                    <p>{selectedImage.condition}</p>
                  </div>
                )}
                
                {selectedImage.severity && (
                  <div>
                    <p className="text-sm font-medium">Severity</p>
                    <p className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      selectedImage.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      selectedImage.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedImage.severity}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium">Date Added</p>
                  <p>{selectedImage.dateAdded.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteImage(selectedImage.id);
                  setSelectedImage(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Dataset
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
};

export default DatasetViewer;
