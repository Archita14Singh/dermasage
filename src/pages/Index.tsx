import React from 'react';
import Header from '@/components/Header';
import SkinAnalysis from '@/components/SkinAnalysis';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Camera, MessageSquare, ChartLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container px-4 max-w-6xl pt-24 pb-16">
        <section className="text-center mb-12 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-accent/30 text-accent-foreground">
            AI-Powered Skin Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Your Personal Skincare <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Assistant</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload a photo to get AI-powered skin analysis and personalized recommendations tailored to your unique skin needs.
          </p>
        </section>
        
        <section className="mb-16 max-w-3xl mx-auto animate-fade-in-up">
          <SkinAnalysis />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div 
            className="glass-card p-6 rounded-xl animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-12 h-12 bg-skin-blue/30 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Skin Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Upload a photo to get an instant analysis of your skin conditions with AI-powered technology.
            </p>
            <Button 
              variant="ghost" 
              className="flex items-center" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Try Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div 
            className="glass-card p-6 rounded-xl animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-12 h-12 bg-skin-purple/30 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Skincare Chat</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized skincare advice and recommendations through our intelligent chatbot.
            </p>
            <Button 
              variant="ghost" 
              className="flex items-center"
              onClick={() => navigate('/chat')}
            >
              Chat Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div 
            className="glass-card p-6 rounded-xl animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="w-12 h-12 bg-skin-pink/30 rounded-full flex items-center justify-center mb-4">
              <ChartLine className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground mb-4">
              Monitor your skin's improvement over time with our progress tracking and journaling tools.
            </p>
            <Button 
              variant="ghost" 
              className="flex items-center"
              onClick={() => navigate('/progress')}
            >
              Track Progress
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
        
        <section className="text-center py-10 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 max-w-4xl mx-auto">
          <Badge className="mb-4 py-1 px-2.5 bg-skin-light/80 text-green-700">
            Dermatologist-Approved
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            AI-powered skincare that actually works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4">
            Our advanced algorithms analyze your skin with clinical-level accuracy, providing the most effective and personalized recommendations for your unique skin needs.
          </p>
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

export default Index;
