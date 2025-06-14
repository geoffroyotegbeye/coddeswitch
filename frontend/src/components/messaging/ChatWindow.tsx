import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Code, Smile, Phone, Video, MoreVertical, Users } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CodeSnippetModal } from './CodeSnippetModal';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'code' | 'file' | 'system';
  timestamp: string;
  language?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversation data
  const conversation = {
    id: conversationId,
    name: conversationId === '2' ? 'React Ninjas 🥷' : 'Sarah Martinez',
    type: conversationId === '2' ? 'bastion' : 'direct',
    isOnline: true,
    members: conversationId === '2' ? 12 : undefined
  };

  // Mock messages
  const messages: Message[] = [
    {
      id: '1',
      senderId: 'user1',
      senderName: 'Sarah Martinez',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      content: 'Salut ! J\'ai un problème avec mon composant React, il ne se re-render pas quand je change l\'état.',
      type: 'text',
      timestamp: '14:30'
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      content: 'Peux-tu me montrer ton code ? Ça peut être un problème de mutation d\'état.',
      type: 'text',
      timestamp: '14:32'
    },
    {
      id: '3',
      senderId: 'user1',
      senderName: 'Sarah Martinez',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      content: `const [items, setItems] = useState([]);

const addItem = (newItem) => {
  items.push(newItem);
  setItems(items);
};`,
      type: 'code',
      language: 'javascript',
      timestamp: '14:33'
    },
    {
      id: '4',
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      content: 'Ah je vois le problème ! Tu modifies directement le tableau. Utilise plutôt le spread operator :',
      type: 'text',
      timestamp: '14:34'
    },
    {
      id: '5',
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      content: `const addItem = (newItem) => {
  setItems([...items, newItem]);
};`,
      type: 'code',
      language: 'javascript',
      timestamp: '14:34',
      reactions: [
        { emoji: '👍', count: 2, users: ['Sarah Martinez', 'Mike Johnson'] },
        { emoji: '🔥', count: 1, users: ['Sarah Martinez'] }
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (message.trim()) {
      // Ici on enverrait le message via WebSocket ou API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addCodeSnippet = (code: string, language: string) => {
    // Ajouter le snippet de code aux messages
    console.log('Adding code snippet:', { code, language });
    setShowCodeModal(false);
  };

  const addReaction = (messageId: string, emoji: string) => {
    console.log('Adding reaction:', { messageId, emoji });
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {conversation.type === 'direct' ? (
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                alt={conversation.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-lg">
                🥷
              </div>
            )}
            {conversation.isOnline && conversation.type === 'direct' && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation.name}</h3>
            <p className="text-sm text-gray-400">
              {conversation.type === 'direct' 
                ? (conversation.isOnline ? 'En ligne' : 'Hors ligne')
                : `${conversation.members} membres`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {conversation.type === 'direct' && (
            <>
              <Button variant="ghost" size="sm" icon={Phone}>
                Appel
              </Button>
              <Button variant="ghost" size="sm" icon={Video}>
                Vidéo
              </Button>
            </>
          )}
          {conversation.type === 'bastion' && (
            <Button variant="ghost" size="sm" icon={Users}>
              Membres
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={MoreVertical} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[70%] ${msg.senderId === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-300">{msg.senderName}</span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
                
                <div className={`rounded-lg p-3 ${
                  msg.senderId === 'me' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  {msg.type === 'text' && (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  
                  {msg.type === 'code' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" size="sm">
                          {msg.language}
                        </Badge>
                        <Code className="h-4 w-4" />
                      </div>
                      <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                        <code>{msg.content}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {msg.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => addReaction(msg.id, reaction.emoji)}
                        className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 rounded-full px-2 py-1 text-xs transition-colors"
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-gray-300">{reaction.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Code}
                onClick={() => setShowCodeModal(true)}
              >
                Code
              </Button>
              <Button variant="ghost" size="sm" icon={Paperclip}>
                Fichier
              </Button>
              <Button variant="ghost" size="sm" icon={Smile}>
                Emoji
              </Button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écris ton message..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
            />
          </div>
          <Button
            variant="primary"
            icon={Send}
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            Envoyer
          </Button>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <CodeSnippetModal
          onClose={() => setShowCodeModal(false)}
          onSubmit={addCodeSnippet}
        />
      )}
    </Card>
  );
}