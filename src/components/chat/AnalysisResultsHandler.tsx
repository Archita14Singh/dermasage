
import { useEffect } from 'react';
import { Message } from '@/types/chat';
import ChatService from '@/services/ChatService';

interface AnalysisResultsHandlerProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnalysisResultsHandler: React.FC<AnalysisResultsHandlerProps> = ({ 
  setMessages, 
  setIsLoading 
}) => {
  useEffect(() => {
    checkForStoredAnalysisResults();
  }, []);
  
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
  
  return null;
};

export default AnalysisResultsHandler;
