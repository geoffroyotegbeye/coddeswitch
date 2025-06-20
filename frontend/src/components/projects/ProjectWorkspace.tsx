import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from './CodeEditor';
import { ProjectHeader } from './ProjectHeader';
import { ProjectSidebar } from './ProjectSidebar';
import { SuccessModal } from './SuccessModal';
import { mockProjectData } from '../../data/projectData';
import { useNotification } from '../../contexts/NotificationContext';

interface ProjectStep {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
}

interface ProjectData {
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
}

interface ProjectWorkspaceProps {
  standalone?: boolean;
}

export function ProjectWorkspace({ standalone = false }: ProjectWorkspaceProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [shouldReset, setShouldReset] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const projectData: ProjectData = {
    ...mockProjectData,
    steps: [
      {
        id: '1',
        title: 'Structure HTML',
        description: 'Créer la structure de base du portfolio',
        instructions: mockProjectData.instructions,
        starterCode: mockProjectData.starterCode,
        expectedOutput: mockProjectData.expectedOutput,
        hints: mockProjectData.hints
      }
    ]
  };

  const currentStep = projectData.steps[currentStepIndex];

  useEffect(() => {
    if (currentStep) {
      const storageKey = `codeswitch_tabs_${id}`;
      const savedTabs = localStorage.getItem(storageKey);
      
      if (savedTabs && !shouldReset) {
        try {
          const parsedTabs = JSON.parse(savedTabs);
          const htmlTab = parsedTabs.find((tab: any) => tab.language === 'html');
          if (htmlTab) {
            setUserCode(htmlTab.content);
            return;
          }
        } catch (error) {
          console.error('Erreur lors du chargement du code sauvegardé:', error);
        }
      }
      
      setUserCode(currentStep.starterCode);
      setShouldReset(false);
    }
  }, [currentStepIndex, currentStep, id, shouldReset]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleStepComplete = () => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep.id);
    setCompletedSteps(newCompletedSteps);
    setIsStepCompleted(true);
    
    setTimeout(() => {
      if (currentStepIndex < projectData.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsStepCompleted(false);
      }
    }, 2000);
  };

  const handleCodeSubmit = (code: string) => {
    setUserCode(code);
    handleStepComplete();
  };

  const handleBack = () => {
    if (standalone) {
      window.close();
    } else {
      navigate('/projects');
    }
  };

  const handleReset = () => {
    setShouldReset(true);
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      // Récupérer tous les onglets depuis le localStorage
      const storageKey = `codeswitch_tabs_${id}`;
      const savedTabs = localStorage.getItem(storageKey);
      let codeToSave = userCode;
      
      if (savedTabs) {
        try {
          const parsedTabs = JSON.parse(savedTabs);
          const htmlTab = parsedTabs.find((tab: any) => tab.language === 'html');
          if (htmlTab) {
            codeToSave = htmlTab.content;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des onglets:', error);
        }
      }

      // TODO: Remplacer par votre appel API réel
      const response = await fetch(`/api/projects/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeToSave,
          stepIndex: currentStepIndex,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      showNotification({
        type: 'success',
        message: 'Code sauvegardé avec succès !',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification({
        type: 'error',
        message: 'Erreur lors de la sauvegarde du code',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-130px)] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="h-[calc(100vh-130px)] bg-gray-900 flex items-center justify-center">
        <div className="text-white">Projet non trouvé</div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / projectData.steps.length) * 100;

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col bg-gray-900">
      <ProjectHeader
        projectData={projectData}
        progressPercentage={progressPercentage}
        onBack={handleBack}
      />

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="w-full border-r border-gray-700">
          <CodeEditor
            initialCode={userCode}
            language={projectData.language}
            stepTitle={currentStep.title}
            stepNumber={currentStepIndex + 1}
            totalSteps={projectData.steps.length}
            isCompleted={isStepCompleted}
            onSubmit={handleCodeSubmit}
            onReset={handleReset}
            onSave={handleSave}
          />
        </div>

        {/* Sidebar */}
        <div className="w-96">
          <ProjectSidebar
            projectData={projectData}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
            onStepSelect={setCurrentStepIndex}
          />
        </div>
      </div>

      {isStepCompleted && (
        <SuccessModal 
          stepTitle={currentStep.title}
          isLastStep={currentStepIndex === projectData.steps.length - 1}
        />
      )}
    </div>
  );
} 