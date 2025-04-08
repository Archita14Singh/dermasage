
import React from 'react';
import Header from '@/components/Header';
import SkinAnalysis from '@/components/SkinAnalysis';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';

const Analysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container px-4 max-w-6xl pt-24 pb-16">
        <section className="text-center mb-8 animate-fade-in-down">
          <Badge className="mb-4 py-1.5 px-4 bg-skin-purple/20 text-accent-foreground">
            AI-Powered Skin Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Analyze Your <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Skin Condition</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a clear, well-lit photo of your face to receive personalized insights and product recommendations tailored to your specific needs.
          </p>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 animate-fade-in-up">
            <SkinAnalysis />
          </section>
          
          <aside className="space-y-6 lg:col-span-1">
            <Card className="animate-fade-in-up">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">For Best Results</h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• Use natural lighting</li>
                      <li>• Remove makeup before taking a photo</li>
                      <li>• Take a front-facing photo</li>
                      <li>• Ensure your face is centered in the frame</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-3">How It Works</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="step1">
                    <AccordionTrigger className="text-sm">1. Upload Photo</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      Upload a clear photo of your face. Our system works best with well-lit images where your skin is clearly visible.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="step2">
                    <AccordionTrigger className="text-sm">2. AI Analysis</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      Our advanced AI analyzes your skin for various conditions including acne, dryness, oiliness, redness, and pigmentation.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="step3">
                    <AccordionTrigger className="text-sm">3. Detailed Results</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      Receive a comprehensive analysis with metrics that quantify different aspects of your skin health and condition.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="step4">
                    <AccordionTrigger className="text-sm">4. Personalized Recommendations</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      Get customized product recommendations and routine suggestions based on your unique skin profile.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="step5">
                    <AccordionTrigger className="text-sm">5. AI Consultation</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      Discuss your results with our AI skincare expert who can answer questions and provide additional guidance.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Important Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      This analysis is not a substitute for professional medical advice. For serious skin conditions, please consult a dermatologist.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
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
