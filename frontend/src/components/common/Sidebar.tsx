import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Briefcase, Award, Users, MessageCircle, BookOpen, Settings
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, external }) => {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center py-2 px-4 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <Icon className="h-5 w-5 mr-3" />
        <span>{label}</span>
      </a>
    );
  }
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2 px-4 rounded-md transition-colors ${
          isActive
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </NavLink>
  );
};

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border border-gray-700 h-[calc(100vh-64px)] p-4 overflow-y-auto fixed left-0 top-16">
      <div className="space-y-2">
        <div className="text-gray-400 uppercase text-xs font-semibold px-4 py-2">
          Principal
        </div>
        <SidebarItem to="/dashboard" icon={Home} label="Tableau de bord" />
        <SidebarItem to="/projects" icon={Briefcase} label="Projets" />
        <SidebarItem to="/challenges" icon={Award} label="Défis" />
        
        <div className="text-gray-400 uppercase text-xs font-semibold px-4 py-2 mt-6">
          Social
        </div>
        <SidebarItem to="/community" icon={Users} label="Communauté" />
        <SidebarItem to="/messages" icon={MessageCircle} label="Messages" />
        <SidebarItem to="/blog" icon={BookOpen} label="Blog" external={true} />
        
        <SidebarItem to="/settings" icon={Settings} label="Paramètres" />
      </div>
    </aside>
  );
}
