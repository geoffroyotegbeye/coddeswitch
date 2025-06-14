import React, { useState } from 'react';
import { Save, X, Mail, User as UserIcon, Image, Shield, Info } from 'lucide-react';
import { User, Skill } from '../../../types';

interface UserEditorProps {
  initialUser?: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserEditor: React.FC<UserEditorProps> = ({
  initialUser,
  onSave,
  onCancel
}) => {
  const [user, setUser] = useState<User>(initialUser || {
    id: '',
    email: '',
    full_name: '',
    is_admin: false,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    avatar_url: '',
    bio: '',
    skills: []
  });

  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<number>(3);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setUser(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (skillName.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(), // Temporaire, sera remplacé par l'ID du backend
        name: skillName.trim(),
        level: skillLevel
      };
      
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      
      setSkillName('');
      setSkillLevel(3);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {initialUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <X size={18} className="mr-2" />
            Annuler
          </button>
          
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Informations de base
            </h3>
            
            {/* Nom complet */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={user.full_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Entrez le nom complet"
                />
                <UserIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Entrez l'email"
                />
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Avatar URL */}
            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL de l'avatar
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="avatar_url"
                  name="avatar_url"
                  value={user.avatar_url || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Entrez l'URL de l'avatar"
                />
                <Image size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Prévisualisation de l'avatar */}
              <div className="mt-2 flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random`} 
                    alt={user.full_name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random`;
                    }}
                  />
                </div>
                <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  Aperçu de l'avatar
                </span>
              </div>
            </div>
            
            {/* Statut administrateur */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_admin"
                name="is_admin"
                checked={user.is_admin}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Administrateur
              </label>
            </div>
          </div>
          
          {/* Informations additionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Informations additionnelles
            </h3>
            
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Biographie
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  name="bio"
                  value={user.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Entrez la biographie"
                />
                <Info size={18} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            {/* Compétences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Compétences
              </label>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Nom de la compétence"
                />
                
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="1">1 - Débutant</option>
                  <option value="2">2 - Élémentaire</option>
                  <option value="3">3 - Intermédiaire</option>
                  <option value="4">4 - Avancé</option>
                  <option value="5">5 - Expert</option>
                </select>
                
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              {/* Liste des compétences */}
              <div className="space-y-2">
                {user.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-white">{skill.name}</span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        Niveau {skill.level}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserEditor;

