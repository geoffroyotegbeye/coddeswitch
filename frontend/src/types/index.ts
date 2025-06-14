export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  xp: number;
  level: number;
  badges: Badge[];
  completed_projects: string[];
  avatar_url?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  // Support pour les deux formats (ancien et nouveau)
  title?: string;
  name?: string;
  description: string;
  // Support pour les deux formats
  language?: 'html' | 'css' | 'javascript' | 'react' | 'python';
  category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // Support pour les deux formats
  type?: 'guided' | 'challenge' | 'community';
  xpReward?: number;
  estimatedTime?: string;
  tags: string[];
  // Support pour les deux formats
  thumbnail?: string;
  image_url?: string;
  completedBy?: number;
  // Nouveaux champs
  stars?: number;
  author_id?: string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
  isPublished?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  projects: number;
}