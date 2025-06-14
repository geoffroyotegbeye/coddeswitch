import React from 'react';
import { 
  Users, FileText, MessageSquare, Code2, TrendingUp, Eye, 
  Activity, Award, CheckCircle, Clock, Calendar, ArrowUpRight,
  AlertCircle, UserCheck, UserPlus, BarChart2
} from 'lucide-react';
import { Card } from '../common/Card';
import { StatsCard } from '../dashboard/StatsCard';

export function AdminDashboard() {
  // Statistiques principales
  const stats = [
    { title: 'Utilisateurs totaux', value: '12,847', change: '+234', icon: Users, color: 'blue' as const },
    { title: 'Articles de blog', value: '156', change: '+12', icon: FileText, color: 'green' as const },
    { title: 'Posts communautaires', value: '3,421', change: '+89', icon: MessageSquare, color: 'purple' as const },
    { title: 'Projets actifs', value: '67', change: '+5', icon: Code2, color: 'orange' as const },
  ];

  // Activité récente
  const recentActivity = [
    { type: 'user', message: 'Nouvel utilisateur inscrit: sarah.martinez@email.com', time: '2 min', icon: UserPlus },
    { type: 'blog', message: 'Article publié: "Les nouveautés React 18"', time: '15 min', icon: FileText },
    { type: 'community', message: 'Question résolue dans la communauté JavaScript', time: '32 min', icon: CheckCircle },
    { type: 'project', message: 'Projet "Portfolio React" complété par 5 utilisateurs', time: '1h', icon: Code2 },
    { type: 'user', message: 'Utilisateur banni pour spam: spam@example.com', time: '2h', icon: AlertCircle },
  ];

  // Contenu populaire
  const topContent = [
    { title: 'Les 10 erreurs JavaScript communes', type: 'Blog', views: 2847, engagement: '94%' },
    { title: 'Comment optimiser React ?', type: 'Communauté', views: 1923, engagement: '87%' },
    { title: 'Portfolio Personnel', type: 'Projet', views: 1654, engagement: '92%' },
    { title: 'CSS Grid vs Flexbox', type: 'Blog', views: 1432, engagement: '89%' },
  ];

  // Statistiques de performance
  const performanceStats = [
    { label: 'Taux de conversion', value: '3.2%', change: '+0.4%', isPositive: true },
    { label: 'Temps moyen sur le site', value: '4m 32s', change: '+12s', isPositive: true },
    { label: 'Taux de rebond', value: '42%', change: '-3%', isPositive: true },
    { label: 'Projets complétés', value: '284', change: '+18', isPositive: true },
  ];

  // Tâches à faire
  const tasks = [
    { title: 'Modérer les nouveaux commentaires', priority: 'high', status: 'pending', dueDate: 'Aujourd\'hui' },
    { title: 'Approuver les nouveaux projets', priority: 'medium', status: 'pending', dueDate: 'Demain' },
    { title: 'Mettre à jour la page d\'accueil', priority: 'medium', status: 'in-progress', dueDate: '14 Juin' },
    { title: 'Répondre aux messages de support', priority: 'high', status: 'pending', dueDate: 'Aujourd\'hui' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-400">
            <Clock className="inline-block mr-1 h-4 w-4" />
            <span>12 Juin 2025, 17:58</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            <span>Activité élevée aujourd'hui</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Télécharger le rapport
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphique d'activité et statistiques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Activité des utilisateurs</h3>
              <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded-full text-gray-300">7 jours</button>
                <button className="bg-blue-600 text-xs px-3 py-1 rounded-full text-white">30 jours</button>
                <button className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded-full text-gray-300">90 jours</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Graphique d'activité des utilisateurs</p>
                <p className="text-sm">(Données simulées pour la démonstration)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistiques de performance */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
            <div className="space-y-6">
              {performanceStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{stat.label}</span>
                  <div className="text-right">
                    <div className="text-white font-medium">{stat.value}</div>
                    <div className={`text-xs ${stat.isPositive ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                      {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activité récente</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-900/30 text-blue-400' :
                    activity.type === 'blog' ? 'bg-green-900/30 text-green-400' :
                    activity.type === 'community' ? 'bg-purple-900/30 text-purple-400' :
                    'bg-orange-900/30 text-orange-400'
                  }`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">Il y a {activity.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 text-blue-400 hover:text-blue-300 text-sm text-center">
                Voir toutes les activités
              </button>
            </div>
          </div>
        </Card>

        {/* Tâches à faire */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tâches à faire</h3>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-3 ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-white text-sm">{task.title}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {task.dueDate}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-xs ${
                      task.status === 'pending' ? 'text-yellow-400' : 
                      task.status === 'in-progress' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {task.status === 'pending' ? 'En attente' : 
                       task.status === 'in-progress' ? 'En cours' : 'Terminé'}
                    </span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Marquer comme terminé
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 text-blue-400 hover:text-blue-300 text-sm text-center">
                Voir toutes les tâches
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenu populaire */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contenu populaire</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3 font-medium">Titre</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium text-right">Vues</th>
                  <th className="pb-3 font-medium text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topContent.map((content, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3 text-white">{content.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content.type === 'Blog' ? 'bg-green-900/30 text-green-400' :
                        content.type === 'Communauté' ? 'bg-purple-900/30 text-purple-400' :
                        'bg-orange-900/30 text-orange-400'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-300">{content.views.toLocaleString()}</td>
                    <td className="py-3 text-right text-green-400">{content.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              Voir tous les contenus
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
