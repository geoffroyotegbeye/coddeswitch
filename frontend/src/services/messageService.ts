import api from './api';

export interface Conversation {
  id: string;
  name?: string;
  conversation_type: 'direct' | 'bastion';
  participants: Array<{
    email: string;
    name: string;
    avatar: string;
    is_online: boolean;
  }>;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  message_type: 'text' | 'code' | 'file' | 'system';
  language?: string;
  sender_name: string;
  sender_avatar: string;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  created_at: string;
  edited_at?: string;
}

export interface Bastion {
  id: string;
  name: string;
  description: string;
  is_private: boolean;
  max_members: number;
  tags: string[];
  avatar: string;
  members_count: number;
  last_activity: string;
  created_at: string;
}

export interface CreateConversation {
  name?: string;
  conversation_type: 'direct' | 'bastion';
  participants: string[];
}

export interface CreateMessage {
  content: string;
  message_type?: 'text' | 'code' | 'file' | 'system';
  language?: string;
}

export interface CreateBastion {
  name: string;
  description: string;
  is_private?: boolean;
  max_members?: number;
  tags?: string[];
}

class MessageService {
  // CONVERSATIONS
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/messages/conversations');
    return response.data;
  }

  async createConversation(data: CreateConversation): Promise<Conversation> {
    const response = await api.post('/messages/conversations', data);
    return response.data;
  }

  async getConversationMessages(conversationId: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<Message[]> {
    const response = await api.get(`/messages/conversations/${conversationId}/messages`, { params });
    return response.data;
  }

  async sendMessage(conversationId: string, data: CreateMessage): Promise<Message> {
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, data);
    return response.data;
  }

  // BASTIONS
  async getAvailableBastions(params?: {
    search?: string;
    tags?: string[];
    skip?: number;
    limit?: number;
  }): Promise<Bastion[]> {
    const response = await api.get('/messages/bastions', { params });
    return response.data;
  }

  async getMyBastions(): Promise<Bastion[]> {
    const response = await api.get('/messages/bastions/my');
    return response.data;
  }

  async createBastion(data: CreateBastion): Promise<Bastion> {
    const response = await api.post('/messages/bastions', data);
    return response.data;
  }

  async joinBastion(bastionId: string): Promise<{ joined: boolean }> {
    const response = await api.post(`/messages/bastions/${bastionId}/join`);
    return response.data;
  }

  async leaveBastion(bastionId: string): Promise<{ left: boolean }> {
    const response = await api.post(`/messages/bastions/${bastionId}/leave`);
    return response.data;
  }

  async getBastionMessages(bastionId: string, params?: {
    skip?: number;
    limit?: number;
  }): Promise<Message[]> {
    const response = await api.get(`/messages/bastions/${bastionId}/messages`, { params });
    return response.data;
  }

  async sendBastionMessage(bastionId: string, data: CreateMessage): Promise<Message> {
    const response = await api.post(`/messages/bastions/${bastionId}/messages`, data);
    return response.data;
  }

  async addReaction(messageId: string, emoji: string): Promise<any> {
    const response = await api.post(`/messages/messages/${messageId}/react`, { emoji });
    return response.data;
  }
}

export default new MessageService();