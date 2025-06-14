import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, BookOpen, Trophy, Clock, ArrowRight, Code2, Users, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockProjects, mockSkills } from '../data/mockData';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Progress } from '../components/common/Progress';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const recentProjects = mockProjects.slice(0, 3);
  const completedProjectsCount = user?.completed_projects?.length || 0;
  const totalXP = user?.xp || 0;
  const currentLevel = user?.level || 1;

  const handleProjectSelect = (project: any) => {
    // Navigate to project page - this will be handled by the ProjectCard component
    console.log('Selected project:', project);
  };

  const skills = [
    { name: 'HTML/CSS', progress: 85, projects: 12 },
    { name: 'JavaScript', progress: 70, projects: 8 },
    { name: 'React', progress: 60, projects: 6 },
    { name: 'Python', progress: 45, projects: 4 }
  ];

  const badges = [
    { name: 'Premier Projet', icon: '🏆', description: 'Complété votre premier projet' },
    { name: 'Codeur Assidu', icon: '⚡', description: '7 jours de code consécutifs' },
    { name: 'Membre Actif', icon: '🌟', description: 'Participé à 5 discussions' }
  ];

  // Statistiques de l'utilisateur
  const stats = [
    { 
      title: 'Niveau actuel', 
      value: currentLevel, 
      icon: Trophy,
      color: 'text-yellow-400'
    },
    { 
      title: 'XP totale', 
      value: totalXP, 
      icon: Star,
      color: 'text-purple-400'
    },
    { 
      title: 'Projets complétés', 
      value: completedProjectsCount, 
      icon: Code2,
      color: 'text-blue-400'
    },
    { 
      title: 'Temps total', 
      value: '12h 30m', 
      icon: Clock,
      color: 'text-green-400'
    }
  ];

  // Activité récente
  const recentActivity = [
    {
      type: 'project',
      title: 'Portfolio React',
      description: 'Projet complété avec succès',
      time: 'Il y a 2 heures',
      icon: Code2,
      color: 'text-blue-400'
    },
    {
      type: 'achievement',
      title: 'Premier projet',
      description: 'Vous avez complété votre premier projet',
      time: 'Il y a 1 jour',
      icon: Trophy,
      color: 'text-yellow-400'
    },
    {
      type: 'level',
      title: 'Niveau 2 atteint',
      description: 'Félicitations pour avoir atteint le niveau 2',
      time: 'Il y a 2 jours',
      icon: TrendingUp,
      color: 'text-green-400'
    }
  ];

  // Projets en cours
  const currentProjects = [
    {
      id: '1',
      title: 'Application Todo List',
      progress: 75,
      timeLeft: '2 heures restantes',
      icon: Code2,
      color: 'text-blue-400'
    },
    {
      id: '2',
      title: 'Blog Personnel',
      progress: 45,
      timeLeft: '4 heures restantes',
      icon: BookOpen,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {user?.full_name || 'Utilisateur'}
          </h1>
          <p className="text-gray-400">
            Voici un aperçu de votre progression
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Continuer l'apprentissage</h2>
                <Link to="/projects">
                  <Button variant="outline" size="sm">
                    Voir tous les projets
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProjects.map((project, index) => (
                  <Card 
                    key={index} 
                    className="p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter') navigate(`/projects/${project.id}`); }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-full bg-gray-800 ${project.color}`}>
                        <project.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{project.title}</h3>
                        <p className="text-sm text-gray-400">{project.timeLeft}</p>
                      </div>
                    </div>
                    <Progress value={project.progress} />
                  </Card>
                ))}
              </div>
            </div>

            {/* Skills Progress */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Progression des compétences</h2>
              <Card>
                <div className="space-y-6 p-6">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-gray-400">{skill.projects} projets terminés</span>
                      </div>
                      <Progress value={skill.progress} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
              <div className="space-y-3 p-6">
                <Link to="/projects">
                  <Button variant="primary" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Démarrer un nouveau projet
                  </Button>
                </Link>
                <Link to="/challenges">
                  <Button variant="outline" className="w-full">
                    Relever un défi
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="ghost" className="w-full">
                    Rejoindre la communauté
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Badges */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Badges récents</h3>
              <div className="space-y-3">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <div className="text-white font-medium">{badge.name}</div>
                      <div className="text-gray-400 text-sm">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Streak */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Série d'apprentissage</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">12</div>
                <div className="text-gray-400 text-sm mb-4">jours consécutifs</div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        i < 12 ? 'bg-orange-400' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Leaderboard */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Classement hebdomadaire</h3>
              <div className="space-y-3">
                {[
                  { name: 'You', xp: 450, rank: 3, isUser: true },
                  { name: 'Sarah M.', xp: 520, rank: 2 },
                  { name: 'Mike K.', xp: 680, rank: 1 },
                  { name: 'Emma R.', xp: 380, rank: 4 },
                ].sort((a, b) => b.xp - a.xp).map((player, index) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between p-2 rounded ${
                      player.isUser ? 'bg-purple-500/10 border border-purple-500/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${player.isUser ? 'text-purple-300 font-medium' : 'text-gray-300'}`}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{player.xp} XP</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activité récente */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full bg-gray-800 ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-400">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Projets en cours */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Projets en cours</h2>
              <div className="space-y-4">
                {currentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="space-y-2 cursor-pointer hover:bg-gray-800 rounded transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter') navigate(`/projects/${project.id}`); }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gray-800 ${project.color}`}>
                          <project.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{project.title}</h3>
                          <p className="text-xs text-gray-400">{project.timeLeft}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}