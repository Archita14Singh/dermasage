
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysisUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm SkinWise's AI assistant. How can I help with your skincare needs today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (event.target?.result) {
          const imageData = event.target.result.toString();
          setUploadedImage(imageData);
          
          // Add message with image
          const newMessage: Message = {
            id: Date.now().toString(),
            content: 'I\'d like an analysis of this skin image.',
            sender: 'user',
            timestamp: new Date(),
            image: imageData,
          };
          
          setMessages((prev) => [...prev, newMessage]);
          
          // Process the image
          setIsLoading(true);
          await processImageMessage(imageData);
          setIsLoading(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const processImageMessage = async (imageData: string) => {
    try {
      // First ensure the model is loaded
      await loadSkinAnalysisModel();
      
      // Mock delay to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For prototype, use mock analysis results
      const results = await analyzeSkinCondition(imageData);
      
      // Format the response based on the analysis
      let response = `I've analyzed your skin image and here's what I found:\n\n`;
      
      // Add skin type
      response += `Your skin appears to be ${results.skinType.toLowerCase()}. `;
      
      // Add overall assessment
      response += `${results.overall}\n\n`;
      
      // Add conditions found
      response += `Key observations:\n`;
      results.conditions.forEach((condition) => {
        const severityText = condition.severity === 'high' ? 'significant' : 
                            condition.severity === 'moderate' ? 'moderate' : 'mild';
                            
        response += `• ${condition.condition}: ${severityText} (${Math.round(condition.confidence * 100)}% confidence)\n`;
      });
      
      response += `\nBased on this analysis, here are my recommendations:\n`;
      
      // Get top 3 recommendations across all conditions
      const allRecommendations = results.conditions
        .flatMap(c => c.recommendations)
        .slice(0, 4);
        
      allRecommendations.forEach((rec, index) => {
        response += `${index + 1}. ${rec}\n`;
      });
      
      response += `\nWould you like more specific recommendations for any of these concerns?`;
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setUploadedImage(null);
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I had trouble analyzing that image. Could you try uploading a clearer photo with good lighting?",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setUploadedImage(null);
    }
  };
  
  const handleSendMessage = async () => {
    if (input.trim() === '' && !uploadedImage) return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      image: uploadedImage || undefined,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setUploadedImage(null);
    
    // Show typing indicator
    setIsLoading(true);
    
    // Process the message (with simulated delay for now)
    setTimeout(() => {
      let botResponse = "";
      
      // Simple rule-based responses for the prototype
      // In production, this would use a proper NLP/chatbot backend
      const lowercaseInput = input.toLowerCase();
      
      if (lowercaseInput.includes('acne') || lowercaseInput.includes('pimple')) {
        botResponse = "For acne concerns, I recommend:\n\n1. Use a gentle cleanser with salicylic acid\n2. Try a benzoyl peroxide spot treatment\n3. Don't pick or pop pimples\n4. Consider a non-comedogenic moisturizer\n\nWould you like product recommendations for any of these steps?";
      } 
      else if (lowercaseInput.includes('dry') || lowercaseInput.includes('flaky')) {
        botResponse = "For dry skin, I recommend:\n\n1. Use a hydrating cleanser without sulfates\n2. Apply hyaluronic acid serum on damp skin\n3. Use a rich moisturizer with ceramides\n4. Consider facial oils like squalane or rosehip\n5. Limit hot shower exposure\n\nDo you have any questions about these recommendations?";
      }
      else if (lowercaseInput.includes('oily') || lowercaseInput.includes('shine')) {
        botResponse = "For oily skin, I recommend:\n\n1. Use a gentle foaming cleanser\n2. Try niacinamide serum to regulate sebum\n3. Use oil-free, non-comedogenic moisturizers\n4. Consider clay masks once or twice weekly\n\nWould you like more specific advice?";
      }
      else if (lowercaseInput.includes('routine') || lowercaseInput.includes('regimen')) {
        botResponse = "A basic skincare routine should include:\n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)\n\nFor a personalized routine, I'd need to know more about your skin type and concerns. Would you like to share more details or upload a photo for analysis?";
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        botResponse = "Hello! I'm your AI skincare assistant. I can help analyze your skin, recommend products, or answer questions about skin concerns. How can I help you today?";
      }
      else {
        botResponse = "Thanks for your message. To provide the best recommendations, could you share more details about your skin concerns or upload a photo for analysis? I'm here to help with personalized skincare advice.";
      }
      
      // Add bot message
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <Card className="glass-card h-[600px] sm:h-[700px] flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2.5 max-w-[80%] animate-fade-in",
                  message.sender === 'user' ? "ml-auto" : "mr-auto"
                )}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 bg-primary/20">
                    <div className="text-xs font-semibold text-primary">AI</div>
                  </Avatar>
                )}
                
                <div className="flex flex-col gap-1">
                  {message.image && (
                    <div className="relative rounded-lg overflow-hidden max-w-xs mb-2">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-h-48 w-auto object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                    )}
                  >
                    <div className="text-sm whitespace-pre-line">
                      {formatMessageContent(message.content)}
                    </div>
                  </div>
                  
                  <div
                    className={cn(
                      "text-xs text-muted-foreground",
                      message.sender === 'user' ? "text-right" : "text-left"
                    )}
                  >
                    {new Intl.DateTimeFormat('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(message.timestamp)}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 bg-secondary order-first">
                    <div className="text-xs font-semibold text-muted-foreground">You</div>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2.5 max-w-[80%] mr-auto animate-fade-in">
                <Avatar className="h-8 w-8 bg-primary/20">
                  <div className="text-xs font-semibold text-primary">AI</div>
                </Avatar>
                
                <div className="flex items-center px-4 py-2.5 rounded-2xl bg-secondary text-secondary-foreground rounded-tl-none">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
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
            />
            <Button
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
              onClick={handleSendMessage}
              disabled={isLoading || (input.trim() === '' && !uploadedImage)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
