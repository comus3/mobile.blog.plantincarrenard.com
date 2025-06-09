import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostWithAuthor } from '@/types';

const STORAGE_KEYS = {
  CACHED_POSTS: 'cached_posts',
  SEARCH_HISTORY: 'search_history',
  LAST_SYNC: 'last_sync',
  IS_OFFLINE: 'is_offline',
};

export const storageService = {
  // Posts caching
  async cachePosts(posts: PostWithAuthor[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_POSTS, JSON.stringify(posts));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Failed to cache posts:', error);
    }
  },

  async getCachedPosts(): Promise<PostWithAuthor[]> {
    try {
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_POSTS);
      return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
      console.error('Failed to get cached posts:', error);
      return [];
    }
  },

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  },

  // Search history
  async addSearchTerm(term: string): Promise<void> {
    try {
      const history = await this.getSearchHistory();
      const updatedHistory = [term, ...history.filter(item => item !== term)].slice(0, 10);
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to add search term:', error);
    }
  },

  async getSearchHistory(): Promise<string[]> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  },

  async clearSearchHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  },

  // Offline status
  async setOfflineStatus(isOffline: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_OFFLINE, JSON.stringify(isOffline));
    } catch (error) {
      console.error('Failed to set offline status:', error);
    }
  },

  async getOfflineStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_OFFLINE);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Failed to get offline status:', error);
      return false;
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CACHED_POSTS,
        STORAGE_KEYS.SEARCH_HISTORY,
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.IS_OFFLINE,
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  },
};