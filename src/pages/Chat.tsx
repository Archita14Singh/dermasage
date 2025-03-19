import React from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Badge } from '@/components/ui/badge';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container px-4 max-w-4xl pt-24 pb-16">
        <section className="text-center mb-8 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-skin-purple/20 text-accent-foreground">
            Intelligent Skincare Assistant
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Chat with Your Personal <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Skin Expert</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions, get personalized recommendations, and upload photos for real-time skin analysis. Your skin analysis results will automatically appear here if you've just completed one!
          </p>
        </section>
        
        <section className="max-w-3xl mx-auto animate-fade-in-up">
          <Chatbot />
        </section>
      </main>
      
      <footer className="py-8 border-t text-center text-sm text-muted-foreground bg-white/50 backdrop-blur-sm">
        <div className="container">
          <p>© 2024 DermaSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
