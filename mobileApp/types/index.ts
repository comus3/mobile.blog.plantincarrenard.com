export type PostType = 'markdown' | 'audio' | 'video' | 'gif';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface PostWithAuthor {
  id: string;
  title: string;
  content: string;
  contentType: PostType;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextPage?: number;
}