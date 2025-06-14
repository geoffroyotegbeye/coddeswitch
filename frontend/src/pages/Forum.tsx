import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Search, Filter, Plus, Pin, TrendingUp, Clock, Users, Eye } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';

export function Forum() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'unanswered' | 'solved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const forumPosts = [
    {
      id: '1',
      title: 'Comment optimiser les performances d\'une application React ?',
      content: 'J\'ai une application React qui devient lente avec beaucoup de composants. Quelles sont les meilleures pratiques pour optimiser les performances ?',
      author: {
        name: 'Sarah Martinez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        level: 12,
        badge: 'React Expert'
      },
      category: 'React',
      tags: ['React', 'Performance', 'Optimization'],
      likes: 45,
      replies: 23,
      views: 1250,
      timeAgo: '2 heures',
      isPinned: true,
      isSolved: false,
      lastActivity: '30 min',
      trending: true
    },
    {
      id: '2',
      title: 'Problème avec CSS Grid sur mobile - layout cassé',
      content: 'Mon layout CSS Grid fonctionne parfaitement sur desktop mais se casse complètement sur mobile. J\'ai essayé plusieurs media queries mais rien ne marche.',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        level: 8,
        badge: 'CSS Enthusiast'
      },
      category: 'CSS',
      tags: ['CSS', 'Grid', 'Mobile', 'Responsive'],
      likes: 32,
      replies: 18,
      views: 890,
      timeAgo: '4 heures',
      isPinned: false,
      isSolved: true,
      lastActivity: '1 heure',
      trending: false
    },
    {
      id: '3',
      title: 'Quelle est la différence entre let, const et var en JavaScript ?',
      content: 'Je débute en JavaScript et je ne comprends pas bien les différences entre ces trois façons de déclarer des variables. Pouvez-vous m\'expliquer ?',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        level: 3,
        badge: 'Beginner'
      },
      category: 'JavaScript',
      tags: ['JavaScript', 'Variables', 'Beginner'],
      likes: 67,
      replies: 34,
      views: 2100,
      timeAgo: '1 jour',
      isPinned: false,
      isSolved: true,
      lastActivity: '3 heures',
      trending: true
    },
    {
      id: '4',
      title: 'Meilleure façon d\'apprendre Python en 2024 ?',
      content: 'Je veux me lancer dans Python mais il y a tellement de ressources que je ne sais pas par où commencer. Quels sont vos conseils ?',
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        level: 5,
        badge: 'Learner'
      },
      category: 'Python',
      tags: ['Python', 'Learning', 'Beginner', 'Resources'],
      likes: 89,
      replies: 56,
      views: 3200,
      timeAgo: '2 jours',
      isPinned: false,
      isSolved: false,
      lastActivity: '5 heures',
      trending: true
    },
    {
      id: '5',
      title: 'Erreur "Cannot read property of undefined" - Comment débugger ?',
      content: 'Je reçois constamment cette erreur dans ma console et je n\'arrive pas à identifier d\'où elle vient. Quelles sont les techniques pour débugger efficacement ?',
      author: {
        name: 'David Brown',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        level: 6,
        badge: 'Developer'
      },
      category: 'JavaScript',
      tags: ['JavaScript', 'Debugging', 'Error', 'Help'],
      likes: 23,
      replies: 12,
      views: 650,
      timeAgo: '6 heures',
      isPinned: false,
      isSolved: false,
      lastActivity: '2 heures',
      trending: false
    }
  ];

  const categories = ['all', 'JavaScript', 'React', 'CSS', 'Python', 'HTML', 'Career', 'General'];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    let matchesTab = true;
    switch (activeTab) {
      case 'trending':
        matchesTab = post.trending;
        break;
      case 'unanswered':
        matchesTab = post.replies === 0;
        break;
      case 'solved':
        matchesTab = post.isSolved;
        break;
      default:
        matchesTab = true;
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'JavaScript': 'warning',
      'React': 'primary',
      'CSS': 'secondary',
      'Python': 'success',
      'HTML': 'error'
    };
    return colors[category] || 'secondary';
  };

  const stats = {
    totalPosts: 12847,
    totalMembers: 8934,
    onlineNow: 234,
    solvedToday: 89
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Forum CodeSwitch 💬
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Pose tes questions, partage tes connaissances et aide la communauté à grandir ensemble
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.totalPosts.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.totalMembers.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Membres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.onlineNow}</div>
                <div className="text-gray-400 text-sm">En ligne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.solvedToday}</div>
                <div className="text-gray-400 text-sm">Résolus aujourd'hui</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
              <div className="space-y-3">
                {user ? (
                  <>
                    <Button variant="primary" className="w-full" icon={Plus}>
                      Nouvelle question
                    </Button>
                    <Button variant="outline" className="w-full">
                      Mes questions
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Questions sauvées
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <p className="text-gray-300 text-sm mb-3">
                        Connecte-toi pour poser des questions et répondre
                      </p>
                      <Link to="/login">
                        <Button variant="primary" size="sm" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Catégories populaires</h3>
              <div className="space-y-2">
                {categories.slice(1).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Tabs */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                {[
                  { key: 'all', label: 'Tous', icon: MessageCircle },
                  { key: 'trending', label: 'Tendances', icon: TrendingUp },
                  { key: 'unanswered', label: 'Sans réponse', icon: Clock },
                  { key: 'solved', label: 'Résolus', icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans le forum..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button variant="outline" icon={Filter}>
                Filtrer
              </Button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} hover className="cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-yellow-400" />
                        )}
                        <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                          <Link to={`/forum/${post.id}`}>{post.title}</Link>
                        </h3>
                        {post.isSolved && (
                          <Badge variant="success" size="sm">✓ Résolu</Badge>
                        )}
                        {post.trending && (
                          <Badge variant="warning" size="sm">🔥 Tendance</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getCategoryColor(post.category)} size="sm">
                          {post.category}
                        </Badge>
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="font-medium text-white">{post.author.name}</span>
                          <Badge variant="primary" size="sm">Niveau {post.author.level}</Badge>
                          <span>{post.timeAgo}</span>
                          <span>Dernière activité: {post.lastActivity}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          {user && (
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">Aucune discussion trouvée</p>
                  <p className="text-sm">Essaie d'ajuster tes filtres ou termes de recherche</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                >
                  Voir toutes les discussions
                </Button>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Précédent</Button>
                <Button variant="primary" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Suivant</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              📋 Règles de la communauté
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold text-white mb-2">Respecte les autres</h4>
                <p className="text-gray-300 text-sm">Sois bienveillant et constructif dans tes interactions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h4 className="font-semibold text-white mb-2">Recherche d'abord</h4>
                <p className="text-gray-300 text-sm">Vérifie si ta question n'a pas déjà été posée</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💡</div>
                <h4 className="font-semibold text-white mb-2">Sois précis</h4>
                <p className="text-gray-300 text-sm">Donne des détails et du contexte dans tes questions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-white mb-2">Reste dans le sujet</h4>
                <p className="text-gray-300 text-sm">Garde tes discussions liées au développement</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}