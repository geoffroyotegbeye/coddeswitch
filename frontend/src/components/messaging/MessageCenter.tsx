import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Plus, Search, Settings, Phone, Video } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ChatWindow } from './ChatWindow';
import { BastionPanel } from './BastionPanel';
import { CreateBastionModal } from './CreateBastionModal';

interface Conversation {
  id: string;
  type: 'direct' | 'bastion';
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  members?: number;
}

interface Bastion {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  avatar: string;
  isPrivate: boolean;
  tags: string[];
  lastActivity: string;
}

export function MessageCenter() {
  const [activeTab, setActiveTab] = useState<'messages' | 'bastions'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showCreateBastion, setShowCreateBastion] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - en production, ceci viendrait d'une API
  const conversations: Conversation[] = [
    {
      id: '1',
      type: 'direct',
      name: 'Sarah Martinez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastMessage: 'Salut ! Tu peux m\'aider avec ce bug React ?',
      lastMessageTime: '2 min',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      type: 'bastion',
      name: 'React Ninjas 🥷',
      avatar: '⚛️',
      lastMessage: 'Alex: Nouveau défi posté !',
      lastMessageTime: '15 min',
      unreadCount: 5,
      members: 12
    },
    {
      id: '3',
      type: 'direct',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastMessage: 'Merci pour l\'aide sur CSS Grid !',
      lastMessageTime: '1h',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '4',
      type: 'bastion',
      name: 'Python Beginners 🐍',
      avatar: '🐍',
      lastMessage: 'Emma: Session d\'étude demain 19h',
      lastMessageTime: '2h',
      unreadCount: 1,
      members: 8
    }
  ];

  const availableBastions: Bastion[] = [
    {
      id: 'b1',
      name: 'JavaScript Masters',
      description: 'Groupe avancé pour maîtriser JS moderne',
      members: 14,
      maxMembers: 15,
      avatar: '⚡',
      isPrivate: false,
      tags: ['JavaScript', 'ES6+', 'Node.js'],
      lastActivity: '5 min ago'
    },
    {
      id: 'b2',
      name: 'CSS Wizards',
      description: 'Créons des interfaces magiques ensemble',
      members: 9,
      maxMembers: 15,
      avatar: '🎨',
      isPrivate: false,
      tags: ['CSS', 'Design', 'Animation'],
      lastActivity: '1h ago'
    },
    {
      id: 'b3',
      name: 'Full Stack Warriors',
      description: 'De la DB au frontend, on fait tout !',
      members: 15,
      maxMembers: 15,
      avatar: '⚔️',
      isPrivate: true,
      tags: ['Full Stack', 'MERN', 'DevOps'],
      lastActivity: '30 min ago'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBastions = availableBastions.filter(bastion =>
    bastion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bastion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Centre de Messages 💬
          </h1>
          <p className="text-gray-400">
            Connecte-toi avec la communauté et rejoins des bastions de code
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              {/* Tabs */}
              <div className="flex bg-gray-700 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'messages'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline mr-2" />
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab('bastions')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'bastions'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Bastions
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Create Button */}
              <Button
                variant="primary"
                className="w-full mb-4"
                icon={Plus}
                onClick={() => setShowCreateBastion(true)}
              >
                {activeTab === 'messages' ? 'Nouveau Message' : 'Créer Bastion'}
              </Button>

              {/* Conversations List */}
              {activeTab === 'messages' && (
                <div className="space-y-2">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversation === conv.id
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {conv.type === 'direct' ? (
                            <img
                              src={conv.avatar}
                              alt={conv.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-lg">
                              {conv.avatar}
                            </div>
                          )}
                          {conv.type === 'direct' && conv.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.name}</p>
                            <div className="flex items-center space-x-1">
                              {conv.type === 'bastion' && (
                                <span className="text-xs text-gray-400">{conv.members}</span>
                              )}
                              <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="primary" size="sm">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Bastions List */}
              {activeTab === 'bastions' && (
                <div className="space-y-3">
                  {filteredBastions.map((bastion) => (
                    <Card key={bastion.id} hover className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-xl">
                          {bastion.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{bastion.name}</h3>
                            {bastion.isPrivate && (
                              <Badge variant="warning" size="sm">Privé</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{bastion.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {bastion.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {bastion.members}/{bastion.maxMembers}
                            </span>
                          </div>
                          <Button
                            variant={bastion.members >= bastion.maxMembers ? "ghost" : "outline"}
                            size="sm"
                            className="w-full mt-2"
                            disabled={bastion.members >= bastion.maxMembers}
                          >
                            {bastion.members >= bastion.maxMembers ? 'Complet' : 'Rejoindre'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <ChatWindow conversationId={selectedConversation} />
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionne une conversation</h3>
                  <p>Choisis un message ou un bastion pour commencer à discuter</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Create Bastion Modal */}
        {showCreateBastion && (
          <CreateBastionModal onClose={() => setShowCreateBastion(false)} />
        )}
      </div>
    </div>
  );
}