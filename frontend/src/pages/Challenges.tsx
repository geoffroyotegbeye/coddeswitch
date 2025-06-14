import React from 'react';
import { Zap, Code, Palette, Brain, Rocket } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Challenges() {
  const challenges = [
    {
      id: '1',
      title: 'CSS Art Challenge',
      description: 'Create stunning visual art using only CSS. No images allowed!',
      icon: Palette,
      difficulty: 'intermediate',
      participants: 234,
      timeLimit: '2 hours',
      prize: '500 XP',
      tags: ['CSS', 'Creative', 'Art']
    },
    {
      id: '2',
      title: 'Algorithm Speed Run',
      description: 'Solve 10 coding problems as fast as possible.',
      icon: Zap,
      difficulty: 'advanced',
      participants: 156,
      timeLimit: '1 hour',
      prize: '750 XP',
      tags: ['JavaScript', 'Algorithms', 'Speed']
    },
    {
      id: '3',
      title: 'Component Library',
      description: 'Build a reusable React component library from scratch.',
      icon: Code,
      difficulty: 'advanced',
      participants: 89,
      timeLimit: '4 hours',
      prize: '1000 XP',
      tags: ['React', 'Components', 'Library']
    },
    {
      id: '4',
      title: 'AI Prompt Engineering',
      description: 'Create the most creative AI-generated content using prompts.',
      icon: Brain,
      difficulty: 'beginner',
      participants: 312,
      timeLimit: '1.5 hours',
      prize: '300 XP',
      tags: ['AI', 'Creativity', 'Prompts']
    }
  ];

  const weeklyChallenge = {
    title: 'Build a Weather App',
    description: 'Create a beautiful weather application that fetches real-time data and displays forecasts.',
    timeLeft: '3 days',
    participants: 1247,
    prize: '2000 XP + Badge',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Code Challenges 🏆
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your skills, compete with others, and push your limits with our exciting coding challenges. 
            Level up faster and earn exclusive badges!
          </p>
        </div>

        {/* Weekly Challenge */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Rocket className="h-6 w-6 mr-2 text-purple-400" />
            Weekly Challenge
          </h2>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
            <div className="relative flex flex-col lg:flex-row">
              <div className="lg:w-2/3 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="primary" size="md">Weekly Challenge</Badge>
                  <Badge variant="warning" size="md">{weeklyChallenge.timeLeft} left</Badge>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {weeklyChallenge.title}
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  {weeklyChallenge.description}
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {weeklyChallenge.participants}
                    </div>
                    <div className="text-sm text-gray-400">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {weeklyChallenge.prize}
                    </div>
                    <div className="text-sm text-gray-400">Prize</div>
                  </div>
                </div>
                <Button size="lg" icon={Rocket}>
                  Join Challenge
                </Button>
              </div>
              <div className="lg:w-1/3 lg:min-h-[300px]">
                <img
                  src={weeklyChallenge.image}
                  alt={weeklyChallenge.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Challenges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Daily Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} hover>
                <div className="text-center mb-6">
                  <div className="bg-purple-500/10 p-4 rounded-full inline-block mb-4">
                    <challenge.icon className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {challenge.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    {challenge.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>⏱ {challenge.timeLimit}</span>
                    <span>👥 {challenge.participants}</span>
                  </div>

                  <div className="text-center">
                    <div className="text-yellow-400 font-semibold mb-2">
                      🏆 {challenge.prize}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Challenge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Challenge Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Challenge Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Frontend', count: 24, color: 'bg-blue-500' },
              { name: 'Backend', count: 18, color: 'bg-green-500' },
              { name: 'Full Stack', count: 12, color: 'bg-purple-500' },
              { name: 'Algorithms', count: 31, color: 'bg-orange-500' },
              { name: 'Design', count: 15, color: 'bg-pink-500' },
              { name: 'DevOps', count: 8, color: 'bg-teal-500' },
              { name: 'Mobile', count: 10, color: 'bg-indigo-500' },
              { name: 'AI/ML', count: 6, color: 'bg-red-500' }
            ].map((category) => (
              <Card key={category.name} hover className="text-center p-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {category.name.slice(0, 2)}
                  </span>
                </div>
                <h3 className="text-white font-semibold">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count} challenges</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Challenge Leaderboard</h2>
          <Card>
            <div className="space-y-4">
              {[
                { name: 'Alex Chen', challenges: 42, xp: 12500, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
                { name: 'Sarah Martinez', challenges: 38, xp: 11200, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
                { name: 'Mike Johnson', challenges: 35, xp: 10800, avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
                { name: 'Emma Wilson', challenges: 33, xp: 9900, avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
                { name: 'David Brown', challenges: 29, xp: 9200, avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' }
              ].map((user, index) => (
                <div key={user.name} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-white font-semibold">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.challenges} challenges completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-semibold">{user.xp.toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}