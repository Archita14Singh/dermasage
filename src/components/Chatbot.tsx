
import React, { useState } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import AnalysisResultsHandler from './chat/AnalysisResultsHandler';
import ChatContainer from './chat/ChatContainer';

const Chatbot: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    showQuestionnaire, 
    handleSubmitQuestionnaire, 
    handleSendMessage 
  } = useChatbot();
  
  const [loading, setLoading] = useState(isLoading);
  const [messageList, setMessageList] = useState(messages);
  
  return (
    <>
      <AnalysisResultsHandler 
        setMessages={setMessageList} 
        setIsLoading={setLoading} 
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
