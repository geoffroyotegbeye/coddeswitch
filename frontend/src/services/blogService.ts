import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image?: string;
  featured: boolean;
  author_info: {
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  read_time: string;
  likes: number;
  comments_count: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
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

export interface CreateBlogPost {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  published?: boolean;
}

export interface CreateComment {
  content: string;
  parent_id?: string;
}

class BlogService {
  async getPosts(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured_only?: boolean;
  }): Promise<BlogPost[]> {
    const response = await api.get('/blog/posts', { params });
    return response.data;
  }

  async getPost(id: string): Promise<BlogPost> {
    const response = await api.get(`/blog/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreateBlogPost): Promise<BlogPost> {
    const response = await api.post('/blog/posts', data);
    return response.data;
  }

  async updatePost(id: string, data: Partial<CreateBlogPost>): Promise<BlogPost> {
    const response = await api.put(`/blog/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`/blog/posts/${id}`);
  }

  async likePost(id: string): Promise<{ liked: boolean; total_likes: number }> {
    const response = await api.post(`/blog/posts/${id}/like`);
    return response.data;
  }

  async bookmarkPost(id: string): Promise<{ bookmarked: boolean }> {
    const response = await api.post(`/blog/posts/${id}/bookmark`);
    return response.data;
  }

  async getComments(postId: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<BlogComment[]> {
    const response = await api.get(`/blog/posts/${postId}/comments`, { params });
    return response.data;
  }

  async createComment(postId: string, data: CreateComment): Promise<BlogComment> {
    const response = await api.post(`/blog/posts/${postId}/comments`, data);
    return response.data;
  }

  async likeComment(commentId: string): Promise<{ liked: boolean; total_likes: number }> {
    const response = await api.post(`/blog/comments/${commentId}/like`);
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get('/blog/categories');
    return response.data;
  }
}

export default new BlogService();