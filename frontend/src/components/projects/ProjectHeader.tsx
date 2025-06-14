import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ProjectHeaderProps {
  projectData: any;
  progressPercentage: number;
  onBack: () => void;
}

export function ProjectHeader({ projectData, progressPercentage, onBack }: ProjectHeaderProps) {
  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  };

  const typeLabels = {
    tutorial: 'Tutoriel',
    challenge: 'Défi',
    project: 'Projet'
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 py-1 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-base font-bold text-white">{projectData.title}</h1>
            <div className="flex items-center space-x-2 mt-0.5">
              <Badge variant="success" className="text-xs py-0.5 px-1.5">{difficultyLabels[projectData.difficulty]}</Badge>
              <Badge variant="secondary" className="text-xs py-0.5 px-1.5">{projectData.language.toUpperCase()}</Badge>
              <Badge variant="primary" className="text-xs py-0.5 px-1.5">{typeLabels[projectData.type]}</Badge>
              <span className="text-xs text-gray-400">{projectData.estimatedTime}</span>
              <span className="text-xs text-yellow-400">⭐ {projectData.xpReward} XP</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right mr-4">
            <div className="text-sm text-gray-400">Progression</div>
            <div className="text-lg font-bold text-purple-400">{Math.round(progressPercentage)}%</div>
          </div>
          <Button variant="outline" size="sm">
            Sauvegarder Progression
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}