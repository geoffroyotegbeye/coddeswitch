import api from './api';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  post_type: 'question' | 'showcase' | 'discussion' | 'challenge';
  category: string;
  tags: string[];
  image?: string;
  author_info: {
    name: string;
    avatar: string;
    level: number;
    badge: string;
  };
  likes: number;
  replies: number;
  views: number;
  is_pinned: boolean;
  is_solved: boolean;
  is_trending: boolean;
  last_activity: string;
  created_at: string;
}

export interface CommunityComment {
  id: string;
  content: string;
  parent_id?: string;
  author_name: string;
  author_avatar: string;
  author_level: number;
  likes: number;
  replies_count: number;
  created_at: string;
}

export interface CreateCommunityPost {
  title: string;
  content: string;
  post_type: 'question' | 'showcase' | 'discussion' | 'challenge';
  category: string;
  tags: string[];
  image?: string;
}

export interface CreateCommunityComment {
  content: string;
  parent_id?: string;
}

class CommunityService {
  async getPosts(params?: {
    skip?: number;
    limit?: number;
    post_type?: string;
    category?: string;
    search?: string;
    trending_only?: boolean;
    unanswered_only?: boolean;
    solved_only?: boolean;
  }): Promise<CommunityPost[]> {
    const response = await api.get('/community/posts', { params });
    return response.data;
  }

  async getPost(id: string): Promise<CommunityPost> {
    const response = await api.get(`/community/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreateCommunityPost): Promise<CommunityPost> {
    const response = await api.post('/community/posts', data);
    return response.data;
  }

  async updatePost(id: string, data: Partial<CreateCommunityPost>): Promise<CommunityPost> {
    const response = await api.put(`/community/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`/community/posts/${id}`);
  }

  async likePost(id: string): Promise<{ liked: boolean; total_likes: number }> {
    const response = await api.post(`/community/posts/${id}/like`);
    return response.data;
  }

  async markSolved(id: string): Promise<{ solved: boolean }> {
    const response = await api.post(`/community/posts/${id}/solve`);
    return response.data;
  }

  async getComments(postId: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<CommunityComment[]> {
    const response = await api.get(`/community/posts/${postId}/comments`, { params });
    return response.data;
  }

  async createComment(postId: string, data: CreateCommunityComment): Promise<CommunityComment> {
    const response = await api.post(`/community/posts/${postId}/comments`, data);
    return response.data;
  }

  async getStats(): Promise<{
    total_posts: number;
    total_members: number;
    online_now: number;
    solved_today: number;
  }> {
    const response = await api.get('/community/stats');
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get('/community/categories');
    return response.data;
  }
}

export default new CommunityService();