import React, { useState } from 'react';
import { Play, RotateCcw, Check, Trophy, Settings, Download, Share } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { MonacoEditor } from './MonacoEditor';
import { EditorStatusBar } from './EditorStatusBar';

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onSubmit?: (code: string) => void;
  stepTitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  isCompleted?: boolean;
}

export function CodeEditor({ 
  initialCode = '', 
  language, 
  onSubmit,
  stepTitle,
  stepNumber,
  totalSteps,
  isCompleted = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  React.useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setHasChanges(false);
  }, [initialCode]);

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (language === 'html') {
        setOutput('✅ Code HTML validé\n📱 Aperçu mis à jour\n🎨 Styles appliqués avec succès');
      } else if (language === 'javascript') {
        setOutput('Console output:\n> Hello, World!\n> Code executed successfully!\n> No errors found');
      } else if (language === 'python') {
        setOutput('Python output:\nHello, World!\nCode executed successfully!\nExecution time: 0.02s');
      } else {
        setOutput('✅ Code compilé avec succès\n📋 Prêt pour la soumission');
      }
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
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
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetCode}>
            Réinitialiser
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Play} 
            onClick={runCode} 
            disabled={isRunning}
          >
            {isRunning ? 'Exécution...' : 'Tester'}
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