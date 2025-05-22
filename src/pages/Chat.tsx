
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Badge } from '@/components/ui/badge';
import { loadSkinAnalysisModel } from '@/utils/modelLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Camera, Sun, CloudRain, Wind } from 'lucide-react';
import { toast } from 'sonner';

const Chat = () => {
  // Preload models in the background when the chat page loads
  useEffect(() => {
    const preloadModels = async () => {
      try {
        // Start loading the basic model in the background
        loadSkinAnalysisModel('general').then(() => {
          console.log('Basic skin analysis model loaded');
          toast.success('Analysis capabilities ready', {
            description: 'You can now upload photos for skin analysis',
            duration: 5000
          });
        });
      } catch (error) {
        console.error('Error preloading models:', error);
      }
    };
    
    preloadModels();
  }, []);

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
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Photo Analysis</h3>
                <p className="text-sm text-blue-700">Upload photos for AI analysis</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Bot className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">AI Recommendations</h3>
                <p className="text-sm text-amber-700">Personalized skincare advice</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Sun className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Environmental Analysis</h3>
                <p className="text-sm text-green-700">Climate impact on your skin</p>
              </div>
            </CardContent>
          </Card>
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
