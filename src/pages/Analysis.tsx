
import React from 'react';
import Header from '@/components/Header';
import SkinAnalysis from '@/components/SkinAnalysis';
import { Badge } from '@/components/ui/badge';

const Analysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container px-4 max-w-4xl pt-24 pb-16">
        <section className="text-center mb-8 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-skin-purple/20 text-accent-foreground">
            AI-Powered Skin Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Analyze Your <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Skin Condition</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your skin to receive personalized insights and product recommendations tailored to your specific needs.
          </p>
        </section>
        
        <section className="max-w-3xl mx-auto animate-fade-in-up">
          <SkinAnalysis />
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

export default Analysis;
