import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import { Button } from './Button';

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">CodeSwitch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#technologies" className="text-gray-300 hover:text-white transition-colors">
              Technologies
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Témoignages
            </a>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </a>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Se connecter
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a 
              href="#features" 
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <a 
              href="#technologies" 
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Technologies
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Témoignages
            </a>
            <a 
              href="/blog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </a>
            <div className="px-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}