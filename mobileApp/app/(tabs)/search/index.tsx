import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePosts } from '@/hooks/usePosts';
import { PostType } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { Search, X, Clock, Trash2 } from 'lucide-react-native';
import { storageService } from '@/services/storage';

const FILTER_OPTIONS: { label: string; value: PostType | 'all'; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '📚' },
  { label: 'Articles', value: 'markdown', emoji: '📝' },
  { label: 'Audio', value: 'audio', emoji: '🎵' },
  { label: 'Videos', value: 'video', emoji: '🎬' },
  { label: 'GIFs', value: 'gif', emoji: '🎭' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<PostType | 'all'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { posts, loading, error, retry } = usePosts({
    search: searchQuery.trim(),
    type: selectedFilter === 'all' ? undefined : selectedFilter,
    limit: 30,
  });

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    setIsSearching(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const loadSearchHistory = async () => {
    const history = await storageService.getSearchHistory();
    setSearchHistory(history);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await storageService.addSearchTerm(query.trim());
      loadSearchHistory();
    }
  };

  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  const handleHistoryItemPress = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  const handleClearHistory = async () => {
    await storageService.clearSearchHistory();
    setSearchHistory([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePostPress = (postId: string) => {
    router.push(`/(tabs)/explore/post/${postId}`);
  };

  const handleAuthorPress = (authorId: string) => {
    router.push(`/(tabs)/explore/author/${authorId}`);
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

  const renderSearchHistory = () => {
    if (searchHistory.length === 0) return null;

    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <View style={styles.historyTitleContainer}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={styles.historyTitle}>Recent Searches</Text>
          </View>
          <TouchableOpacity onPress={handleClearHistory} activeOpacity={0.7}>
            <Trash2 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
        {searchHistory.map((term, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => handleHistoryItemPress(term)}
            activeOpacity={0.7}
          >
            <Search size={14} color={COLORS.textMuted} />
            <Text style={styles.historyItemText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (!isSearching && searchHistory.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Search size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Search Posts</Text>
          <Text style={styles.emptySubtitle}>
            Find articles, audio, videos, and GIFs by searching for keywords
          </Text>
        </View>
      );
    }

    if (isSearching && posts.length === 0 && !loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try different keywords or check your spelling
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {isSearching && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {FILTER_OPTIONS.map(renderFilterPill)}
          </ScrollView>
        )}
      </View>

      {!isSearching ? (
        <ScrollView style={styles.content}>
          {renderSearchHistory()}
          {renderEmptyState()}
        </ScrollView>
      ) : loading ? (
        <LoadingSpinner message="Searching..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  clearButton: {
    padding: SPACING.xs,
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
    flex: 1,
    padding: SPACING.md,
  },
  resultsContent: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  historyContainer: {
    marginBottom: SPACING.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyItemText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING['2xl'],
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
});