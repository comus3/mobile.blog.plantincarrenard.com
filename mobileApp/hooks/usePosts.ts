import { useState, useEffect, useCallback } from 'react';
import { PostWithAuthor, PostType } from '@/types';
import { postsApi } from '@/services/api';
import { storageService } from '@/services/storage';

interface UsePostsOptions {
  limit?: number;
  search?: string;
  type?: PostType;
  authorId?: string;
}

export const usePosts = (options: UsePostsOptions = {}) => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const fetchPosts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      let fetchedPosts: PostWithAuthor[];

      if (options.authorId) {
        fetchedPosts = await postsApi.getPostsByAuthor(options.authorId, options.limit);
      } else if (options.search) {
        fetchedPosts = await postsApi.searchPosts(options.search, options.type, options.limit);
      } else {
        fetchedPosts = await postsApi.getAllPosts({
          limit: options.limit,
          type: options.type,
        });
      }

      setPosts(fetchedPosts);
      
      // Cache posts for offline use (only for main feed)
      if (!options.authorId && !options.search) {
        await storageService.cachePosts(fetchedPosts);
      }
      
      setIsOffline(false);
      await storageService.setOfflineStatus(false);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      
      // Try to load cached posts when offline
      if (!options.authorId && !options.search) {
        const cachedPosts = await storageService.getCachedPosts();
        if (cachedPosts.length > 0) {
          setPosts(cachedPosts);
          setIsOffline(true);
          await storageService.setOfflineStatus(true);
          setError('Showing cached posts. Pull to refresh when online.');
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [options.limit, options.search, options.type, options.authorId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(false);
  }, [fetchPosts]);

  const retry = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refreshing,
    isOffline,
    refresh,
    retry,
  };
};