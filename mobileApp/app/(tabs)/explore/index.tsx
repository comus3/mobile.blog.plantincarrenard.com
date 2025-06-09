import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { usePosts } from '@/hooks/usePosts';
import { PostType } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { Search } from 'lucide-react-native';

const FILTER_OPTIONS: { label: string; value: PostType | 'all'; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '📚' },
  { label: 'Articles', value: 'markdown', emoji: '📝' },
  { label: 'Audio', value: 'audio', emoji: '🎵' },
  { label: 'Videos', value: 'video', emoji: '🎬' },
  { label: 'GIFs', value: 'gif', emoji: '🎭' },
];

export default function ExploreScreen() {
  const [selectedFilter, setSelectedFilter] = useState<PostType | 'all'>('all');
  
  const { posts, loading, error, refreshing, isOffline, refresh, retry } = usePosts({
    type: selectedFilter === 'all' ? undefined : selectedFilter,
    limit: 50,
  });

  const filteredPosts = useMemo(() => {
    return posts;
  }, [posts]);

  const handlePostPress = (postId: string) => {
    router.push(`/(tabs)/explore/post/${postId}`);
  };

  const handleAuthorPress = (authorId: string) => {
    router.push(`/(tabs)/explore/author/${authorId}`);
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const renderPostCard = ({ item, index }: { item: any; index: number }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onAuthorPress={() => handleAuthorPress(item.author.id)}
    />
  );

  const renderFilterPill = (filter: typeof FILTER_OPTIONS[0]) => (
    <TouchableOpacity
      key={filter.value}
      style={[
        styles.filterPill,
        selectedFilter === filter.value && styles.filterPillActive,
      ]}
      onPress={() => setSelectedFilter(filter.value)}
      activeOpacity={0.7}
    >
      <Text style={styles.filterEmoji}>{filter.emoji}</Text>
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter.value && styles.filterTextActive,
        ]}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Search size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_OPTIONS.map(renderFilterPill)}
      </ScrollView>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <OfflineIndicator visible={isOffline} />
        {renderHeader()}
        <LoadingSpinner message="Loading posts..." />
      </SafeAreaView>
    );
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <OfflineIndicator visible={isOffline} />
        {renderHeader()}
        <ErrorMessage message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <OfflineIndicator visible={isOffline} />
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts found</Text>
          </View>
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
    backgroundColor: COLORS.background,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    color: COLORS.text,
  },
  searchButton: {
    padding: SPACING.sm,
  },
  filterContainer: {
    marginHorizontal: -SPACING.md,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterEmoji: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginRight: SPACING.sm,
  },
  filterText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: 'space-between',
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