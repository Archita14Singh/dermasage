
import { useEffect } from 'react';
import { Message } from '@/types/chat';
import ChatService from '@/services/ChatService';
import { toast } from 'sonner';

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
    console.log('Checking for stored analysis results...');
    const storedResults = sessionStorage.getItem('skinAnalysisResults');
    const storedImage = sessionStorage.getItem('skinAnalysisImage');
    
    if (storedResults && storedImage) {
      console.log('Found stored analysis results and image');
      
      try {
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
        
        // Process the analysis results
        const analysisResults = JSON.parse(storedResults);
        console.log('Processing analysis results:', analysisResults);
        
        // Process the analysis results
        const botMessage = await ChatService.processAnalysisResults(analysisResults);
        
        // Clear the stored results to prevent them from being used again
        // Only clear after successful processing
        sessionStorage.removeItem('skinAnalysisResults');
        sessionStorage.removeItem('skinAnalysisImage');
        
        setMessages(prev => [...prev, botMessage]);
        
        // Show success notification
        toast.success('Analysis results processed successfully', {
          description: 'Your skin analysis results are now available in the chat'
        });
      } catch (error) {
        console.error('Error processing analysis results:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "I'm sorry, I encountered an error processing your skin analysis results. Let's discuss your skin concerns directly - what would you like to know?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No stored analysis results found');
    }
  };
  
  return null;
};

export default AnalysisResultsHandler;
