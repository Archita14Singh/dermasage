import React from 'react';
import Header from '@/components/Header';
import ProgressTracker from '@/components/ProgressTracker';
import { Badge } from '@/components/ui/badge';

const Progress = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container px-4 max-w-6xl pt-24 pb-16">
        <section className="text-center mb-8 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-skin-pink/20 text-rose-700">
            Track Your Progress
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Monitor Your Skincare <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track improvements in your skin conditions over time and maintain a visual journal of your progress.
          </p>
        </section>
        
        <section className="max-w-5xl mx-auto animate-fade-in-up">
          <ProgressTracker />
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

export default Progress;
