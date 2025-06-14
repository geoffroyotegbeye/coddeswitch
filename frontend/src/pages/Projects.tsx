import React, { useState } from 'react';
import { Grid, List, Search, Filter } from 'lucide-react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  type: 'tutorial' | 'challenge' | 'project';
  thumbnail: string;
  estimatedTime: string;
  xpReward: number;
  completedBy: number;
}

export function Projects() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Exemple de projets (à remplacer par des données réelles)
  const projects: Project[] = [
    {
      id: '1',
      title: 'Portfolio Personnel',
      description: 'Créez un portfolio moderne avec React et Tailwind CSS',
      difficulty: 'beginner',
      language: 'react',
      type: 'project',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      estimatedTime: '2 heures',
      xpReward: 100,
      completedBy: 1234
    },
    {
      id: '2',
      title: 'Application Todo List',
      description: 'Développez une application de gestion de tâches complète',
      difficulty: 'intermediate',
      language: 'javascript',
      type: 'project',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
      estimatedTime: '3 heures',
      xpReward: 150,
      completedBy: 856
    },
    // Ajoutez plus de projets ici
  ];

  // Filtrage des projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'all' || project.language === selectedLanguage;
    
    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-gray-400">
            Explorez et complétez des projets pour améliorer vos compétences
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Rechercher des projets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <Select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          icon={Filter}
        >
          <option value="all">Tous les niveaux</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </Select>
        <Select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          icon={Filter}
        >
          <option value="all">Tous les langages</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="python">Python</option>
        </Select>
      </div>

      {/* Liste des projets */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            viewMode={viewMode}
            onSelect={() => {}}
          />
        ))}
      </div>

      {/* Message si aucun projet trouvé */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            Aucun projet ne correspond à vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}