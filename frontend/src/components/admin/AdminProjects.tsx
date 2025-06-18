import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import ProjectEditor from './projects/ProjectEditor';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Plus, Search, Edit, Trash, Eye, ChevronLeft } from 'lucide-react';
import { mockProjectData } from '../../data/projectData';
import { Project } from '../../types';

// Créer un tableau de projets pour les tests
const mockProjects: Project[] = [
  mockProjectData,
  {
    ...mockProjectData,
    id: '2',
    title: 'Application Todo List',
    language: 'javascript',
    difficulty: 'intermediate'
  },
  {
    ...mockProjectData,
    id: '3',
    title: 'Blog avec React',
    language: 'react',
    difficulty: 'advanced'
  }
];

function ProjectsListContainer() {
  const navigate = useNavigate();
  const { success } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProject = () => {
    navigate('/admin/projects/new');
  };

  const filteredProjects = mockProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projets</h1>
        <Button
          onClick={handleCreateProject}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Langage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Difficulté
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.language}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.difficulty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/project-standalone/${project.id}`)}
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* TODO: Implement delete */}}
                      title="Supprimer"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectEditorContainer() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {id ? 'Modifier le projet' : 'Nouveau projet'}
        </h1>
      </div>

    <ProjectEditor
        project={id ? mockProjects.find(p => p.id === id) : undefined}
        onSave={() => navigate('/admin/projects')}
    />
    </div>
  );
}

export default function AdminProjects() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsListContainer />} />
      <Route path="/new" element={<ProjectEditorContainer />} />
      <Route path="/edit/:id" element={<ProjectEditorContainer />} />
    </Routes>
  );
}