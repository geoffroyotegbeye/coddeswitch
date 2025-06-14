import api from './api';

export interface StepProgress {
  step_id: string;
  completed: boolean;
  code?: string;
  completed_at?: string;
}

export interface UserProgress {
  id: string;
  project_id: string;
  current_step: number;
  steps_progress: StepProgress[];
  is_completed: boolean;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
}

export interface UpdateProgress {
  current_step?: number;
  steps_progress?: StepProgress[];
  is_completed?: boolean;
}

class ProgressService {
  async getProgress(projectId: string): Promise<UserProgress> {
    const response = await api.get(`/progress/${projectId}`);
    return response.data;
  }

  async updateProgress(projectId: string, data: UpdateProgress): Promise<UserProgress> {
    const response = await api.put(`/progress/${projectId}`, data);
    return response.data;
  }

  async completeProject(projectId: string): Promise<UserProgress> {
    const response = await api.post(`/progress/${projectId}/complete`);
    return response.data;
  }
}

export default new ProgressService();