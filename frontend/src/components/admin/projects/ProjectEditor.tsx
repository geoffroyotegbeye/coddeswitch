import { useState } from "react";
import { Save, X, Image, Tag, Code, Star } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Select } from "../../../components/common/Select";
import { Textarea } from "../../../components/common/Textarea";
import { useNotification } from "../../../contexts/NotificationContext";

const ProjectEditor = ({
  initialProject,
  onSave,
  onCancel
}: {
  initialProject?: any;
  onSave: (project: any) => void;
  onCancel: () => void;
}) => {
  const { showNotification } = useNotification();
  const [project, setProject] = useState(initialProject || {
    title: '',
    description: '',
    thumbnail: '',
    difficulty: 'beginner',
    language: 'javascript',
    type: 'project',
    estimatedTime: '',
    xpReward: '',
    steps: []
  });

  const handleChange = (field: string, value: any) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...project.steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value
    };
    setProject(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setProject(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: '',
          description: '',
          order: prev.steps.length + 1
        }
      ]
    }));
  };

  const removeStep = (index: number) => {
    const newSteps = project.steps.filter((_: any, i: number) => i !== index);
    setProject(prev => ({
      ...prev,
      steps: newSteps.map((step: any, i: number) => ({
        ...step,
        order: i + 1
      }))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!project.title || !project.description) {
      showNotification('error', 'Le titre et la description sont requis');
      return;
    }

    if (project.steps.length === 0) {
      showNotification('error', 'Ajoutez au moins une étape au projet');
      return;
    }

    onSave(project);
    showNotification('success', 'Projet sauvegardé avec succès');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Titre du projet"
          value={project.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
        <Input
          label="Image de couverture (URL)"
          value={project.thumbnail}
          onChange={(e) => handleChange('thumbnail', e.target.value)}
          icon={Image}
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
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </Select>

        <Select
          label="Type"
          value={project.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="project">Projet</option>
          <option value="tutorial">Tutoriel</option>
          <option value="challenge">Défi</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Temps estimé"
          value={project.estimatedTime}
          onChange={(e) => handleChange('estimatedTime', e.target.value)}
          placeholder="ex: 2 heures"
        />
        <Input
          label="Récompense XP"
          value={project.xpReward}
          onChange={(e) => handleChange('xpReward', e.target.value)}
          type="number"
          min="0"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Étapes du projet</h3>
          <Button
            type="button"
            variant="outline"
            onClick={addStep}
          >
            Ajouter une étape
          </Button>
        </div>

        {project.steps.map((step: any, index: number) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <Input
                  label={`Étape ${index + 1}`}
                  value={step.title}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  required
                />
                <Textarea
                  label="Description"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="ml-4"
                onClick={() => removeStep(index)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};

export default ProjectEditor;
