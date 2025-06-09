import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { PostWithAuthor, User, PostType, PaginatedResponse } from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface GetPostsParams {
  limit?: number;
  search?: string;
  type?: PostType;
  page?: number;
}

export const postsApi = {
  getAllPosts: async (params?: GetPostsParams): Promise<PostWithAuthor[]> => {
    try {
      const response = await api.get('/api/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw new Error('Failed to load posts. Please check your connection.');
    }
  },

  getPostsByAuthor: async (
    authorId: string, 
    limit?: number
  ): Promise<PostWithAuthor[]> => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get(`/api/posts/author/${authorId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch author posts:', error);
      throw new Error('Failed to load author posts. Please check your connection.');
    }
  },

  searchPosts: async (
    query: string, 
    type?: PostType, 
    limit?: number
  ): Promise<PostWithAuthor[]> => {
    try {
      const params = { search: query, type, limit };
      const response = await api.get('/api/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to search posts:', error);
      throw new Error('Failed to search posts. Please check your connection.');
    }
  },
};

export const usersApi = {
  getUser: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to load user profile. Please check your connection.');
    }
  },

  getUserByUsername: async (username: string): Promise<User> => {
    try {
      const response = await api.get(`/api/users/username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user by username:', error);
      throw new Error('Failed to load user profile. Please check your connection.');
    }
  },
};

export default api;