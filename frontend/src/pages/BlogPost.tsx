import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Heart, MessageCircle, Share2, Bookmark, Eye } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';

export function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);

  // Mock blog post data
  const post = {
    id: id,
    title: 'Les 10 erreurs les plus communes en JavaScript et comment les éviter',
    content: `
# Introduction

JavaScript est un langage puissant mais parfois trompeur. Même les développeurs expérimentés peuvent tomber dans certains pièges. Dans cet article, nous allons explorer les 10 erreurs les plus communes en JavaScript et apprendre comment les éviter.

## 1. Confusion entre == et ===

L'une des erreurs les plus fréquentes est la confusion entre l'égalité faible (\`==\`) et l'égalité stricte (\`===\`).

\`\`\`javascript
// ❌ Éviter
if (value == "5") {
  // Cette condition sera vraie même si value est le nombre 5
}

// ✅ Recommandé
if (value === "5") {
  // Cette condition ne sera vraie que si value est la chaîne "5"
}
\`\`\`

## 2. Hoisting mal compris

Le hoisting peut créer des comportements inattendus si on ne le comprend pas bien.

\`\`\`javascript
// ❌ Problématique
console.log(myVar); // undefined (pas d'erreur !)
var myVar = 5;

// ✅ Meilleure pratique
let myVar = 5;
console.log(myVar); // 5
\`\`\`

## 3. Problèmes de scope avec var

L'utilisation de \`var\` peut créer des problèmes de portée.

\`\`\`javascript
// ❌ Problème avec var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Affiche 3, 3, 3
}

// ✅ Solution avec let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Affiche 0, 1, 2
}
\`\`\`

## 4. Mutation d'objets et tableaux

Modifier directement les objets peut créer des effets de bord inattendus.

\`\`\`javascript
// ❌ Mutation directe
const originalArray = [1, 2, 3];
originalArray.push(4); // Modifie l'original

// ✅ Approche immutable
const originalArray = [1, 2, 3];
const newArray = [...originalArray, 4]; // Crée un nouveau tableau
\`\`\`

## 5. Gestion incorrecte de this

Le contexte \`this\` peut être déroutant, surtout dans les callbacks.

\`\`\`javascript
// ❌ Problème de contexte
class MyClass {
  constructor() {
    this.value = 42;
  }
  
  method() {
    setTimeout(function() {
      console.log(this.value); // undefined
    }, 1000);
  }
}

// ✅ Solution avec arrow function
class MyClass {
  constructor() {
    this.value = 42;
  }
  
  method() {
    setTimeout(() => {
      console.log(this.value); // 42
    }, 1000);
  }
}
\`\`\`

## Conclusion

En évitant ces erreurs communes, tu peux écrire du JavaScript plus robuste et maintenable. N'hésite pas à utiliser des outils comme ESLint pour t'aider à détecter ces problèmes automatiquement.

La clé est de comprendre les subtilités du langage et d'adopter les bonnes pratiques dès le début. Avec de la pratique, ces concepts deviendront naturels !
    `,
    author: {
      name: 'Alex Martin',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      role: 'Lead Developer',
      bio: 'Développeur passionné avec 8 ans d\'expérience en JavaScript et React. J\'aime partager mes connaissances et aider la communauté.'
    },
    publishedAt: '2024-01-15',
    readTime: '8 min',
    category: 'JavaScript',
    tags: ['JavaScript', 'Debugging', 'Best Practices', 'Common Mistakes'],
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    likes: 234,
    comments: 45,
    views: 1250,
    featured: true
  };

  const comments = [
    {
      id: '1',
      author: {
        name: 'Sarah Martinez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
        level: 12
      },
      content: 'Excellent article ! J\'ai fait plusieurs de ces erreurs quand j\'ai commencé. Surtout le problème avec var dans les boucles.',
      timeAgo: '2 heures',
      likes: 12,
      replies: 3
    },
    {
      id: '2',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
        level: 8
      },
      content: 'Très utile ! Pourrais-tu faire un article similaire sur les erreurs communes en React ?',
      timeAgo: '4 heures',
      likes: 8,
      replies: 1
    },
    {
      id: '3',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
        level: 15
      },
      content: 'Je recommande aussi d\'utiliser TypeScript pour éviter beaucoup de ces problèmes dès la compilation.',
      timeAgo: '1 jour',
      likes: 15,
      replies: 5
    }
  ];

  const relatedPosts = [
    {
      id: '2',
      title: 'CSS Grid vs Flexbox : Quand utiliser quoi ?',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      readTime: '6 min'
    },
    {
      id: '3',
      title: 'React Hooks : Guide complet pour les débutants',
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      readTime: '12 min'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Ici on ajouterait le commentaire
      console.log('Nouveau commentaire:', comment);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header avec bouton retour */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="primary">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="text-white font-medium">{post.author.name}</div>
                <div className="text-gray-400 text-sm">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} vues</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Actions */}
        <div className="flex items-center justify-between border-y border-gray-700 py-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Author Bio */}
        <Card className="p-6 mb-8">
          <div className="flex items-start space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                À propos de {post.author.name}
              </h3>
              <p className="text-gray-300 mb-4">{post.author.bio}</p>
              <Button variant="outline" size="sm">
                Voir tous les articles
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        {showComments && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Commentaires ({post.comments})
            </h3>

            {/* Comment Form */}
            {user ? (
              <Card className="p-6 mb-6">
                <form onSubmit={handleCommentSubmit}>
                  <div className="flex items-start space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <Button type="submit" disabled={!comment.trim()}>
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="p-6 mb-6 text-center">
                <p className="text-gray-300 mb-4">
                  Connecte-toi pour laisser un commentaire
                </p>
                <Link to="/login">
                  <Button>Se connecter</Button>
                </Link>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-white">
                          {comment.author.name}
                        </span>
                        <Badge variant="primary" size="sm">
                          Niveau {comment.author.level}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {comment.timeAgo}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                          <Heart className="h-3 w-3" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors text-sm">
                          Répondre
                        </button>
                        {comment.replies > 0 && (
                          <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                            Voir {comment.replies} réponse{comment.replies > 1 ? 's' : ''}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Articles similaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} hover className="overflow-hidden">
                <div className="aspect-video bg-gray-700 overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2 hover:text-purple-400 transition-colors">
                    <Link to={`/blog/${relatedPost.id}`}>
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {relatedPost.readTime}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}