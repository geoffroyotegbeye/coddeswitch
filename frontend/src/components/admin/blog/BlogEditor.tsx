import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Image, X, Save, Eye } from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: 'draft' | 'published';
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogEditor = ({ post, onSave, onCancel }: BlogEditorProps) => {
  const [editedPost, setEditedPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    status: 'draft',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (post) {
      setEditedPost(post);
    }
  }, [post]);

  const handleChange = (field: keyof BlogPost, value: string) => {
    setEditedPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedPost.tags.includes(newTag.trim())) {
      setEditedPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedPost);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {post ? 'Modifier l\'article' : 'Nouvel article'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Éditer' : 'Aperçu'}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      {previewMode ? (
        <Card className="p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{editedPost.title}</h1>
          {editedPost.cover_image && (
            <img
              src={editedPost.cover_image}
              alt={editedPost.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <div className="flex gap-2 mb-4">
            {editedPost.tags.map(tag => (
              <Badge key={tag} color="blue">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="prose prose-invert max-w-none">
            {editedPost.content}
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Titre
                </label>
                <Input
                  value={editedPost.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Extrait
                </label>
                <Textarea
                  value={editedPost.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Court résumé de l'article"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contenu
                </label>
                <Textarea
                  value={editedPost.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Contenu de l'article"
                  rows={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image de couverture
                </label>
                <div className="flex gap-2">
                  <Input
                    value={editedPost.cover_image}
                    onChange={(e) => handleChange('cover_image', e.target.value)}
                    placeholder="URL de l'image"
                  />
                  {editedPost.cover_image && (
                    <Button
                      variant="ghost"
                      onClick={() => handleChange('cover_image', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedPost.tags.map(tag => (
                    <Badge
                      key={tag}
                      color="blue"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  value={editedPost.status}
                  onChange={(e) => handleChange('status', e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogEditor;
