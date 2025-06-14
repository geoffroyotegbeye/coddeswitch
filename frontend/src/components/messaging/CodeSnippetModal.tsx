import React, { useState } from 'react';
import { X, Code, Copy } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface CodeSnippetModalProps {
  onClose: () => void;
  onSubmit: (code: string, language: string) => void;
}

export function CodeSnippetModal({ onClose, onSubmit }: CodeSnippetModalProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
    { value: 'typescript', label: 'TypeScript', color: 'bg-blue-500' },
    { value: 'html', label: 'HTML', color: 'bg-orange-500' },
    { value: 'css', label: 'CSS', color: 'bg-blue-600' },
    { value: 'python', label: 'Python', color: 'bg-green-500' },
    { value: 'java', label: 'Java', color: 'bg-red-500' },
    { value: 'php', label: 'PHP', color: 'bg-purple-500' },
    { value: 'sql', label: 'SQL', color: 'bg-gray-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code, language);
    }
  };

  const getLanguageColor = (lang: string) => {
    return languages.find(l => l.value === lang)?.color || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Code className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Partager du Code</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Options */}
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Titre optionnel */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="ex: Fonction de tri personnalisée"
                  />
                </div>

                {/* Langage */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Langage
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Éditeur de code */}
            <div className="flex-1 p-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`}></div>
                    <Badge variant="secondary" size="sm">
                      {languages.find(l => l.value === language)?.label}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    Copier
                  </Button>
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 w-full p-4 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 font-mono text-sm focus:border-purple-500 focus:outline-none resize-none"
                  placeholder={`Colle ton code ${language} ici...`}
                  style={{
                    fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                    lineHeight: '1.5',
                    tabSize: 2,
                    minHeight: '300px'
                  }}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <p>💡 Astuce : Utilise des commentaires pour expliquer ton code</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!code.trim()}
                  >
                    Partager le Code
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}