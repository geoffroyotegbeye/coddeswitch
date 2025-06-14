import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Heart } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
import { useNotification } from '../../contexts/NotificationContext';
import blogService, { BlogPost } from '../../services/blogService';

function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { confirm, ...confirmProps } = useConfirm();
  const { success, error } = useNotification();

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchTerm]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPosts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined,
        limit: 50
      });
      setPosts(data);
    } catch (err) {
      error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'article',
      message: `Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      type: 'danger'
    });

    if (confirmed) {
      try {
        await blogService.deletePost(post.id);
        success('Article supprimé avec succès');
        loadPosts();
      } catch (err) {
        error('Erreur lors de la suppression');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion du Blog</h2>
        <Link to="/admin/blog/new">
          <Button icon={Plus}>Nouvel Article</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">Toutes les catégories</option>
            <option value="JavaScript">JavaScript</option>
            <option value="CSS">CSS</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="Career">Carrière</option>
          </select>
        </div>
      </Card>

      {/* Posts List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Article</th>
                <th className="text-left p-4 text-gray-300 font-medium">Catégorie</th>
                <th className="text-left p-4 text-gray-300 font-medium">Auteur</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    Chargement...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    Aucun article trouvé
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-start space-x-3">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="text-white font-medium line-clamp-1">{post.title}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                          {post.featured && (
                            <Badge variant="warning" size="sm" className="mt-1">À la une</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{post.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.author_info.avatar}
                          alt={post.author_info.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-300 text-sm">{post.author_info.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/blog/${post.id}`} target="_blank">
                          <Button variant="ghost" size="sm" icon={Eye}>
                            Voir
                          </Button>
                        </Link>
                        <Link to={`/admin/blog/edit/${post.id}`}>
                          <Button variant="ghost" size="sm" icon={Edit}>
                            Modifier
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(post)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}

function BlogEditor() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Éditeur d'Article</h2>
      <Card className="p-6">
        <p className="text-gray-400">Éditeur d'article à implémenter...</p>
      </Card>
    </div>
  );
}

export function AdminBlog() {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/new" element={<BlogEditor />} />
      <Route path="/edit/:id" element={<BlogEditor />} />
    </Routes>
  );
}