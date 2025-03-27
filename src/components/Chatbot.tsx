
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { Message } from '@/types/chat';
import ChatService from '@/services/ChatService';
import ClientQuestionnaire from './chat/ClientQuestionnaire';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm DermaSage's AI assistant. Before I can provide personalized skincare recommendations, I need to know a bit about you. Could you please complete a quick questionnaire?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [clientProfile, setClientProfile] = useState<{
    name: string;
    age: string;
    skinType: string;
    allergies: string;
    medicalHistory: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Check for stored analysis results when component mounts
    if (!initializedRef.current) {
      initializedRef.current = true;
      checkForStoredAnalysisResults();
      
      // Check if user has already completed questionnaire
      const savedProfile = localStorage.getItem('clientProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setClientProfile(profile);
        setShowQuestionnaire(false);
        
        // Add a welcome back message
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `Welcome back, ${profile.name}! How can I help with your skincare today?`,
            sender: 'bot',
            timestamp: new Date(),
          }
        ]);
      }
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
  
  const handleSubmitQuestionnaire = (profile: {
    name: string;
    age: string;
    skinType: string;
    allergies: string;
    medicalHistory: string;
  }) => {
    // Save profile to localStorage
    localStorage.setItem('clientProfile', JSON.stringify(profile));
    setClientProfile(profile);
    
    // Add message with questionnaire results
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "I've completed the questionnaire.",
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowQuestionnaire(false);
    
    // Show typing indicator
    setIsLoading(true);
    
    // Generate personalized response
    setTimeout(async () => {
      const response = await ChatService.processQuestionnaireResults(profile);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1000);
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
        botMessage = await ChatService.processImageMessage(imageData, clientProfile);
      } else {
        // Process the text message including client profile context
        const botResponse = await ChatService.processTextMessage(inputText, clientProfile);
        
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
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        {showQuestionnaire ? (
          <ClientQuestionnaire onComplete={handleSubmitQuestionnaire} />
        ) : (
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
