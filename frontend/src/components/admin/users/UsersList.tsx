import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit, Trash2, Eye, Search, 
  Plus, Filter, ArrowUpDown, Shield, ShieldOff, Mail,
  MoreVertical, ChevronRight, BarChart2, Calendar
} from 'lucide-react';
import { User } from '../../../types';
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Card } from "../../../components/common/Card";
import { Badge } from "../../../components/common/Badge";

interface UsersListProps {
  onEditUser?: (user: User) => void;
  onViewUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onAddUser?: () => void;
  onViewProgress?: (userId: string) => void;
  users?: User[];
}

const UsersList: React.FC<UsersListProps> = ({
  onEditUser,
  onViewUser,
  onDeleteUser,
  onAddUser,
  onViewProgress,
  users = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.is_admin === (selectedRole === 'admin');
      const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' && user.is_admin) || (selectedStatus === 'inactive' && !user.is_admin);
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return direction * a.name.localeCompare(b.name);
      }
      if (sortField === 'email') {
        return direction * a.email.localeCompare(b.email);
      }
      if (sortField === 'created_at') {
        return direction * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      if (sortField === 'last_login') {
        return direction * (new Date(b.last_login).getTime() - new Date(a.last_login).getTime());
      }
      return 0;
    });

  const getRoleColor = (role: boolean) => {
    return role ? 'bg-red-500' : 'bg-green-500';
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-500' : 'bg-gray-500';
  };

  // Supprimer un utilisateur
  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      if (onDeleteUser) {
        onDeleteUser(id);
      }
    }
  };

  // Gérer le clic en dehors du dropdown pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ouvrir/fermer le dropdown
  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="regular">Utilisateur</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  <Badge color={getRoleColor(user.is_admin)}>
                    {user.is_admin ? 'Administrateur' : 'Utilisateur'}
                  </Badge>
                  <Badge color={getStatusColor(user.is_admin)}>
                    {user.is_admin ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser && onEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { UsersList };
