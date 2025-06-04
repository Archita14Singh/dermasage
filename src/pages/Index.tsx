
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Activity, Database, Camera, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Skin Analysis',
      description: 'Advanced AI-powered analysis of your skin conditions with detailed insights and recommendations.',
      link: '/analysis',
      color: 'text-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Chat with AI',
      description: 'Get personalized skincare advice and answers to your questions from our AI assistant.',
      link: '/chat',
      color: 'text-green-600'
    },
    {
      icon: Activity,
      title: 'Progress Tracking',
      description: 'Track your skin health journey with detailed progress monitoring and insights.',
      link: '/progress',
      color: 'text-purple-600'
    },
    {
      icon: Database,
      title: 'Custom Datasets',
      description: 'Create and train custom AI models with your own skin condition datasets.',
      link: '/dataset',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              DermaSage
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            AI-Powered Skin Analysis and Personalized Skincare Solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/analysis">
              <Button size="lg" className="w-full sm:w-auto">
                <Camera className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Transform Your Skincare Journey?</CardTitle>
              <CardDescription>
                Join thousands of users who trust DermaSage for their skin health needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analysis">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
