import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Loader2, Eye, Maximize2, Minimize2, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '../common/Button';

interface OutputPanelProps {
  output: string;
  error: string | null;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isCompleted: boolean;
  expectedOutput?: string;
  language?: string;
  code?: string;
  tabs?: Array<{
    id: string;
    name: string;
    language: string;
    content: string;
  }>;
}

export function OutputPanel({
  output,
  error,
  onRun,
  onSubmit,
  isRunning,
  isCompleted,
  expectedOutput,
  language = '',
  code = '',
  tabs = []
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [previewContent, setPreviewContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const consoleRef = useRef<HTMLDivElement>(null);

  // Écouter les messages de l'iframe (console.log, etc.)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'iframe-console') {
        const prefix = event.data.type === 'error' ? '🔴 ' : 
                      event.data.type === 'warn' ? '🟠 ' : 
                      event.data.type === 'info' ? '🔵 ' : '📝 ';
        
        setConsoleOutput(prev => prev + (prev ? '\n' : '') + prefix + event.data.message);
        
        // Basculer automatiquement vers l'onglet console si une erreur est détectée
        if (event.data.type === 'error') {
          setActiveTab('console');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Faire défiler la console vers le bas quand de nouvelles sorties arrivent
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  // Fonction pour générer le contenu HTML complet avec CSS et JS intégrés
  const generateIntegratedPreview = () => {
    // Recherche des fichiers par type
    const htmlFile = tabs.find(tab => tab.language === 'html');
    const cssFiles = tabs.filter(tab => tab.language === 'css');
    const jsFiles = tabs.filter(tab => tab.language === 'javascript');
    
    // Si aucun fichier HTML, utiliser le code actuel si c'est du HTML
    let htmlContent = htmlFile ? htmlFile.content : (language === 'html' ? code : '');
    
    // Si nous avons du HTML, intégrer le CSS et le JS
    if (htmlContent) {
      // Vérifier si le HTML a déjà des balises head et body
      const hasHead = htmlContent.includes('<head>');
      const hasBody = htmlContent.includes('<body>');
      const hasHtml = htmlContent.includes('<html>');
      
      let finalHtml = htmlContent;
      
      // Si pas de structure HTML complète, créer une structure de base
      if (!hasHtml) {
        finalHtml = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Aperçu</title>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`;
      }
      
      // Injecter le CSS dans la balise head
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map(file => `<style>\n${file.content}\n</style>`).join('\n');
        
        if (hasHead) {
          // Insérer après la balise head ouvrante
          finalHtml = finalHtml.replace('<head>', '<head>\n' + cssContent);
        } else {
          // Insérer avant la balise body
          finalHtml = finalHtml.replace('<body>', cssContent + '\n<body>');
        }
      }
      
      // Injecter le JavaScript à la fin du body
      if (jsFiles.length > 0) {
        // Script pour intercepter console.log et l'envoyer au parent
        const consoleInterceptScript = `
<script>
  (function() {
    // Sauvegarder les méthodes originales
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    
    // Fonction pour envoyer les logs au parent
    function sendToParent(type, args) {
      const message = Array.from(args).map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      window.parent.postMessage({
        source: 'iframe-console',
        type: type,
        message: message
      }, '*');
    }
    
    // Remplacer les méthodes de console
    console.log = function() {
      sendToParent('log', arguments);
      originalConsoleLog.apply(console, arguments);
    };
    
    console.error = function() {
      sendToParent('error', arguments);
      originalConsoleError.apply(console, arguments);
    };
    
    console.warn = function() {
      sendToParent('warn', arguments);
      originalConsoleWarn.apply(console, arguments);
    };
    
    console.info = function() {
      sendToParent('info', arguments);
      originalConsoleInfo.apply(console, arguments);
    };
    
    // Capturer les erreurs non gérées
    window.addEventListener('error', function(event) {
      sendToParent('error', [event.message + ' at ' + event.filename + ':' + event.lineno]);
    });
  })();
</script>`;
        
        // Combiner le script d'interception avec le contenu JS des fichiers
        const jsContent = consoleInterceptScript + jsFiles.map(file => `<script>\n${file.content}\n</script>`).join('\n');
        
        if (hasBody) {
          // Insérer avant la balise body fermante
          finalHtml = finalHtml.replace('</body>', jsContent + '\n</body>');
        } else {
          // Ajouter à la fin
          finalHtml = finalHtml + '\n' + jsContent;
        }
      }
      
      return finalHtml;
    }
    
    return '';
  };

  useEffect(() => {
    // Si nous avons des onglets, générer une prévisualisation intégrée
    if (tabs && tabs.length > 0) {
      const hasHtmlFile = tabs.some(tab => tab.language === 'html');
      const hasCssFile = tabs.some(tab => tab.language === 'css');
      const hasJsFile = tabs.some(tab => tab.language === 'javascript');
      
      // Si au moins un des fichiers est HTML, CSS ou JS, générer la prévisualisation
      if (hasHtmlFile || (language === 'html' && code)) {
        const integrated = generateIntegratedPreview();
        setPreviewContent(integrated);
        setActiveTab('preview');
      } else if (hasCssFile || hasJsFile) {
        // Si nous avons du CSS ou JS mais pas de HTML, créer un HTML de base
        const baseHtml = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Aperçu</title>\n</head>\n<body>\n  <div id="app">Contenu HTML manquant</div>\n</body>\n</html>`;
        // Utiliser temporairement un HTML de base pour la prévisualisation
        code = baseHtml;
        language = 'html';
        const integrated = generateIntegratedPreview();
        setPreviewContent(integrated);
        setActiveTab('preview');
      } else {
        // Pas de fichiers web, utiliser le comportement par défaut
        if (language === 'html' && code) {
          setPreviewContent(code);
          setActiveTab('preview');
        } else {
          setActiveTab('console');
        }
      }
    } else {
      // Comportement par défaut si pas d'onglets
      if (language === 'html' && code) {
        setPreviewContent(code);
        setActiveTab('preview');
      } else {
        setActiveTab('console');
      }
    }
  }, [tabs, language, code]);

  // Fonction pour basculer en mode plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Calculer les classes CSS en fonction de l'état plein écran
  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-gray-900 border-t border-gray-700"
    : "h-full flex flex-col bg-gray-900 border-t border-gray-700";

  // Calculer la largeur de l'iframe en fonction du mode de viewport
  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile': return 'w-[375px]';
      case 'tablet': return 'w-[768px]';
      case 'desktop': return 'w-full';
      default: return 'w-full';
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-1 px-2 py-1 rounded ${activeTab === 'console' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Terminal className="h-4 w-4" />
            <span className="text-xs font-medium">Console</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-2 py-1 rounded ${activeTab === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Aperçu</span>
          </button>

          {activeTab === 'preview' && (
            <div className="flex items-center space-x-2 ml-4 border-l border-gray-700 pl-4">
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Vue mobile"
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                className={`p-1 rounded ${viewportMode === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Vue tablette"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Vue bureau"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <div>
          <button
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white p-1 rounded"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isRunning ? (
          <div className="flex items-center space-x-2 text-gray-400 p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Exécution en cours...</span>
          </div>
        ) : (
          <>
            {activeTab === 'console' && (
              <div 
                ref={consoleRef}
                className="font-mono text-sm text-gray-300 whitespace-pre-wrap p-4 overflow-auto h-full"
              >
                {consoleOutput || 'Aucune sortie dans la console'}
              </div>
            )}
            
            {activeTab === 'preview' && (
              <div className="h-full bg-gray-100 flex items-center justify-center overflow-auto">
                {previewContent ? (
                  <div className={`transition-all duration-300 h-full ${viewportMode !== 'desktop' ? 'border border-gray-400 rounded-md shadow-lg' : ''} ${getViewportWidth()} mx-auto`}>
                    <div className={`${viewportMode !== 'desktop' ? 'bg-gray-800 text-xs text-gray-300 py-1 px-2 flex justify-center' : 'hidden'}`}>
                      {viewportMode === 'mobile' ? '375px (Mobile)' : '768px (Tablette)'}
                    </div>
                    <iframe
                      srcDoc={previewContent}
                      title="Aperçu HTML"
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Aperçu non disponible</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {expectedOutput && activeTab === 'console' && (
          <div className="mt-4 pt-4 border-t border-gray-700 px-4 pb-4">
            <div className="text-xs font-medium text-gray-400 mb-2">Sortie attendue :</div>
            <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {expectedOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}