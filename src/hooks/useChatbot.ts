
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import ChatService from '@/services/ChatService';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';

type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

export function useChatbot() {
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
  const [clientProfile, setClientProfile] = useState<ClientProfile>(null);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Check for stored analysis results when component mounts
    if (!initializedRef.current) {
      initializedRef.current = true;
      
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
  
  return {
    messages,
    isLoading,
    showQuestionnaire,
    clientProfile,
    handleSubmitQuestionnaire,
    handleSendMessage
  };
}
