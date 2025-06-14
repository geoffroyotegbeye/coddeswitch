import React from 'react';

interface EditorStatusBarProps {
  hasChanges: boolean;
  stepNumber?: number;
  totalSteps?: number;
  code: string;
}

export function EditorStatusBar({ hasChanges, stepNumber, totalSteps, code }: EditorStatusBarProps) {
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="h-8 bg-gray-800 border-t border-gray-700 px-4 flex items-center justify-between text-sm text-gray-400">
      <div className="flex items-center space-x-4">
        {hasChanges && <span className="text-yellow-400">● Non sauvegardé</span>}
      </div>
      <div className="flex items-center space-x-4">
        <span>{lineCount} lignes</span>
        <span>{charCount} caractères</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
}