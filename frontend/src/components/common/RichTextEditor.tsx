import React, { useRef, useEffect } from 'react';
import { Button } from './Button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Link,
  Image,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = '400px',
  placeholder = 'Commencez à écrire...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string = '') => {
    if (!editorRef.current) return;

    // Sauvegarder la sélection actuelle
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    switch (command) {
      case 'insertUnorderedList':
        if (editorRef.current.querySelector('ul')) {
          document.execCommand('outdent', false);
        } else {
          document.execCommand('insertUnorderedList', false);
        }
        break;
      case 'insertOrderedList':
        if (editorRef.current.querySelector('ol')) {
          document.execCommand('outdent', false);
        } else {
          document.execCommand('insertOrderedList', false);
        }
        break;
      case 'code':
        if (editorRef.current.querySelector('pre')) {
          document.execCommand('formatBlock', false, 'div');
        } else {
          document.execCommand('formatBlock', false, 'pre');
          const pre = editorRef.current.querySelector('pre');
          if (pre) {
            pre.style.backgroundColor = '#1a1a1a';
            pre.style.padding = '1rem';
            pre.style.borderRadius = '0.375rem';
            pre.style.fontFamily = 'monospace';
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.color = '#ffffff';
          }
        }
        break;
      default:
        document.execCommand(command, false, value);
    }

    // Restaurer la sélection
    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo')}
          title="Annuler"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo')}
          title="Rétablir"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          title="Gras"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          title="Italique"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          title="Liste à puces"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          title="Liste numérotée"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          title="Aligner à gauche"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          title="Centrer"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          title="Aligner à droite"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Entrez l\'URL du lien :');
            if (url) execCommand('createLink', url);
          }}
          title="Insérer un lien"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Entrez l\'URL de l\'image :');
            if (url) execCommand('insertImage', url);
          }}
          title="Insérer une image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('code')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="p-4 outline-none prose prose-invert max-w-none text-white [&>*]:text-white [&_p]:text-white [&_li]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_a]:text-blue-400 [&_a:hover]:text-blue-300 overflow-y-auto h-full"
        style={{ 
          minHeight: height,
          maxHeight: height,
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}; 