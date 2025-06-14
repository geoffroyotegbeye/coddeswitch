import React, { ReactNode } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNav from '../components/admin/AdminNav';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - côté gauche fixe */}
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>
      
      {/* Contenu principal - partie droite */}
      <div className="flex-1 ml-64">
        {/* Barre de navigation supérieure */}
        <AdminNav />
        
        {/* Contenu de la page */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
