import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/analysis', label: 'Skin Analysis' },
    { path: '/chat', label: 'AI Chat' },
    { path: '/progress', label: 'Progress' },
    { path: '/dataset', label: 'Datasets' },
  ];
  
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          SkinWise
        </Link>
        
        <nav className="flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link key={item.path} to={item.path} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
