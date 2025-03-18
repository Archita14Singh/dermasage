
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-2.5 max-w-[80%] animate-fade-in",
            message.sender === 'user' ? "ml-auto" : "mr-auto"
          )}
        >
          {message.sender === 'bot' && (
            <Avatar className="h-8 w-8 bg-primary/20">
              <div className="text-xs font-semibold text-primary">AI</div>
            </Avatar>
          )}
          
          <div className="flex flex-col gap-1">
            {message.image && (
              <div className="relative rounded-lg overflow-hidden max-w-xs mb-2">
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="max-h-48 w-auto object-cover rounded-lg"
                />
              </div>
            )}
            
            <div
              className={cn(
                "px-4 py-2.5 rounded-2xl",
                message.sender === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                  : "bg-secondary text-secondary-foreground rounded-tl-none"
              )}
            >
              <div className="text-sm whitespace-pre-line">
                {formatMessageContent(message.content)}
              </div>
            </div>
            
            <div
              className={cn(
                "text-xs text-muted-foreground",
                message.sender === 'user' ? "text-right" : "text-left"
              )}
            >
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(message.timestamp)}
            </div>
          </div>
          
          {message.sender === 'user' && (
            <Avatar className="h-8 w-8 bg-secondary order-first">
              <div className="text-xs font-semibold text-muted-foreground">You</div>
            </Avatar>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-2.5 max-w-[80%] mr-auto animate-fade-in">
          <Avatar className="h-8 w-8 bg-primary/20">
            <div className="text-xs font-semibold text-primary">AI</div>
          </Avatar>
          
          <div className="flex items-center px-4 py-2.5 rounded-2xl bg-secondary text-secondary-foreground rounded-tl-none">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
