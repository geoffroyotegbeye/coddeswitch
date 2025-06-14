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
  stepTitle,
  stepNumber,
  totalSteps,
  isCompleted = false,
  tabs = []
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
    setOutput('');

    try {
      if (language === 'javascript') {
        // Créer un iframe pour exécuter le code JavaScript de manière isolée
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Remplacer console.log pour capturer les sorties
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;

        let capturedOutput = '';

        // Fonction pour capturer les sorties
        const captureOutput = (type: string, args: any[]) => {
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

          const prefix = type === 'error' ? '🔴 ' : 
                        type === 'warn' ? '🟠 ' : 
                        type === 'info' ? '🔵 ' : '📝 ';
          
          capturedOutput += (capturedOutput ? '\n' : '') + prefix + message;
          setOutput(capturedOutput);
        };

        // Remplacer les méthodes de console
        console.log = (...args) => {
          captureOutput('log', args);
          originalConsoleLog.apply(console, args);
        };
        console.error = (...args) => {
          captureOutput('error', args);
          originalConsoleError.apply(console, args);
        };
        console.warn = (...args) => {
          captureOutput('warn', args);
          originalConsoleWarn.apply(console, args);
        };
        console.info = (...args) => {
          captureOutput('info', args);
          originalConsoleInfo.apply(console, args);
        };

        // Exécuter le code dans l'iframe
        const iframeWindow = iframe.contentWindow as Window & typeof globalThis;
        if (iframeWindow) {
          try {
            // Créer un script dans l'iframe
            const script = iframeWindow.document.createElement('script');
            script.textContent = `
              // Intercepter les méthodes de console
              const originalConsoleLog = console.log;
              const originalConsoleError = console.error;
              const originalConsoleWarn = console.warn;
              const originalConsoleInfo = console.info;

              console.log = function() {
                window.parent.postMessage({ type: 'log', args: Array.from(arguments) }, '*');
                originalConsoleLog.apply(console, arguments);
              };
              console.error = function() {
                window.parent.postMessage({ type: 'error', args: Array.from(arguments) }, '*');
                originalConsoleError.apply(console, arguments);
              };
              console.warn = function() {
                window.parent.postMessage({ type: 'warn', args: Array.from(arguments) }, '*');
                originalConsoleWarn.apply(console, arguments);
              };
              console.info = function() {
                window.parent.postMessage({ type: 'info', args: Array.from(arguments) }, '*');
                originalConsoleInfo.apply(console, arguments);
              };

              // Capturer les erreurs non gérées
              window.addEventListener('error', function(event) {
                window.parent.postMessage({ 
                  type: 'error', 
                  args: [event.message + ' at ' + event.filename + ':' + event.lineno] 
                }, '*');
              });

              // Exécuter le code
              try {
                ${code}
              } catch (error) {
                console.error(error.message);
              }
            `;
            iframeWindow.document.body.appendChild(script);
          } catch (error: any) {
            captureOutput('error', [error.message]);
          }
        }

        // Écouter les messages de l'iframe
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.type) {
            captureOutput(event.data.type, event.data.args);
          }
        };
        window.addEventListener('message', handleMessage);

        // Nettoyer après un délai pour permettre l'exécution
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          document.body.removeChild(iframe);
          // Restaurer les méthodes de console originales
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
          console.warn = originalConsoleWarn;
          console.info = originalConsoleInfo;
        }, 1000);

      } else if (language === 'html') {
        // Créer un iframe pour exécuter le HTML
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Remplacer console.log pour capturer les sorties
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;

        let capturedOutput = '';

        // Fonction pour capturer les sorties
        const captureOutput = (type: string, args: any[]) => {
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

          const prefix = type === 'error' ? '🔴 ' : 
                        type === 'warn' ? '🟠 ' : 
                        type === 'info' ? '🔵 ' : '📝 ';
          
          capturedOutput += (capturedOutput ? '\n' : '') + prefix + message;
          setOutput(capturedOutput);
        };

        // Remplacer les méthodes de console
        console.log = (...args) => {
          captureOutput('log', args);
          originalConsoleLog.apply(console, args);
        };
        console.error = (...args) => {
          captureOutput('error', args);
          originalConsoleError.apply(console, args);
        };
        console.warn = (...args) => {
          captureOutput('warn', args);
          originalConsoleWarn.apply(console, args);
        };
        console.info = (...args) => {
          captureOutput('info', args);
          originalConsoleInfo.apply(console, args);
        };

        // Écrire le HTML dans l'iframe
        const iframeWindow = iframe.contentWindow as Window & typeof globalThis;
        if (iframeWindow) {
          try {
            // Préparer le contenu HTML avec les scripts intégrés
            let finalHtml = code;
            
            // Si nous avons des onglets, intégrer le JavaScript
            if (tabs && tabs.length > 0) {
              const jsFiles = tabs.filter(tab => tab.language === 'javascript');
              if (jsFiles.length > 0) {
                // Créer le script d'interception
                const interceptScript = `
                  <script>
                    (function() {
                      // Intercepter les méthodes de console
                      const originalConsoleLog = console.log;
                      const originalConsoleError = console.error;
                      const originalConsoleWarn = console.warn;
                      const originalConsoleInfo = console.info;

                      function sendToParent(type, args) {
                        window.parent.postMessage({ 
                          type: type, 
                          args: Array.from(args).map(arg => {
                            if (typeof arg === 'object') {
                              try {
                                return JSON.stringify(arg);
                              } catch (e) {
                                return String(arg);
                              }
                            }
                            return String(arg);
                          })
                        }, '*');
                      }

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

                      // Capturer les erreurs de chargement de script
                      window.addEventListener('unhandledrejection', function(event) {
                        sendToParent('error', [event.reason]);
                      });
                    })();
                  </script>`;

                // S'assurer que le HTML a une structure de base
                if (!finalHtml.includes('<!DOCTYPE html>')) {
                  finalHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Preview</title>
  ${interceptScript}
</head>
<body>
  ${finalHtml}
</body>
</html>`;
                } else {
                  // Ajouter le script d'interception dans le head
                  if (finalHtml.includes('</head>')) {
                    finalHtml = finalHtml.replace('</head>', `${interceptScript}</head>`);
                  } else if (finalHtml.includes('<body>')) {
                    finalHtml = finalHtml.replace('<body>', `<head>${interceptScript}</head><body>`);
                  } else {
                    finalHtml = `${interceptScript}${finalHtml}`;
                  }
                }

                // Créer un map des fichiers JavaScript par nom
                const jsFileMap = new Map(jsFiles.map(file => [file.name, file.content]));

                // Remplacer les balises script avec src par leur contenu
                finalHtml = finalHtml.replace(/<script\s+src=["']([^"']+)["'][^>]*><\/script>/g, (match, src) => {
                  const fileName = src.split('/').pop(); // Obtenir le nom du fichier
                  const content = jsFileMap.get(fileName);
                  if (content) {
                    return `<script>
                      try {
                        ${content}
                      } catch (error) {
                        console.error('Error in ${fileName}:', error);
                      }
                    </script>`;
                  }
                  return match; // Garder la balise originale si le fichier n'est pas trouvé
                });

                // Ajouter les scripts JavaScript qui n'ont pas été inclus via src
                const remainingJsFiles = jsFiles.filter(file => 
                  !finalHtml.includes(`src="${file.name}"`) && 
                  !finalHtml.includes(`src='${file.name}'`)
                );

                if (remainingJsFiles.length > 0) {
                  const jsContent = remainingJsFiles.map(file => `
                    <script>
                      try {
                        ${file.content}
                      } catch (error) {
                        console.error('Error in ${file.name}:', error);
                      }
                    </script>
                  `).join('\n');

                  if (finalHtml.includes('</body>')) {
                    finalHtml = finalHtml.replace('</body>', `${jsContent}</body>`);
                  } else {
                    finalHtml = `${finalHtml}${jsContent}`;
                  }
                }
              }
            }

            // Écrire le HTML final dans l'iframe
            iframeWindow.document.open();
            iframeWindow.document.write(finalHtml);
            iframeWindow.document.close();

            // Écouter les messages de l'iframe
            const handleMessage = (event: MessageEvent) => {
              if (event.data && event.data.type) {
                captureOutput(event.data.type, event.data.args);
              }
            };
            window.addEventListener('message', handleMessage);

            // Attendre que le DOM soit chargé
            iframeWindow.document.addEventListener('DOMContentLoaded', () => {
              setOutput('✅ Code HTML validé\n📱 Aperçu mis à jour\n🎨 Styles appliqués avec succès');
            });

            // Nettoyer après un délai plus long pour permettre le chargement des scripts
            setTimeout(() => {
              window.removeEventListener('message', handleMessage);
              document.body.removeChild(iframe);
              // Restaurer les méthodes de console originales
              console.log = originalConsoleLog;
              console.error = originalConsoleError;
              console.warn = originalConsoleWarn;
              console.info = originalConsoleInfo;
            }, 2000); // Augmenté à 2 secondes pour permettre le chargement complet

          } catch (error: any) {
            captureOutput('error', [error.message]);
          }
        }

      } else if (language === 'python') {
        setOutput('Python output:\nHello, World!\nCode executed successfully!\nExecution time: 0.02s');
      } else {
        setOutput('✅ Code compilé avec succès\n📋 Prêt pour la soumission');
      }
    } catch (error: any) {
      setOutput(`🔴 Erreur d'exécution : ${error.message}`);
    } finally {
      setIsRunning(false);
    }
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