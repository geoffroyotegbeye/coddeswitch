import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Progress } from '../../../components/common/Progress';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import { Star, Award, Clock, Calendar, Edit, Save, X } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Project {
  id: string;
  title: string;
  completedAt: string;
  score: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
}

interface UserProgressProps {
  userId?: string;
}

export function UserProgress({ userId: propUserId }: UserProgressProps) {
  const { userId: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    id: userId || '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    level: 8,
    xp: 2450,
    xpToNextLevel: 500,
    joinDate: '2025-01-15',
    totalProjects: 12,
    completedProjects: 8,
    totalCodingTime: 0,
    achievements: [] as Achievement[],
    skills: [
      { id: '1', name: 'JavaScript', level: 5 },
      { id: '2', name: 'React', level: 4 },
      { id: '3', name: 'Python', level: 3 },
      { id: '4', name: 'HTML/CSS', level: 5 },
      { id: '5', name: 'Node.js', level: 3 }
    ],
    recentProjects: [
      { id: '1', title: 'Todo App', completedAt: '2025-05-20', score: 95 },
      { id: '2', title: 'Weather Dashboard', completedAt: '2025-04-15', score: 88 },
      { id: '3', title: 'Portfolio Website', completedAt: '2025-03-10', score: 92 }
    ]
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    type: "badge",
    date: new Date().toISOString().split("T")[0]
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleAddAchievement = () => {
    setNewAchievement({
      title: "",
      description: "",
      type: "badge",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const getLevelProgress = () => {
    const currentLevel = editedUser.level;
    const nextLevel = currentLevel + 1;
    const currentXP = editedUser.xp;
    const nextLevelXP = nextLevel * editedUser.xpToNextLevel;
    const progress = (currentXP / nextLevelXP) * 100;
    return Math.min(progress, 100);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Award className="h-5 w-5 text-yellow-500" />;
      case "certificate":
        return <Star className="h-5 w-5 text-blue-500" />;
      case "milestone":
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={ArrowLeft} 
            onClick={() => navigate('/admin/users')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-white">Progression de l'utilisateur</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editedUser.name)}&background=random`}
                alt={editedUser.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{editedUser.name}</h3>
                <p className="text-gray-400">{editedUser.email}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Niveau</span>
                <span className="text-white font-medium">{editedUser.level}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">XP</span>
                <span className="text-white font-medium">{editedUser.xp} / {editedUser.xp + editedUser.xpToNextLevel}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${getLevelProgress()}%` }}
                />
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Projets complétés</span>
                <span className="text-white font-medium">{editedUser.completedProjects} / {editedUser.totalProjects}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(editedUser.completedProjects / editedUser.totalProjects) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Membre depuis</span>
                <span className="text-white font-medium">
                  {new Date(editedUser.joinDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Compétences</h3>
            <div className="space-y-4">
              {editedUser.skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-gray-300">{skill.name}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-6 rounded-sm ${i <= skill.level ? 'bg-blue-500' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Projets récents</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-3 text-gray-400 font-medium">Titre du projet</th>
                    <th className="pb-3 text-gray-400 font-medium">Date de complétion</th>
                    <th className="pb-3 text-gray-400 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {editedUser.recentProjects.map((project) => (
                    <tr key={project.id} className="border-t border-gray-700">
                      <td className="py-3 text-white">{project.title}</td>
                      <td className="py-3 text-gray-400">
                        {new Date(project.completedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.score >= 90 ? 'bg-green-900 text-green-300' :
                          project.score >= 75 ? 'bg-blue-900 text-blue-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {project.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {editedUser.name}
            </h3>
            <p className="text-gray-400">{editedUser.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Niveau actuel</p>
            <p className="text-2xl font-bold text-white">{editedUser.level}</p>
            <Progress value={getLevelProgress()} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">XP totale</p>
            <p className="text-2xl font-bold text-white">{editedUser.xp}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Projets complétés</p>
            <p className="text-2xl font-bold text-white">{editedUser.completedProjects}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Temps de code total</p>
            <p className="text-2xl font-bold text-white">{editedUser.totalCodingTime}h</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Niveau"
                type="number"
                value={editedUser.level}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditedUser({ ...editedUser, level: parseInt(e.target.value) })
                }
              />
              <Input
                label="XP totale"
                type="number"
                value={editedUser.xp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditedUser({ ...editedUser, xp: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Projets complétés"
                type="number"
                value={editedUser.completedProjects}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditedUser({
                    ...editedUser,
                    completedProjects: parseInt(e.target.value)
                  })
                }
              />
              <Input
                label="Temps de code (heures)"
                type="number"
                value={editedUser.totalCodingTime || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditedUser({
                    ...editedUser,
                    totalCodingTime: parseInt(e.target.value) || 0
                  })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Réalisations</h3>

        <div className="mb-6 p-4 border border-gray-700 rounded-lg space-y-4">
          <h4 className="text-lg font-medium text-white">Ajouter une réalisation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Titre"
              value={newAchievement.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewAchievement({ ...newAchievement, title: e.target.value })
              }
            />
            <Select
              label="Type"
              value={newAchievement.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNewAchievement({ ...newAchievement, type: e.target.value })
              }
            >
              <option value="badge">Badge</option>
              <option value="certificate">Certificat</option>
              <option value="milestone">Étape importante</option>
            </Select>
          </div>
          <Textarea
            label="Description"
            value={newAchievement.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewAchievement({ ...newAchievement, description: e.target.value })
            }
          />
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleAddAchievement}>
              <Award className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {editedUser.achievements?.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className="flex items-start justify-between p-4 border border-gray-700 rounded-lg"
            >
              <div className="flex items-start space-x-4">
                {getAchievementIcon(achievement.type)}
                <div>
                  <h4 className="text-lg font-medium text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-400">{achievement.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                    <Badge variant="blue">{achievement.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Implementation of onDeleteAchievement function
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default UserProgress;
