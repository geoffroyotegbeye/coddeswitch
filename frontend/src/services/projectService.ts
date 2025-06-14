import api from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  type: string;
  xp_reward: number;
  estimated_time: string;
  tags: string[];
  thumbnail_url?: string;
  completed_by: number;
  created_at: string;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starter_code: string;
  expected_output?: string;
  hints: string[];
  order: number;
}

export interface FullProject extends Project {
  learning_objectives: string[];
  prerequisites: string[];
  steps: ProjectStep[];
  created_by: string;
  is_published: boolean;
  updated_at: string;
}

export interface CreateProject {
  title: string;
  description: string;
  language: string;
  difficulty: string;
  type: string;
  xp_reward: number;
  estimated_time: string;
  tags: string[];
  thumbnail_url?: string;
  learning_objectives: string[];
  prerequisites: string[];
  steps: ProjectStep[];
}

class ProjectService {
  async getProjects(params?: {
    skip?: number;
    limit?: number;
    language?: string;
    difficulty?: string;
    project_type?: string;
    search?: string;
  }): Promise<Project[]> {
    const response = await api.get('/projects', { params });
    return response.data;
  }

  async getProject(id: string): Promise<FullProject> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: CreateProject): Promise<FullProject> {
    const response = await api.post('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<CreateProject>): Promise<FullProject> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  async getLanguages(): Promise<string[]> {
    const response = await api.get('/projects/languages');
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get('/projects/categories');
    return response.data;
  }
}

export default new ProjectService();