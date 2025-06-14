import React, { useState } from 'react';
import { Search, Filter, Pin, Trash2, CheckCircle, Flag } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
import { useNotification } from '../../contexts/NotificationContext';

export function AdminCommunity() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { confirm, ...confirmProps } = useConfirm();
  const { success, error } = useNotification();

  // Mock data
  const posts = [
    {
      id: '1',
      title: 'Comment optimiser les performances d\'une application React ?',
      type: 'question',
      author: 'Sarah Martinez',
      category: 'React',
      likes: 45,
      replies: 23,
      views: 1250,
      isPinned: true,
      isSolved: false,
      isReported: false,
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'Mon portfolio personnel - Feedback bienvenu !',
      type: 'showcase',
      author: 'Emma Wilson',
      category: 'Showcase',
      likes: 89,
      replies: 34,
      views: 2100,
      isPinned: false,
      isSolved: false,
      isReported: false,
      createdAt: '2024-01-19'
    },
    {
      id: '3',
      title: 'Contenu inapproprié signalé',
      type: 'discussion',
      author: 'Spam User',
      category: 'General',
      likes: 0,
      replies: 2,
      views: 45,
      isPinned: false,
      isSolved: false,
      isReported: true,
      createdAt: '2024-01-18'
    }
  ];

  const handleDeletePost = async (post: any) => {
    const confirmed = await confirm({
      title: 'Supprimer le post',
      message: `Êtes-vous sûr de vouloir supprimer le post "${post.title}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      type: 'danger'
    });

    if (confirmed) {
      success('Post supprimé avec succès');
    }
  };

  const handlePinPost = async (post: any) => {
    const action = post.isPinned ? 'désépingler' : 'épingler';
    const confirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} le post`,
      message: `Êtes-vous sûr de vouloir ${action} ce post ?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info'
    });

    if (confirmed) {
      success(`Post ${action} avec succès`);
    }
  };

  const handleMarkSolved = async (post: any) => {
    const confirmed = await confirm({
      title: 'Marquer comme résolu',
      message: 'Êtes-vous sûr de vouloir marquer cette question comme résolue ?',
      confirmText: 'Marquer résolu',
      type: 'info'
    });

    if (confirmed) {
      success('Question marquée comme résolue');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || post.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'warning';
      case 'showcase': return 'success';
      case 'discussion': return 'primary';
      case 'challenge': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Modération Communauté</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-400">3,421</div>
          <div className="text-gray-400 text-sm">Total Posts</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400">156</div>
          <div className="text-gray-400 text-sm">Questions Non Résolues</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-red-400">12</div>
          <div className="text-gray-400 text-sm">Posts Signalés</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-400">89</div>
          <div className="text-gray-400 text-sm">Résolus Aujourd'hui</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="question">Questions</option>
            <option value="showcase">Showcase</option>
            <option value="discussion">Discussions</option>
            <option value="challenge">Défis</option>
          </select>
        </div>
      </Card>

      {/* Posts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Post</th>
                <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">Auteur</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Statut</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className={`border-b border-gray-700 hover:bg-gray-800/50 ${post.isReported ? 'bg-red-900/20' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {post.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                      {post.isReported && <Flag className="h-4 w-4 text-red-400" />}
                      <div>
                        <h3 className="text-white font-medium line-clamp-1">{post.title}</h3>
                        <p className="text-gray-400 text-sm">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={getTypeColor(post.type)}>
                      {post.type === 'question' && '❓ Question'}
                      {post.type === 'showcase' && '🎨 Showcase'}
                      {post.type === 'discussion' && '💭 Discussion'}
                      {post.type === 'challenge' && '🏆 Défi'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{post.author}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-400">
                      <div>👍 {post.likes} • 💬 {post.replies}</div>
                      <div>👁 {post.views} vues</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {post.isSolved && <Badge variant="success" size="sm">Résolu</Badge>}
                      {post.isPinned && <Badge variant="warning" size="sm">Épinglé</Badge>}
                      {post.isReported && <Badge variant="error" size="sm">Signalé</Badge>}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Pin}
                        onClick={() => handlePinPost(post)}
                        className={post.isPinned ? 'text-yellow-400' : 'text-gray-400'}
                      >
                        {post.isPinned ? 'Désépingler' : 'Épingler'}
                      </Button>
                      {post.type === 'question' && !post.isSolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleMarkSolved(post)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Résolu
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeletePost(post)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}