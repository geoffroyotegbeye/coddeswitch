import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Save, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  last_login: string;
  avatar_url?: string;
  bio?: string;
  skills?: { id: string; name: string; level: number }[];
}

interface UpdateUserFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UpdateUserForm = ({ user, onSave, onCancel }: UpdateUserFormProps) => {
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleChange = (field: keyof User, value: string | boolean) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Modifier l'utilisateur
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom
              </label>
              <Input
                value={editedUser.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nom de l'utilisateur"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={editedUser.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email de l'utilisateur"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <Input
                value={editedUser.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Biographie de l'utilisateur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Avatar URL
              </label>
              <Input
                value={editedUser.avatar_url || ''}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                placeholder="URL de l'avatar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Rôle
              </label>
              <select
                value={editedUser.is_admin ? 'admin' : 'user'}
                onChange={(e) => handleChange('is_admin', e.target.value === 'admin')}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
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
    </div>
  );
};

export default UpdateUserForm;
