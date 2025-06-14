import React, { useState } from 'react';
import { BookOpen, Lightbulb, ChevronRight, ChevronDown, Target, GraduationCap } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface ProjectSidebarProps {
  projectData: any;
  currentStepIndex: number;
  completedSteps: Set<string>;
  onStepSelect: (index: number) => void;
}

export function ProjectSidebar({ 
  projectData, 
  currentStepIndex, 
  completedSteps,
  onStepSelect 
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'hints' | 'lesson'>('instructions');
  const [showHints, setShowHints] = useState(false);

  const currentStep = projectData.steps[currentStepIndex];

  return (
    <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col h-[calc(100vh-130px)]">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'instructions'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Instructions
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'hints'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Indices
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'lesson'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <GraduationCap className="h-4 w-4 inline mr-2" />
          Leçon
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{currentStep.title}</h3>
              <p className="text-gray-300 mb-4">{currentStep.description}</p>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                {currentStep.instructions}
              </pre>
            </div>

            {currentStepIndex === 0 && (
              <Card className="p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-400" />
                  Objectifs d'apprentissage
                </h4>
                <ul className="space-y-2">
                  {projectData.learningObjectives.map((objective: string, index: number) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">💡 Indices utiles</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                icon={showHints ? ChevronDown : ChevronRight}
              >
                {showHints ? 'Masquer' : 'Révéler'}
              </Button>
            </div>
            
            {showHints && (
              <div className="space-y-3">
                {currentStep.hints.map((hint: string, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-500/10 p-2 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                      </div>
                      <p className="text-sm text-gray-300">{hint}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!showHints && (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Clique sur "Révéler" pour voir les indices</p>
                <p className="text-sm text-gray-500 mt-2">Essaie d'abord par toi-même !</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lesson' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Concepts clés</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                  {projectData.lesson || "Cette étape n'a pas encore de leçon associée."}
                </pre>
              </div>
            </div>

            {currentStep.keyConcepts && (
              <Card className="p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-purple-400" />
                  Points à retenir
                </h4>
                <ul className="space-y-2">
                  {currentStep.keyConcepts.map((concept: string, index: number) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      {concept}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}