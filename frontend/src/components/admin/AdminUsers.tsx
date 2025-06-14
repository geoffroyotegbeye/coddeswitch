import { useState } from 'react';
import { Search, Shield, Ban, Mail, MoreVertical, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpdateUserForm from './users/UpdateUserForm';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
import { useNotification } from '../../contexts/NotificationContext';
import { UsersList } from './users/UsersList';
import { UserProgress } from './users/UserProgress';

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

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { confirm } = useConfirm();
  const { success } = useNotification();
  const navigate = useNavigate();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingProgress, setIsViewingProgress] = useState(false);

  // Exemple de données
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      is_admin: true,
      created_at: '2025-01-15T10:30:00Z',
      last_login: '2025-06-10T14:25:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      bio: 'Développeur full-stack avec 10 ans d\'expérience',
      skills: [
        { id: '1', name: 'JavaScript', level: 5 },
        { id: '2', name: 'React', level: 4 },
        { id: '3', name: 'Python', level: 3 }
      ]
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      is_admin: false,
      created_at: '2025-02-20T09:15:00Z',
      last_login: '2025-06-11T16:40:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
      bio: 'Designer UX/UI passionnée par l\'expérience utilisateur',
      skills: [
        { id: '4', name: 'UI Design', level: 5 },
        { id: '5', name: 'Figma', level: 5 },
        { id: '6', name: 'HTML/CSS', level: 4 }
      ]
    }
  ]);

  const handleBanUser = async (user: User) => {
    const confirmed = await confirm({
      title: 'Bannir l\'utilisateur',
      message: `Êtes-vous sûr de vouloir bannir ${user.name} ? L'utilisateur ne pourra plus accéder à la plateforme.`,
      confirmText: 'Bannir',
      type: 'danger'
    });

    if (confirmed) {
      success(`Utilisateur ${user.name} banni avec succès`);
    }
  };

  const handleUnbanUser = async (user: User) => {
    const confirmed = await confirm({
      title: 'Débannir l\'utilisateur',
      message: `Êtes-vous sûr de vouloir débannir ${user.name} ?`,
      confirmText: 'Débannir',
      type: 'info'
    });

    if (confirmed) {
      success(`Utilisateur ${user.name} débanni avec succès`);
    }
  };

  const handleMakeAdmin = async (user: User) => {
    const confirmed = await confirm({
      title: 'Promouvoir en administrateur',
      message: `Êtes-vous sûr de vouloir promouvoir ${user.name} en tant qu'administrateur ?`,
      confirmText: 'Promouvoir',
      type: 'warning'
    });

    if (confirmed) {
      success(`${user.name} promu administrateur avec succès`);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleViewProgress = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsViewingProgress(true);
    }
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: '',
      email: '',
      is_admin: false,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    setSelectedUser(newUser);
    setIsEditing(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.is_admin.toString() === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: boolean) => {
    return role ? 'error' : 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'banned': return 'error';
      case 'suspended': return 'warning';
      default: return 'secondary';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Gestion des utilisateurs
        </h1>
        <Button
          variant="primary"
          onClick={handleAddUser}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {isEditing && selectedUser && (
        <UpdateUserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setIsEditing(false);
            setSelectedUser(null);
          }}
        />
      )}

      {isViewingProgress && selectedUser && (
        <UserProgress
          user={selectedUser}
          onClose={() => {
            setIsViewingProgress(false);
            setSelectedUser(null);
          }}
        />
      )}

      {!isEditing && !isViewingProgress && (
        <UsersList
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onViewProgress={handleViewProgress}
        />
      )}
    </div>
  );
}