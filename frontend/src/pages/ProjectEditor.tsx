import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { useNotification } from '../contexts/NotificationContext';

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
  steps: {
    id: string;
    title: string;
    content: string;
    order: number;
  }[];
}

export function ProjectEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();
  const isEditing = Boolean(id);

  const [project, setProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    difficulty: 'beginner',
    language: 'javascript',
    type: 'tutorial',
    thumbnail: '',
    estimatedTime: '',
    xpReward: 100,
    steps: []
  });

  const handleChange = (field: keyof Project, value: any) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (stepId: string, field: string, value: string) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const addStep = () => {
    setProject(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now().toString(),
          title: '',
          content: '',
          order: prev.steps.length + 1
        }
      ]
    }));
  };

  const removeStep = (stepId: string) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save project
      showNotification({
        type: 'success',
        message: `Projet ${isEditing ? 'modifié' : 'créé'} avec succès`
      });
      navigate('/admin/projects');
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Une erreur est survenue lors de la sauvegarde'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Modifier le projet' : 'Nouveau projet'}
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Titre"
            value={project.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <Input
            label="Image de couverture"
            value={project.thumbnail}
            onChange={(e) => handleChange('thumbnail', e.target.value)}
            placeholder="URL de l'image"
          />
        </div>

        <Textarea
          label="Description"
          value={project.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Difficulté"
            value={project.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </Select>

          <Select
            label="Langage"
            value={project.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="python">Python</option>
          </Select>

          <Select
            label="Type"
            value={project.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="tutorial">Tutoriel</option>
            <option value="challenge">Défi</option>
            <option value="project">Projet</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Temps estimé"
            value={project.estimatedTime}
            onChange={(e) => handleChange('estimatedTime', e.target.value)}
            placeholder="ex: 2 heures"
            required
          />
          <Input
            label="Récompense XP"
            type="number"
            value={project.xpReward}
            onChange={(e) => handleChange('xpReward', parseInt(e.target.value))}
            required
          />
        </div>

        {/* Étapes du projet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Étapes du projet</h2>
            <Button
              variant="outline"
              onClick={addStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          {project.steps.map((step, index) => (
            <div key={step.id} className="p-4 bg-gray-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Étape {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(step.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <Input
                label="Titre de l'étape"
                value={step.title}
                onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                required
              />

              <Textarea
                label="Contenu"
                value={step.content}
                onChange={(e) => handleStepChange(step.id, 'content', e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}