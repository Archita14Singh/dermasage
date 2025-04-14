
import React, { useEffect } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import AnalysisResultsHandler from './chat/AnalysisResultsHandler';
import ChatContainer from './chat/ChatContainer';
import { loadAllModels } from '@/utils/modelLoader';
import { toast } from 'sonner';

const Chatbot: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    showQuestionnaire, 
    handleSubmitQuestionnaire, 
    handleSendMessage,
    setMessages,
    setIsLoading
  } = useChatbot();
  
  // Preload models in the background
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Attempt to load all models in the background, but don't block the UI
        loadAllModels().then(success => {
          if (success) {
            console.log('All skin analysis models loaded successfully');
          } else {
            console.log('Some models failed to load, basic functionality still available');
          }
        });
      } catch (error) {
        console.error('Error preloading models:', error);
      }
    };
    
    loadModels();
  }, []);
  
  return (
    <>
      <AnalysisResultsHandler 
        setMessages={setMessages} 
        setIsLoading={setIsLoading} 
      />
      
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
        showQuestionnaire={showQuestionnaire}
        onSubmitQuestionnaire={handleSubmitQuestionnaire}
        onSendMessage={handleSendMessage}
      />
      
      <div className="mt-4 text-sm text-center text-muted-foreground">
        <p>This AI assistant can answer questions about skincare, recommend products with shopping links, and analyze skin photos using advanced CNN and YOLO models.</p>
      </div>
    </>
  );
};

export default Chatbot;
