
import React, { useState, useRef } from 'react';
import { Send, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string, image?: string | null) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result.toString());
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSend = () => {
    if (input.trim() === '' && !uploadedImage) return;
    
    onSendMessage(input.trim(), uploadedImage);
    setInput('');
    setUploadedImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <>
      {uploadedImage && (
        <div className="absolute bottom-20 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm flex items-center gap-2">
          <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={uploadedImage}
              alt="Upload preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">Image ready to send</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={() => setUploadedImage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-end gap-2 w-full">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading}
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <div className="relative flex-1">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[50px] max-h-[200px] resize-none pr-12 bg-white/70 border"
            disabled={disabled || isLoading}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
            onClick={handleSend}
            disabled={isLoading || (input.trim() === '' && !uploadedImage) || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
