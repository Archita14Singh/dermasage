
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { Message } from '@/types/chat';
import ChatService from '@/services/ChatService';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm DermaSage's AI assistant. How can I help with your skincare needs today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Check for stored analysis results when component mounts
    if (!initializedRef.current) {
      initializedRef.current = true;
      checkForStoredAnalysisResults();
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const checkForStoredAnalysisResults = async () => {
    const storedResults = sessionStorage.getItem('skinAnalysisResults');
    const storedImage = sessionStorage.getItem('skinAnalysisImage');
    
    if (storedResults && storedImage) {
      // Clear the stored results to prevent them from being used again
      sessionStorage.removeItem('skinAnalysisResults');
      sessionStorage.removeItem('skinAnalysisImage');
      
      // Add the analysis results to the chat
      const analysisResults = JSON.parse(storedResults);
      
      // Add user message with the image
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "I just had my skin analyzed. Can you explain the results?",
        sender: 'user',
        timestamp: new Date(),
        image: storedImage,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Show typing indicator
      setIsLoading(true);
      
      try {
        // Process the analysis results
        const botMessage = await ChatService.processAnalysisResults(analysisResults);
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error processing analysis results:', error);
      } finally {
        setIsLoading(false);
      }
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
    
    try {
      // Initialize the model if needed
      await loadSkinAnalysisModel();
      
      let botMessage: Message;
      
      if (imageData) {
        // Process the image
        botMessage = await ChatService.processImageMessage(imageData);
      } else {
        // Process the text message
        const botResponse = await ChatService.processTextMessage(inputText);
        
        botMessage = {
          id: Date.now().toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
      }
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in message processing:', error);
      // Handle error if needed
    } finally {
      setIsLoading(false);
    }
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
