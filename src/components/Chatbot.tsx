
import React, { useEffect, useState } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import AnalysisResultsHandler from './chat/AnalysisResultsHandler';
import ChatContainer from './chat/ChatContainer';
import { loadAllModels, getModelInfo } from '@/utils/modelLoader';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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

  const [modelStatus, setModelStatus] = useState<{
    loading: boolean;
    loadedCount: number;
    totalModels: number;
  }>({
    loading: true,
    loadedCount: 0,
    totalModels: 7 // Total number of available models
  });
  
  // Preload models in the background
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Start loading all models
        setModelStatus({
          loading: true,
          loadedCount: 0,
          totalModels: 7
        });

        // Update progress as models load
        const modelLoadInterval = setInterval(() => {
          const info = getModelInfo();
          setModelStatus(prev => ({
            ...prev,
            loadedCount: info.loadedTypes.length,
            loading: info.loadedTypes.length < prev.totalModels
          }));
        }, 1000);
        
        // Attempt to load all models in the background
        loadAllModels().then(success => {
          clearInterval(modelLoadInterval);
          
          if (success) {
            console.log('All skin analysis models loaded successfully');
            setModelStatus({
              loading: false,
              loadedCount: 7,
              totalModels: 7
            });
            toast.success('All skin analysis models loaded', {
              description: 'Advanced analysis capabilities are now fully available'
            });
          } else {
            console.log('Some models failed to load, basic functionality still available');
            const info = getModelInfo();
            setModelStatus({
              loading: false,
              loadedCount: info.loadedTypes.length,
              totalModels: 7
            });
            toast.warning('Some models could not be loaded', {
              description: 'Basic functionality is available, but advanced analysis may be limited'
            });
          }
        });
      } catch (error) {
        console.error('Error preloading models:', error);
        setModelStatus({
          loading: false,
          loadedCount: 0,
          totalModels: 7
        });
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
      
      <div className="mb-2 flex justify-center">
        <Badge 
          className={`py-1 px-3 ${modelStatus.loading ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}
          variant="outline"
        >
          {modelStatus.loading 
            ? `Loading models: ${modelStatus.loadedCount}/${modelStatus.totalModels}` 
            : modelStatus.loadedCount === modelStatus.totalModels 
              ? 'All models loaded' 
              : `${modelStatus.loadedCount}/${modelStatus.totalModels} models loaded`}
        </Badge>
      </div>
      
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
        showQuestionnaire={showQuestionnaire}
        onSubmitQuestionnaire={handleSubmitQuestionnaire}
        onSendMessage={handleSendMessage}
      />
      
      <div className="mt-4 text-sm text-center text-muted-foreground">
        <p>This AI assistant can analyze a wide range of skin conditions including acne, wrinkles, pigmentation, texture issues, and more using advanced CNN and YOLO models.</p>
      </div>
    </>
  );
};

export default Chatbot;
