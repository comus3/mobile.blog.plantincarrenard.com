// mobileApp/app/(tabs)/explore/author/[id].tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePosts } from '@/hooks/usePosts';
import { User } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { ArrowLeft, User as UserIcon, AtSign, Calendar } from 'lucide-react-native';
import { formatDate } from '@/utils/dateUtils';
import { usersApi } from '@/services/api';

export default function AuthorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [author, setAuthor] = useState<User | null>(null);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState<string | null>(null);
  
  const { posts, loading, error, refreshing, refresh, retry } = usePosts({
    authorId: id,
    limit: 50,
  });

  useEffect(() => {
    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      setAuthorLoading(true);
      setAuthorError(null);
      
      const authorData = await usersApi.getUser(id!);
      setAuthor(authorData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load author profile.';
      setAuthorError(errorMessage);
      
      // If we have posts but author fetch failed, use author from first post as fallback
      if (posts.length > 0) {
        setAuthor(posts[0].author);
        setAuthorError(null);
      }
    } finally {
      setAuthorLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handlePostPress = (postId: string) => {
    router.push(`/(tabs)/explore/post/${postId}`);
  };

  const handleRefresh = async () => {
    await Promise.all([
      refresh(),
      fetchAuthor()
    ]);
  };

  const handleRetry = async () => {
    await Promise.all([
      retry(),
      fetchAuthor()
    ]);
  };

  const renderPostCard = ({ item, index }: { item: any; index: number }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onAuthorPress={() => {}} // No-op since we're already on author page
    />
  );

  const renderHeader = () => {
    if (!author) return null;

    return (
      <View style={styles.authorHeader}>
        <View style={styles.avatarContainer}>
          {author.avatarUrl ? (
            <Image 
              source={{ uri: author.avatarUrl }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserIcon size={48} color={COLORS.textSecondary} />
            </View>
          )}
        </View>
        
        <Text style={styles.displayName}>
          {author.displayName}
        </Text>
        
        <View style={styles.usernameContainer}>
          <AtSign size={16} color={COLORS.textMuted} />
          <Text style={styles.username}>
            {author.username}
          </Text>
        </View>

        <View style={styles.joinedContainer}>
          <Calendar size={14} color={COLORS.textMuted} />
          <Text style={styles.joinedText}>
            Joined {formatDate(author.createdAt)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Posts</Text>
      </View>
    );
  };

  // Show loading if either author or posts are loading (and not refreshing)
  if ((authorLoading || loading) && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Author</Text>
        </View>
        <LoadingSpinner message="Loading author..." />
      </SafeAreaView>
    );
  }

  // Show error if both author and posts failed to load
  if ((authorError && !author) && (error && posts.length === 0)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Author</Text>
        </View>
        <ErrorMessage 
          message={authorError || error || 'Failed to load author profile'} 
          onRetry={handleRetry} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {author?.displayName || 'Author'}
        </Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text,
  },
  content: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  authorHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  username: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  joinedText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  statNumber: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text,
    alignSelf: 'stretch',
    textAlign: 'left',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING['2xl'],
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
  },
});