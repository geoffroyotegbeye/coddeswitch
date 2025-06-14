import React from 'react';
import { Trophy, Clock } from 'lucide-react';
import { Card } from '../common/Card';

interface SuccessModalProps {
  stepTitle: string;
  isLastStep: boolean;
}

export function SuccessModal({ stepTitle, isLastStep }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="bg-green-500/10 p-4 rounded-full inline-block mb-4">
            <Trophy className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isLastStep ? 'Projet terminé !' : 'Étape terminée !'}
          </h3>
          <p className="text-gray-300 mb-4">
            {isLastStep 
              ? `Félicitations ! Tu as complété tout le projet "${stepTitle}".`
              : `Excellent travail ! Tu as complété l'étape "${stepTitle}".`
            }
          </p>
          {!isLastStep && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Passage à l'étape suivante...</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}