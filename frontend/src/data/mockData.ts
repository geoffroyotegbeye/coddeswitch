import { Project, Skill } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Personal Portfolio Website',
    description: 'Build a responsive portfolio website with HTML and CSS',
    language: 'html',
    difficulty: 'beginner',
    type: 'guided',
    xpReward: 100,
    estimatedTime: '2 hours',
    tags: ['HTML', 'CSS', 'Responsive'],
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 1250
  },
  {
    id: '2',
    title: 'Interactive Todo App',
    description: 'Create a fully functional todo application using JavaScript',
    language: 'javascript',
    difficulty: 'intermediate',
    type: 'guided',
    xpReward: 200,
    estimatedTime: '4 hours',
    tags: ['JavaScript', 'DOM', 'LocalStorage'],
    thumbnail: 'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 850
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Build a weather app that fetches data from an API',
    language: 'javascript',
    difficulty: 'intermediate',
    type: 'challenge',
    xpReward: 250,
    estimatedTime: '5 hours',
    tags: ['API', 'Fetch', 'Async'],
    thumbnail: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 650
  },
  {
    id: '4',
    title: 'E-commerce Product Page',
    description: 'Create a modern product page with React components',
    language: 'react',
    difficulty: 'intermediate',
    type: 'guided',
    xpReward: 300,
    estimatedTime: '6 hours',
    tags: ['React', 'Components', 'State'],
    thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 420
  },
  {
    id: '5',
    title: 'Data Analysis with Python',
    description: 'Analyze sales data using pandas and matplotlib',
    language: 'python',
    difficulty: 'advanced',
    type: 'guided',
    xpReward: 400,
    estimatedTime: '8 hours',
    tags: ['Python', 'Pandas', 'Data Viz'],
    thumbnail: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 280
  },
  {
    id: '6',
    title: 'CSS Animation Gallery',
    description: 'Create stunning CSS animations and transitions',
    language: 'css',
    difficulty: 'intermediate',
    type: 'challenge',
    xpReward: 180,
    estimatedTime: '3 hours',
    tags: ['CSS', 'Animations', 'Keyframes'],
    thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
    completedBy: 520
  }
];

export const mockSkills: Skill[] = [
  { name: 'HTML', level: 8, maxLevel: 10, projects: 12 },
  { name: 'CSS', level: 7, maxLevel: 10, projects: 10 },
  { name: 'JavaScript', level: 6, maxLevel: 10, projects: 8 },
  { name: 'React', level: 4, maxLevel: 10, projects: 4 },
  { name: 'Python', level: 3, maxLevel: 10, projects: 2 }
];