import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Search, Tag, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';

export function Blog() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: '1',
      title: 'Les 10 erreurs les plus communes en JavaScript et comment les éviter',
      excerpt: 'Découvre les pièges les plus fréquents en JavaScript et apprends à les éviter pour écrire du code plus robuste et maintenable.',
      content: 'JavaScript est un langage puissant mais parfois trompeur. Voici les erreurs les plus communes...',
      author: {
        name: 'Alex Martin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'Lead Developer'
      },
      publishedAt: '2024-01-15',
      readTime: '8 min',
      category: 'JavaScript',
      tags: ['JavaScript', 'Debugging', 'Best Practices'],
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      likes: 234,
      comments: 45,
      featured: true
    },
    {
      id: '2',
      title: 'CSS Grid vs Flexbox : Quand utiliser quoi ?',
      excerpt: 'Un guide complet pour choisir entre CSS Grid et Flexbox selon tes besoins de mise en page.',
      content: 'CSS Grid et Flexbox sont deux outils puissants pour la mise en page...',
      author: {
        name: 'Sarah Martinez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'CSS Expert'
      },
      publishedAt: '2024-01-12',
      readTime: '6 min',
      category: 'CSS',
      tags: ['CSS', 'Layout', 'Grid', 'Flexbox'],
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      likes: 189,
      comments: 32,
      featured: false
    },
    {
      id: '3',
      title: 'React Hooks : Guide complet pour les débutants',
      excerpt: 'Maîtrise les React Hooks avec ce guide détaillé incluant useState, useEffect et les hooks personnalisés.',
      content: 'Les React Hooks ont révolutionné la façon dont nous écrivons des composants...',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'React Specialist'
      },
      publishedAt: '2024-01-10',
      readTime: '12 min',
      category: 'React',
      tags: ['React', 'Hooks', 'Components'],
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      likes: 312,
      comments: 67,
      featured: true
    },
    {
      id: '4',
      title: 'Python pour les débutants : Premiers pas dans la programmation',
      excerpt: 'Commence ton voyage en programmation avec Python, le langage parfait pour débuter.',
      content: 'Python est souvent recommandé comme premier langage de programmation...',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'Python Developer'
      },
      publishedAt: '2024-01-08',
      readTime: '10 min',
      category: 'Python',
      tags: ['Python', 'Beginner', 'Programming'],
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      likes: 156,
      comments: 28,
      featured: false
    },
    {
      id: '5',
      title: 'Construire son premier portfolio : Guide étape par étape',
      excerpt: 'Crée un portfolio professionnel qui impressionnera les recruteurs avec ce guide détaillé.',
      content: 'Un bon portfolio est essentiel pour tout développeur...',
      author: {
        name: 'David Brown',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        role: 'Career Coach'
      },
      publishedAt: '2024-01-05',
      readTime: '15 min',
      category: 'Career',
      tags: ['Portfolio', 'Career', 'Web Design'],
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      likes: 278,
      comments: 54,
      featured: false
    }
  ];

  const categories = ['all', 'JavaScript', 'CSS', 'React', 'Python', 'Career'];
  
  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Blog CodeSwitch 📝
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Découvre les dernières tendances, tutoriels et conseils pour améliorer tes compétences en développement
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category === 'all' ? 'Tous les articles' : category}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Articles à la une ⭐</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} hover className="overflow-hidden">
                  <div className="aspect-video bg-gray-700 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="primary">{post.category}</Badge>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 hover:text-purple-400 transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{post.author.name}</div>
                          <div className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">
            {selectedCategory === 'all' ? 'Tous les articles' : `Articles ${selectedCategory}`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} hover className="overflow-hidden">
                <div className="aspect-video bg-gray-700 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge variant="secondary" size="sm">{post.category}</Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 hover:text-purple-400 transition-colors line-clamp-2">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="text-gray-400 text-xs">
                        {post.author.name}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">Aucun article trouvé</p>
              <p className="text-sm">Essaie d'ajuster tes filtres ou termes de recherche</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
            >
              Voir tous les articles
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16">
          <Card className="text-center p-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              📧 Reste informé des derniers articles
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Reçois nos meilleurs articles directement dans ta boîte mail. 
              Pas de spam, que du contenu de qualité !
            </p>
            {user ? (
              <Button size="lg">
                S'abonner à la newsletter
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <Button>S'abonner</Button>
                </div>
                <p className="text-xs text-gray-400">
                  Ou <Link to="/login" className="text-purple-400 hover:text-purple-300">connecte-toi</Link> pour t'abonner automatiquement
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}