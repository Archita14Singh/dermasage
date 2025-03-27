
import React from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import AnalysisResultsHandler from './chat/AnalysisResultsHandler';
import ChatContainer from './chat/ChatContainer';

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
    </>
  );
};

export default Chatbot;
