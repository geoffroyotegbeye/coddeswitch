import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant de route protégée pour les administrateurs
 * Redirige vers la page d'accueil si l'utilisateur n'est pas administrateur
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est authentifié et est un administrateur, afficher le contenu protégé
  return children;
};

export default AdminRoute;
