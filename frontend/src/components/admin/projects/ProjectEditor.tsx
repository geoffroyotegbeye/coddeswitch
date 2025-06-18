import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { Select } from '../../../components/common/Select';
import { MonacoEditor } from '../../../components/projects/MonacoEditor';
import { RichTextEditor } from '../../../components/common/RichTextEditor';
import { Save, ChevronLeft, ChevronRight, TrashIcon, PlusIcon } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';

interface ProjectStep {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  xpReward: number;
  estimatedTime: string;
  learningObjectives: string[];
  prerequisites: string[];
  lesson: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  steps: ProjectStep[];
  tests: {
    description: string;
    testCode: string;
    expectedOutput: string;
  }[];
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  startCode: string;
  languages: string[];
}

interface ProjectEditorProps {
  project?: Project;
  onSave: (project: Project) => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project,
  onSave,
}) => {
  const { showNotification } = useNotification();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projectData, setProjectData] = useState<Project>(project || {
    id: '',
    title: '',
    description: '',
    language: 'html',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: '',
    learningObjectives: [''],
    prerequisites: [''],
    lesson: '',
    instructions: '',
    starterCode: '',
    expectedOutput: '',
    hints: [''],
    steps: [{
      id: '1',
      title: '',
      description: '',
      instructions: '',
      starterCode: '',
      expectedOutput: '',
      hints: ['']
    }],
    tests: [],
    category: '',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startCode: '',
    languages: []
  });

  const totalSlides = 5;

  const handleChange = (field: keyof Project, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'learningObjectives' | 'prerequisites' | 'hints', index: number, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'learningObjectives' | 'prerequisites' | 'hints') => {
    setProjectData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'learningObjectives' | 'prerequisites' | 'hints', index: number) => {
    setProjectData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleStepChange = (index: number, field: keyof ProjectStep, value: any) => {
    const newSteps = [...projectData.steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value
    };
    setProjectData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setProjectData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: (prev.steps.length + 1).toString(),
          title: '',
          description: '',
          instructions: '',
          starterCode: '',
          expectedOutput: '',
          hints: ['']
        }
      ]
    }));
  };

  const removeStep = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!projectData.title || !projectData.description) {
      showNotification('error', 'Le titre et la description sont requis');
      return;
    }

    if (projectData.steps.length === 0) {
      showNotification('error', 'Ajoutez au moins une étape au projet');
      return;
    }

    onSave(projectData);
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Informations générales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Entrez le titre du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white h-32"
                  placeholder="Décrivez le projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Langages de programmation
                </label>
                <div className="flex flex-wrap gap-2">
                  {['HTML', 'CSS', 'JavaScript', 'Python'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        const newLanguages = projectData.languages.includes(lang)
                          ? projectData.languages.filter(l => l !== lang)
                          : [...projectData.languages, lang];
                        handleChange('languages', newLanguages);
                      }}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        projectData.languages.includes(lang)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulté
                </label>
                <select
                  value={projectData.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Temps estimé (en minutes)
                </label>
                <input
                  type="number"
                  value={projectData.estimatedTime}
                  onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  min="0"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Leçon</h2>
            <div className="h-[500px] flex flex-col">
              <RichTextEditor
                value={projectData.lesson}
                onChange={(content) => handleChange('lesson', content)}
                height="500px"
                placeholder="Écrivez votre leçon ici..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Instructions</h2>
            <div className="h-[500px] flex flex-col">
              <RichTextEditor
                value={projectData.instructions}
                onChange={(content) => handleChange('instructions', content)}
                height="500px"
                placeholder="Écrivez vos instructions ici..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Objectifs, Prérequis et Indices</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Objectifs d'apprentissage</h3>
              <div className="h-[200px] flex flex-col">
                <RichTextEditor
                  value={projectData.learningObjectives.join('\n')}
                  onChange={(content) => handleChange('learningObjectives', content.split('\n'))}
                  height="200px"
                  placeholder="Listez vos objectifs d'apprentissage..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Prérequis</h3>
              <div className="h-[200px] flex flex-col">
                <RichTextEditor
                  value={projectData.prerequisites.join('\n')}
                  onChange={(content) => handleChange('prerequisites', content.split('\n'))}
                  height="200px"
                  placeholder="Listez les prérequis..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Indices</h3>
              <div className="h-[200px] flex flex-col">
                <RichTextEditor
                  value={projectData.hints.join('\n')}
                  onChange={(content) => handleChange('hints', content.split('\n'))}
                  height="200px"
                  placeholder="Listez les indices..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Code de départ</h2>
            <div className="h-[800px] flex flex-col">
              <MonacoEditor
                language="javascript"
                theme="vs-dark"
                value={projectData.startCode}
                onChange={(value) => handleChange('startCode', value || '')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const addTest = () => {
    setProjectData(prev => ({
      ...prev,
      tests: [...prev.tests, {
        description: '',
        testCode: '',
        expectedOutput: ''
      }]
    }));
  };

  const removeTest = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const updateTest = (index: number, field: 'description' | 'testCode' | 'expectedOutput', value: string) => {
    setProjectData(prev => ({
      ...prev,
      tests: prev.tests.map((test, i) => 
        i === index ? { ...test, [field]: value } : test
      )
    }));
  };

  return (
    <div className="space-y-6">
      {renderSlide()}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={() => setCurrentSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        {currentSlide === totalSlides - 1 ? (
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        ) : (
          <Button onClick={() => setCurrentSlide(currentSlide + 1)}>
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;

