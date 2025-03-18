
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { Camera, MessageSquare, ChartLine } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Analysis', path: '/', icon: <Camera className="w-4 h-4 mr-1" /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare className="w-4 h-4 mr-1" /> },
    { name: 'Progress', path: '/progress', icon: <ChartLine className="w-4 h-4 mr-1" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out py-4 px-6',
        {
          'bg-white/80 backdrop-blur-sm shadow-sm': scrolled,
          'bg-transparent': !scrolled
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-medium tracking-tight">
            <span className="font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              SkinWise
            </span>
          </h1>
          <Badge className="ml-2 bg-skin-purple/20 text-accent-foreground hover:bg-skin-purple/30 transition-colors">
            AI-Powered
          </Badge>
        </div>
        
        <nav className="hidden sm:flex">
          <ul className="flex space-x-1 bg-secondary/80 backdrop-blur-sm p-1 rounded-full shadow-subtle">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                    location.pathname === item.path
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sm:hidden">
          <div className="flex space-x-1 bg-secondary/80 backdrop-blur-sm p-1 rounded-full shadow-subtle">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'p-2 rounded-full transition-all duration-300',
                  location.pathname === item.path
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                )}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
