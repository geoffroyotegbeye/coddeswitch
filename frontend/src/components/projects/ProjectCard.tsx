import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { Project } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  viewMode?: 'grid' | 'list';
}

export function ProjectCard({ project, onSelect, viewMode = 'grid' }: ProjectCardProps) {
  // Fonction pour ouvrir le projet dans un nouvel onglet en mode standalone
  const handleProjectClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Comportement par défaut si Ctrl/Cmd est pressé
      return;
    }
    
    e.preventDefault();
    // Ouvrir en mode standalone dans un nouvel onglet
    window.open(`/project-standalone/${project.id}`, '_blank', 'noopener,noreferrer');
    
    // Appeler également onSelect pour maintenir la compatibilité
    if (onSelect) {
      onSelect(project);
    }
  };
  
  const languageColors = {
    html: 'bg-orange-500',
    css: 'bg-blue-500',
    javascript: 'bg-yellow-500',
    react: 'bg-cyan-500',
    python: 'bg-green-500'
  };

  const difficultyColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  } as const;

  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  };

  if (viewMode === 'list') {
    return (
      <Card hover className="p-6">
        <a href={`/project-standalone/${project.id}`} onClick={handleProjectClick} target="_blank" rel="noopener noreferrer" className="block w-full h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="flex items-center space-x-6">
          {/* Thumbnail */}
          <div className="w-24 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-white truncate">
                {project.title}
              </h3>
              <div className={`w-3 h-3 rounded-full ${languageColors[project.language || 'html']} flex-shrink-0 ml-2`} />
            </div>
            
            <p className="text-gray-400 text-sm mb-3 line-clamp-1">
              {project.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge variant={difficultyColors[project.difficulty]} size="sm">
                  {difficultyLabels[project.difficulty]}
                </Badge>
                <Badge variant="secondary" size="sm">
                  {(project.language || 'html').toUpperCase()}
                </Badge>
                {project.type === 'challenge' && (
                  <Badge variant="primary" size="sm">Défi</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {project.estimatedTime}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {project.xpReward} XP
                </div>
              </div>
            </div>
          </div>
        </div>
        </a>
      </Card>
    );
  }

  return (
    <Card hover>
      <a href={`/project-standalone/${project.id}`} onClick={(e) => handleProjectClick(e)} target="_blank" rel="noopener noreferrer" className="block w-full h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {project.title}
          </h3>
          <div className={`w-3 h-3 rounded-full ${languageColors[project.language || 'html']} flex-shrink-0 ml-2`} />
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant={difficultyColors[project.difficulty]}>
            {difficultyLabels[project.difficulty]}
          </Badge>
          <Badge variant="secondary">
            {(project.language || 'html').toUpperCase()}
          </Badge>
          {project.type === 'challenge' && (
            <Badge variant="primary">Défi</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {project.estimatedTime}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {project.completedBy}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            {project.xpReward} XP
          </div>
        </div>
      </div>
      </a>
    </Card>
  );
}