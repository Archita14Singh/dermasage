
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ClientQuestionnaire from './ClientQuestionnaire';

interface ChatContainerProps {
  messages: any[];
  isLoading: boolean;
  showQuestionnaire: boolean;
  onSubmitQuestionnaire: (profile: {
    name: string;
    age: string;
    skinType: string;
    allergies: string;
    medicalHistory: string;
  }) => void;
  onSendMessage: (message: string, image?: string | null) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  showQuestionnaire,
  onSubmitQuestionnaire,
  onSendMessage
}) => {
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
          <ClientQuestionnaire onComplete={onSubmitQuestionnaire} />
        ) : (
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default ChatContainer;
