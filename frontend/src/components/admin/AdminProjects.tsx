import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { Project } from '../../types';
import ProjectsList from './projects/ProjectsList';
import ProjectEditor from './projects/ProjectEditor';

function ProjectsListContainer() {
  const navigate = useNavigate();
  const { success } = useNotification();

  const handleEditProject = (project: Project) => {
    navigate(`/admin/projects/edit/${project.id}`);
  };

  const handleViewProject = (project: Project) => {
    // Ouvrir le projet dans un nouvel onglet
    window.open(`/project/${project.id}`, '_blank');
  };

  const handleDeleteProject = (projectId: string) => {
    // Ici, vous pourriez appeler une API pour supprimer le projet
    success('Projet supprimé avec succès');
  };

  const handleAddProject = () => {
    navigate('/admin/projects/new');
  };

  return (
    <ProjectsList 
      onEditProject={handleEditProject}
      onViewProject={handleViewProject}
      onDeleteProject={handleDeleteProject}
      onAddProject={handleAddProject}
    />
  );
}

function ProjectEditorContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { success } = useNotification();
  const [initialProject, setInitialProject] = useState<Project | undefined>(undefined);

  // Simuler le chargement des données d'un projet existant
  React.useEffect(() => {
    if (id) {
      // Dans une application réelle, vous feriez un appel API ici
      // Simulation d'un projet pour l'édition
      setInitialProject({
        id,
        name: 'Portfolio Personnel',
        description: 'Un portfolio moderne pour développeurs avec sections personnalisables',
        difficulty: 'intermediate',
        category: 'frontend',
        tags: ['react', 'tailwind', 'portfolio'],
        created_at: '2025-03-15T10:30:00Z',
        updated_at: '2025-06-01T14:25:00Z',
        stars: 124,
        author_id: '1',
        author_name: 'Jean Dupont',
        image_url: 'https://via.placeholder.com/300x200?text=Portfolio'
      });
    }
  }, [id]);

  const handleSave = (project: Project) => {
    // Dans une application réelle, vous feriez un appel API ici
    success(id ? 'Projet mis à jour avec succès' : 'Projet créé avec succès');
    navigate('/admin/projects');
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  return (
    <ProjectEditor
      initialProject={initialProject}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}

export function AdminProjects() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsListContainer />} />
      <Route path="/new" element={<ProjectEditorContainer />} />
      <Route path="/edit/:id" element={<ProjectEditorContainer />} />
    </Routes>
  );
}