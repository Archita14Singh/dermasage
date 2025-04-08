
import React from 'react';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Camera, MessageSquare, ChartLine, Shield, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      <Header />
      
      <main className="container px-4 max-w-6xl pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-skin-blue/20 text-primary">
            Next-Gen Skincare AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Your Path to <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Healthier Skin</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            DermaSage combines AI analysis, personalized recommendations, and progress tracking to transform your skincare routine. Start your journey to healthier skin today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg"
              className="gap-2"
              onClick={() => navigate('/analysis')}
            >
              <Camera className="w-5 h-5" />
              Analyze Your Skin
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare className="w-5 h-5" />
              Chat with AI Expert
            </Button>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card 
            className="p-6 rounded-xl animate-fade-in-up transition-all hover:shadow-md hover:-translate-y-1"
            style={{ animationDelay: '100ms' }}
            onClick={() => navigate('/analysis')}
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
              onClick={() => navigate('/analysis')}
            >
              Analyze Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
          
          <Card 
            className="p-6 rounded-xl animate-fade-in-up transition-all hover:shadow-md hover:-translate-y-1"
            style={{ animationDelay: '200ms' }}
            onClick={() => navigate('/chat')}
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
          </Card>
          
          <Card 
            className="p-6 rounded-xl animate-fade-in-up transition-all hover:shadow-md hover:-translate-y-1"
            style={{ animationDelay: '300ms' }}
            onClick={() => navigate('/progress')}
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
          </Card>
        </section>
        
        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Badge className="mb-3 py-1 px-2.5 bg-skin-purple/20 text-accent-foreground">
              Benefits
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Why Choose DermaSage?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform helps you understand and improve your skin health with AI-powered insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-border/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-skin-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Personalized Care</h3>
                <p className="text-muted-foreground">Customized recommendations based on your unique skin profile and concerns.</p>
              </div>
            </div>
            
            <div className="p-5 rounded-lg border border-border/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-skin-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Advanced Technology</h3>
                <p className="text-muted-foreground">AI-powered analysis that identifies concerns invisible to the naked eye.</p>
              </div>
            </div>
            
            <div className="p-5 rounded-lg border border-border/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-skin-pink/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ChartLine className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Progress Monitoring</h3>
                <p className="text-muted-foreground">Track improvement over time and see the results of your skincare routine.</p>
              </div>
            </div>
            
            <div className="p-5 rounded-lg border border-border/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-skin-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Expert Guidance</h3>
                <p className="text-muted-foreground">Get advice that aligns with dermatologist recommendations and best practices.</p>
              </div>
            </div>
            
            <div className="p-5 rounded-lg border border-border/50 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-skin-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Visual Analysis</h3>
                <p className="text-muted-foreground">Upload photos to receive detailed insights into your skin conditions and concerns.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 px-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 max-w-4xl mx-auto text-center">
          <Badge className="mb-4 py-1 px-2.5 bg-skin-light/80 text-green-700">
            Start Your Journey
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Ready for healthier, happier skin?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Begin with a skin analysis, chat with our AI, or start tracking your progress today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/analysis')}>
              Analyze Your Skin
            </Button>
            <Button variant="outline" onClick={() => navigate('/chat')}>
              Chat with AI
            </Button>
          </div>
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
