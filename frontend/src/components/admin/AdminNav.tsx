import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, Search, Menu, User, Settings, LogOut, 
  Moon, Sun, ChevronDown, Home, UserCog, HelpCircle
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const AdminNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Exemple de notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Nouvel utilisateur',
      message: 'Un nouvel utilisateur s\'est inscrit',
      time: '5m',
      read: false
    },
    {
      id: '2',
      title: 'Mise à jour système',
      message: 'Une mise à jour du système est disponible',
      time: '1h',
      read: true
    }
  ]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Ici, vous pourriez implémenter la logique pour changer le thème
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Menu mobile */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu size={24} />
        </button>
        
        {/* Titre */}
        <div className="md:hidden font-semibold text-lg text-gray-800 dark:text-white">
          Admin
        </div>
        
        {/* Barre de recherche */}
        <div className="hidden md:flex flex-1 mx-4">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher..."
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Thème */}
          <button 
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Notifications
                  </h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Aucune notification
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Tout marquer comme lu
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Menu utilisateur */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user?.name || 'Admin'}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Home size={16} className="mr-2" />
                  Tableau de bord
                </button>
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => navigate('/admin/profile')}
                >
                  <UserCog size={16} className="mr-2" />
                  Profil
                </button>
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings size={16} className="mr-2" />
                  Paramètres
                </button>
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => navigate('/admin/help')}
                >
                  <HelpCircle size={16} className="mr-2" />
                  Aide
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu mobile déroulant */}
      {showMobileMenu && (
        <div className="md:hidden mt-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher..."
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
