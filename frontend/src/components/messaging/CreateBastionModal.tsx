import React, { useState } from 'react';
import { X, Users, Lock, Globe, Hash } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface CreateBastionModalProps {
  onClose: () => void;
}

export function CreateBastionModal({ onClose }: CreateBastionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: [] as string[],
    maxMembers: 15
  });
  const [newTag, setNewTag] = useState('');

  const popularTags = [
    'JavaScript', 'React', 'Python', 'CSS', 'HTML', 'Node.js',
    'TypeScript', 'Vue.js', 'Angular', 'PHP', 'Java', 'C++',
    'Débutant', 'Intermédiaire', 'Avancé', 'Projet', 'Aide', 'Étude'
  ];

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on créerait le bastion via API
    console.log('Creating bastion:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Créer un Bastion 🏰</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du bastion */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du bastion *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="ex: React Ninjas, Python Beginners..."
                required
                maxLength={50}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.name.length}/50 caractères
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                placeholder="Décris l'objectif de ton bastion..."
                rows={3}
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length}/200 caractères
              </p>
            </div>

            {/* Visibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Visibilité
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    !formData.isPrivate
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Globe className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Public</h3>
                  <p className="text-sm text-gray-400">
                    Visible par tous, rejoignable librement
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.isPrivate
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Lock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Privé</h3>
                  <p className="text-sm text-gray-400">
                    Sur invitation uniquement
                  </p>
                </button>
              </div>
            </div>

            {/* Nombre maximum de membres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre maximum de membres
              </label>
              <div className="flex items-center space-x-4">
                <Users className="h-5 w-5 text-gray-400" />
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-white font-semibold w-8 text-center">
                  {formData.maxMembers}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Les bastions sont limités à 15 membres maximum pour favoriser les échanges
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (max 5)
              </label>
              
              {/* Tags sélectionnés */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="primary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}

              {/* Ajouter un tag personnalisé */}
              <div className="flex space-x-2 mb-3">
                <div className="flex-1 relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Ajouter un tag personnalisé..."
                    disabled={formData.tags.length >= 5}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag || formData.tags.length >= 5}
                >
                  Ajouter
                </Button>
              </div>

              {/* Tags populaires */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Tags populaires :</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={formData.tags.length >= 5}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Règles du bastion */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">📋 Règles des Bastions</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Respecte les autres membres</li>
                <li>• Partage tes connaissances</li>
                <li>• Reste dans le sujet du bastion</li>
                <li>• Pas de spam ou de contenu inapproprié</li>
                <li>• Aide les débutants avec patience</li>
              </ul>
            </div>

            {/* Boutons */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={!formData.name || !formData.description}
              >
                Créer le Bastion
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}