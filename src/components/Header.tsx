import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50",
      className
    )}>
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Malware<span className="text-apple-blue">Insight</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/analyze" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Analyze
            </Link>
            <a 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a 
              href="#technology" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Technology
            </a>
          </div>

          {/* CTA */}
          <Link 
            to="/analyze"
            className="gradient-blue text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-glow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Scanning
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
