import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, Code, Newspaper, BarChart2, Home, Settings, HelpCircle
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  return (
    <div className="mb-1">
      <NavLink
        to={to}
        className={({ isActive }) => 
          `flex items-center p-3 text-gray-200 hover:bg-purple-700 rounded-lg transition-all ${
            isActive ? 'bg-purple-700' : ''
          }`
        }
      >
        <span className="mr-3 text-xl">{icon}</span>
        <span className="flex-1">{label}</span>
      </NavLink>
    </div>
  );
};

const AdminSidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 shadow-lg">
      <div className="flex flex-col items-center justify-center mb-8 pt-4">
        <h2 className="text-2xl font-bold">CodeSwitch</h2>
        <p className="text-sm text-gray-200">Administration</p>
      </div>
      
      <nav className="space-y-2">
        <SidebarItem 
          to="/admin/dashboard" 
          icon={<BarChart2 size={20} />} 
          label="Tableau de bord" 
        />
        
        <SidebarItem 
          to="/admin/users" 
          icon={<Users size={20} />} 
          label="Utilisateurs"
        />
        
        <SidebarItem 
          to="/admin/projects" 
          icon={<Code size={20} />} 
          label="Projets"
        />
        
        <SidebarItem 
          to="/admin/blog" 
          icon={<Newspaper size={20} />} 
          label="Blog"
        />
      </nav>
    </div>
  );
};

export default AdminSidebar;
