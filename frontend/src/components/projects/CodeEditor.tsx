import React, { useState } from 'react';
import { RotateCcw, Check, Trophy, Settings, Download, Share, Save } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { MonacoEditor } from './MonacoEditor';
import { EditorStatusBar } from './EditorStatusBar';

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onSubmit?: (code: string) => void;
  onReset?: () => void;
  onSave?: () => void;
  stepTitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  isCompleted?: boolean;
  tabs?: Array<{
    id: string;
    name: string;
    language: string;
    content: string;
  }>;
}

export function CodeEditor({ 
  initialCode = '', 
  language, 
  onSubmit,
  onReset,
  onSave,
  stepTitle,
  stepNumber,
  totalSteps,
  isCompleted = false,
  tabs = []
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [hasChanges, setHasChanges] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  React.useEffect(() => {
    setCode(initialCode);
    setHasChanges(false);
  }, [initialCode]);

  const resetCode = () => {
    setCode(initialCode);
    setHasChanges(false);
  };

  const submitCode = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasChanges(newCode !== initialCode);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {stepTitle ? `${stepTitle}` : 'Éditeur de Code'}
            </h3>
          </div>
          <Badge variant="secondary" className="ml-4">
            {language.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Settings}
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
          >
            {theme === 'vs-dark' ? 'Clair' : 'Sombre'}
          </Button>
          <Button variant="ghost" size="sm" icon={Download} onClick={downloadCode}>
            Télécharger
          </Button>
          <Button variant="ghost" size="sm" icon={Share}>
            Partager
          </Button>
          <div className="w-px h-6 bg-gray-600 mx-2" />
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Save} 
            onClick={onSave}
            title="Sauvegarder en base de données"
          >
            Sauvegarder
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={RotateCcw} 
            onClick={() => {
              resetCode();
              onReset?.();
            }}
            title="Réinitialiser le code"
          >
            Réinitialiser
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={isCompleted ? Trophy : Check} 
            onClick={submitCode}
            disabled={!hasChanges && !isCompleted}
          >
            {isCompleted ? 'Terminé !' : 'Valider l\'étape'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        <MonacoEditor
          value={code}
          language={language}
          onChange={handleCodeChange}
          hasChanges={hasChanges}
          theme={theme}
        />
      </div>

      <EditorStatusBar
        hasChanges={hasChanges}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        code={code}
      />
    </div>
  );
}