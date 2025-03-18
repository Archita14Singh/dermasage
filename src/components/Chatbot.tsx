
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { analyzeSkinCondition } from '@/utils/skinAnalysisUtils';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { Message } from '@/types/chat';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm SkinWise's AI assistant. How can I help with your skincare needs today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
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
    }
  };
  
  const handleSendMessage = async (inputText: string, imageData: string | null = null) => {
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
      image: imageData || undefined,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Show typing indicator
    setIsLoading(true);
    
    if (imageData) {
      // Process the image
      await processImageMessage(imageData);
      setIsLoading(false);
      return;
    }
    
    // Process the text message (with simulated delay for now)
    setTimeout(() => {
      let botResponse = "";
      
      // Simple rule-based responses for the prototype
      // In production, this would use a proper NLP/chatbot backend
      const lowercaseInput = inputText.toLowerCase();
      
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
  
  return (
    <Card className="glass-card h-[600px] sm:h-[700px] flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
          />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
