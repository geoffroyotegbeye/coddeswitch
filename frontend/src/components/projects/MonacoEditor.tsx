import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { AlertCircle, Loader2, FileCode, Plus, X, Edit2, Check } from 'lucide-react';
import { OutputPanel } from './OutputPanel';

interface TabFile {
  id: string;
  name: string;
  language: string;
  content: string;
  hasChanges: boolean;
}

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  hasChanges?: boolean;
  theme?: string;
  output?: string;
  expectedOutput?: string;
}

// Générer une clé unique pour le localStorage basée sur le projet ou l'exercice actuel
const generateStorageKey = (prefix: string) => {
  // Utiliser l'URL actuelle ou un ID de projet si disponible
  const pathSegments = window.location.pathname.split('/');
  const projectId = pathSegments[pathSegments.length - 1] || 'default';
  return `codeswitch_${prefix}_${projectId}`;
};

export function MonacoEditor({ 
  value, 
  language, 
  onChange, 
  hasChanges = false,
  theme = 'vs-dark',
  output = '',
  expectedOutput = ''
}: MonacoEditorProps) {
  // Variable pour indiquer si le code est en cours d'exécution
  const [isRunning, setIsRunning] = useState(false);
  
  // Clés de stockage pour localStorage
  const TABS_STORAGE_KEY = generateStorageKey('tabs');
  const ACTIVE_TAB_STORAGE_KEY = generateStorageKey('activeTab');
  
  // Charger les onglets depuis localStorage ou utiliser les valeurs par défaut
  const loadSavedTabs = (): TabFile[] => {
    try {
      const savedTabs = localStorage.getItem(TABS_STORAGE_KEY);
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs) as TabFile[];
        // Vérifier si l'onglet HTML principal contient la valeur actuelle
        const htmlTab = parsedTabs.find(tab => tab.language === 'html');
        if (htmlTab && value && htmlTab.content !== value) {
          // Mettre à jour le contenu avec la valeur actuelle si nécessaire
          return parsedTabs.map(tab => 
            tab.id === htmlTab.id ? { ...tab, content: value } : tab
          );
        }
        return parsedTabs;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des onglets:', error);
    }
    
    // Valeurs par défaut si rien n'est trouvé dans localStorage
    return [
      { id: '1', name: 'index.html', language: 'html', content: value, hasChanges: hasChanges },
      { id: '2', name: 'style.css', language: 'css', content: '/* Ajoutez votre CSS ici */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}', hasChanges: false },
      { id: '3', name: 'script.js', language: 'javascript', content: '// Ajoutez votre JavaScript ici\n\nconsole.log("Hello world!");', hasChanges: false },
    ];
  };
  
  // Charger l'onglet actif depuis localStorage ou utiliser la valeur par défaut
  const loadActiveTabId = (): string => {
    try {
      const savedActiveTabId = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
      if (savedActiveTabId) return savedActiveTabId;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'onglet actif:', error);
    }
    return '1';
  };
  
  // État pour les onglets de fichiers
  const [tabs, setTabs] = useState<TabFile[]>(loadSavedTabs());
  const [activeTabId, setActiveTabId] = useState(loadActiveTabId());
  
  const [showOutput, setShowOutput] = useState(true);
  // Charger la largeur de l'éditeur depuis localStorage ou utiliser la valeur par défaut
  const loadEditorWidth = (): number => {
    try {
      const savedWidth = localStorage.getItem(generateStorageKey('editorWidth'));
      if (savedWidth) {
        const width = parseFloat(savedWidth);
        return isNaN(width) ? 70 : width;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la largeur de l\'éditeur:', error);
    }
    return 70;
  };
  
  const [editorWidth, setEditorWidth] = useState(loadEditorWidth()); // Pourcentage de la largeur pour l'éditeur
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isResizingRef = useRef(false);
  const rafRef = useRef<number | null>(null); // Pour requestAnimationFrame
  
  // Trouver l'onglet actif
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Mettre à jour le contenu de l'onglet actif quand la valeur externe change
  useEffect(() => {
    if (activeTab && activeTab.content !== value) {
      updateTabContent(activeTabId, value);
    }
  }, [value]);

  // Mettre à jour le langage de l'onglet actif quand le langage externe change
  useEffect(() => {
    if (activeTab && activeTab.language !== language) {
      updateTabLanguage(activeTabId, language);
    }
  }, [language]);

  const getLanguageForMonaco = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'python': return 'python';
      case 'react': return 'typescript';
      default: return 'plaintext';
    }
  };
  
  // Sauvegarder les onglets dans localStorage chaque fois qu'ils changent
  useEffect(() => {
    try {
      localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des onglets:', error);
    }
  }, [tabs, TABS_STORAGE_KEY]);
  
  // Sauvegarder l'onglet actif dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTabId);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'onglet actif:', error);
    }
  }, [activeTabId, ACTIVE_TAB_STORAGE_KEY]);
  
  // Sauvegarder la largeur de l'éditeur dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(generateStorageKey('editorWidth'), String(editorWidth));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la largeur de l\'éditeur:', error);
    }
  }, [editorWidth]);
  
  // Fonction pour mettre à jour le contenu d'un onglet
  const updateTabContent = (tabId: string, newContent: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, content: newContent, hasChanges: true } : tab
    ));
  };

  // Fonction pour mettre à jour le langage d'un onglet
  const updateTabLanguage = (tabId: string, newLanguage: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, language: newLanguage } : tab
    ));
  };
  
  // Déterminer le langage en fonction de l'extension du fichier
  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'py': return 'python';
      case 'jsx': case 'tsx': return 'typescript';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'php': return 'php';
      default: return 'plaintext';
    }
  };
  
  // Fonction pour renommer un fichier
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const fileNameInputRef = useRef<HTMLInputElement>(null);
  
  const startRenaming = (tabId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(tabId);
    setNewFileName(currentName);
    
    // Focus l'input après le rendu
    setTimeout(() => {
      if (fileNameInputRef.current) {
        fileNameInputRef.current.focus();
        fileNameInputRef.current.select();
      }
    }, 50);
  };
  
  const confirmRename = (tabId: string, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newFileName.trim()) return;
    
    // Détecter le nouveau langage basé sur l'extension
    const newLanguage = getLanguageFromFileName(newFileName);
    
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, name: newFileName, language: newLanguage } : tab
    ));
    
    setEditingTabId(null);
  };
  
  const cancelRename = () => {
    setEditingTabId(null);
  };
  
  // Fonction pour ajouter un nouvel onglet
  const addNewTab = () => {
    // Générer un ID unique basé sur un timestamp
    const newId = `tab-${Date.now()}`;
    
    // Demander le nom du fichier avec une boîte de dialogue
    const fileName = prompt("Nom du fichier :", "nouveau-fichier.txt");
    if (!fileName) return; // Annuler si pas de nom
    
    // Déterminer le langage en fonction de l'extension
    const fileLanguage = getLanguageFromFileName(fileName);
    
    const newTab: TabFile = {
      id: newId,
      name: fileName,
      language: fileLanguage,
      content: '',
      hasChanges: false
    };
    
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };
  
  // Fonction pour fermer un onglet
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic de sélectionner l'onglet
    
    // Ne pas fermer si c'est le dernier onglet
    if (tabs.length <= 1) return;
    
    // Vérifier si l'onglet a des modifications non sauvegardées
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (tabToClose?.hasChanges) {
      const confirmClose = window.confirm(`Le fichier ${tabToClose.name} contient des modifications non sauvegardées. Voulez-vous vraiment le fermer?`);
      if (!confirmClose) return;
    }
    
    // Si on ferme l'onglet actif, activer un autre onglet
    if (tabId === activeTabId) {
      const currentIndex = tabs.findIndex(tab => tab.id === tabId);
      const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex + 1;
      setActiveTabId(tabs[newActiveIndex].id);
    }
    
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };
  
  // Gérer le changement de contenu dans l'éditeur
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateTabContent(activeTabId, value);
      
      // Si c'est l'onglet HTML principal, propager le changement vers le parent
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab && activeTab.language === 'html' && activeTab.name === 'index.html') {
        onChange(value);
      }
    }
  };
  
  // Gestionnaires d'événements pour le redimensionnement
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = editorWidth;
    
    // Appliquer des styles pour améliorer l'UX pendant le redimensionnement
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('select-none');
    
    // Ajouter une classe pour désactiver les transitions pendant le redimensionnement
    document.body.classList.add('resizing');
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [editorWidth]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;
    
    // Annuler toute animation précédente pour éviter l'accumulation
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Utilisation de requestAnimationFrame pour une animation plus fluide
    rafRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.getBoundingClientRect().width;
      const deltaX = e.clientX - startXRef.current;
      
      // Calcul précis du pourcentage avec 2 décimales pour éviter les sauts
      const deltaPercent = (deltaX / containerWidth) * 100;
      
      // Inversion de la logique : déplacement vers la droite augmente la largeur de l'éditeur
      let newWidth = startWidthRef.current + deltaPercent;
      
      // Limites avec une transition douce aux extrémités
      newWidth = Math.max(20, Math.min(80, newWidth));
      
      // Arrondir à 2 décimales pour éviter les micro-fluctuations
      newWidth = Math.round(newWidth * 100) / 100;
      
      // Utiliser un style direct pour une mise à jour plus rapide pendant le redimensionnement
      const editorElement = container.querySelector('[style*="width"]') as HTMLElement;
      const outputElement = container.querySelector('.h-full.overflow-auto') as HTMLElement;
      
      if (editorElement && outputElement) {
        editorElement.style.width = `${newWidth}%`;
        outputElement.style.width = `${100 - newWidth - 0.25}%`;
      }
      
      // Mettre à jour l'état uniquement à la fin du redimensionnement
      // pour éviter les re-rendus fréquents
      rafRef.current = null;
    });
  }, []);
  
  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('select-none');
    document.body.classList.remove('resizing');
    
    // Annuler toute animation en cours
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Récupérer les valeurs actuelles des éléments pour mettre à jour l'état React
    const container = containerRef.current;
    if (container) {
      const editorElement = container.querySelector('[style*="width"]') as HTMLElement;
      if (editorElement) {
        const widthStr = editorElement.style.width;
        const width = parseFloat(widthStr);
        if (!isNaN(width)) {
          setEditorWidth(width);
        }
      }
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, []);
  
  // Nettoyage des écouteurs d'événements
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col relative">
      {activeTab?.hasChanges && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg">
            <AlertCircle className="h-3 w-3 mr-1" />
            Non sauvegardé
          </div>
        </div>
      )}
      
      {/* Barre d'onglets */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {tabs.map(tab => {
          // Déterminer la couleur en fonction du langage
          let fileColor = 'text-blue-400';
          
          switch (tab.language) {
            case 'html':
              fileColor = 'text-orange-400';
              break;
            case 'css':
              fileColor = 'text-blue-400';
              break;
            case 'javascript':
              fileColor = 'text-yellow-400';
              break;
            case 'python':
              fileColor = 'text-green-400';
              break;
            case 'json':
              fileColor = 'text-purple-400';
              break;
            case 'markdown':
              fileColor = 'text-gray-400';
              break;
            case 'php':
              fileColor = 'text-indigo-400';
              break;
          }
          
          return (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer ${activeTabId === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-750 hover:text-white'}`}
            >
              <span className={fileColor}>
                <FileCode className="h-3.5 w-3.5 mr-2" />
              </span>
              
              {editingTabId === tab.id ? (
                <form onSubmit={(e) => confirmRename(tab.id, e)} className="flex items-center">
                  <input
                    ref={fileNameInputRef}
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={cancelRename}
                    onKeyDown={(e) => e.key === 'Escape' && cancelRename()}
                    className="bg-gray-800 text-white text-xs border border-gray-600 rounded px-1 py-0.5 w-24 focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    type="submit" 
                    className="ml-1 text-green-500 hover:text-green-400 p-0.5"
                    title="Confirmer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </form>
              ) : (
                <>
                  <span className="text-xs font-medium">{tab.name}</span>
                  {tab.hasChanges && <span className="h-1.5 w-1.5 rounded-full bg-orange-500 ml-2"></span>}
                  <button 
                    onClick={(e) => startRenaming(tab.id, tab.name, e)}
                    className="ml-1 text-gray-500 hover:text-white p-0.5 rounded-full hover:bg-gray-600"
                    title="Renommer"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </>
              )}
              
              <button 
                onClick={(e) => closeTab(tab.id, e)}
                className="ml-1 text-gray-500 hover:text-white p-0.5 rounded-full hover:bg-gray-600"
                title="Fermer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
        <button 
          onClick={addNewTab}
          className="flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-750"
          title="Ajouter un fichier"
        >
          <Plus className="h-4 w-4" />
        </button>
        
        {/* Indicateur de sauvegarde automatique */}
        <div className="ml-2 text-xs text-gray-500 flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
          Sauvegarde auto
        </div>
      </div>
      
      <div className="flex-1 flex flex-row" ref={containerRef}>
        <div 
          style={{ width: showOutput ? `${editorWidth}%` : '100%', transition: isResizingRef.current ? 'none' : 'width 0.1s ease-out' }} 
          className="h-full">
      <Editor
        height="100%"
            language={getLanguageForMonaco(activeTab.language)}
            value={activeTab.content}
        theme={theme}
            onChange={handleEditorChange}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Chargement de l'éditeur...</span>
            </div>
          </div>
        }
        options={{
            fontSize: 14,
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
          automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true
            },
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false
            },
            overviewRulerBorder: true,
            overviewRulerLanes: 3,
            fixedOverflowWidgets: true,
            contextmenu: true
          }}
          />
        </div>

        {showOutput && (
          <>
            <div 
              className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize group relative z-10 transition-colors duration-150"
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                handleMouseDown({ clientX: touch.clientX } as any);
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-10 flex items-center justify-center">
                <div className="w-0.5 h-5 bg-gray-500 group-hover:bg-blue-500 mx-0.5 transition-colors duration-150"></div>
                <div className="w-0.5 h-5 bg-gray-500 group-hover:bg-blue-500 mx-0.5 transition-colors duration-150"></div>
              </div>
            </div>
            <div 
              style={{ width: `${100 - editorWidth - 0.25}%` }} 
              className="h-full overflow-auto">
              <OutputPanel
                output={output}
                language={activeTab.language}
                code={activeTab.content}
                isRunning={isRunning}
                tabs={tabs}
                expectedOutput={expectedOutput}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}