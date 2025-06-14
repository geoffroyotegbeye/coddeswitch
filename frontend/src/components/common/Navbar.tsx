import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, User, LogOut, Menu, Settings, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Les liens de navigation ont été déplacés vers la barre latérale

  if (!user && !isGuest) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">CodeSwitch</span>
          </Link>

          {/* L'espace pour la navigation a été libéré */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Les liens de navigation ont été déplacés vers la barre latérale */}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => {
                    console.log('Informations utilisateur:', user);
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center space-x-3 p-1 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.xp} XP • Niveau {user.level}</p>
                  </div>
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                
                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                    
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Link>
                    
                    {/* Lien admin uniquement pour les utilisateurs avec is_admin=true */}
                    {user.is_admin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-purple-400 hover:bg-gray-700 hover:text-purple-300 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-700 mt-1">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isGuest && (
              <span className="text-sm text-gray-400">Mode invité</span>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {/* Les liens de navigation ont été déplacés vers la barre latérale */}
          </div>
        )}
      </div>
    </nav>
  );
}