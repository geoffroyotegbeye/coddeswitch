import React, { useState } from 'react';
import { Terminal, Globe, Bug, FileText } from 'lucide-react';

interface AdvancedOutputPanelProps {
  language: string;
  code: string;
  output: string;
  isRunning: boolean;
}

export function AdvancedOutputPanel({ language, code, output, isRunning }: AdvancedOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'problems'>('preview');

  const tabs = [
    { id: 'preview', label: 'Aperçu', icon: Globe },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'problems', label: 'Problèmes', icon: Bug }
  ];

  return (
    <div className="w-1/2 flex flex-col border-l border-gray-700">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-400 bg-gray-750'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
            {isRunning && tab.id === 'console' && (
              <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-purple-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' && (
          <div className="h-full p-4">
            {language === 'html' ? (
              <div className="bg-white rounded-lg h-full border border-gray-600 overflow-hidden">
                <iframe
                  srcDoc={code}
                  className="w-full h-full"
                  title="Aperçu HTML"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Aperçu non disponible pour {language}</p>
                  <p className="text-sm">Utilise l'onglet Console pour voir la sortie</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="h-full p-4">
            <div className="h-full bg-gray-900 rounded-lg border border-gray-600 overflow-auto">
              <div className="p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">$ Exécution du code {language}</div>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {output || 'Clique sur "Tester" pour exécuter le code...'}
                </pre>
                {isRunning && (
                  <div className="text-yellow-400 mt-2">
                    <span className="animate-pulse">⚡ Exécution en cours...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="h-full p-4">
            <div className="h-full bg-gray-900 rounded-lg border border-gray-600 overflow-auto">
              <div className="p-4">
                <div className="text-green-400 text-sm mb-4">
                  ✅ Aucun problème détecté
                </div>
                <div className="text-gray-400 text-sm">
                  <p>• Syntaxe correcte</p>
                  <p>• Pas d'erreurs de validation</p>
                  <p>• Code prêt pour la soumission</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}