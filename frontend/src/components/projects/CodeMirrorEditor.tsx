import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CodeMirrorEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  hasChanges: boolean;
}

export function CodeMirrorEditor({ value, language, onChange, hasChanges }: CodeMirrorEditorProps) {
  const getLanguageClass = (lang: string) => {
    switch (lang) {
      case 'html': return 'language-html';
      case 'css': return 'language-css';
      case 'javascript': return 'language-javascript';
      case 'python': return 'language-python';
      default: return 'language-text';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-r border-gray-700 flex-1">
        <div className="relative h-full">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none ${getLanguageClass(language)}`}
            placeholder={`Écris ton code ${language} ici...`}
            spellCheck={false}
            style={{
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              lineHeight: '1.5',
              tabSize: 2,
            }}
          />
          {hasChanges && (
            <div className="absolute top-2 right-2">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Non sauvegardé
              </div>
            </div>
          )}
          
          {/* Line numbers simulation */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 flex flex-col text-xs text-gray-500 pt-4">
            {value.split('\n').map((_, index) => (
              <div key={index} className="h-6 flex items-center justify-end pr-2">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}