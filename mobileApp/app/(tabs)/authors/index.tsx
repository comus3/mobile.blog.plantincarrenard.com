import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { AuthorCard } from '@/components/AuthorCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { User } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { usePosts } from '@/hooks/usePosts';

export default function AuthorsScreen() {
  const [authors, setAuthors] = useState<User[]>([]);
  const { posts, loading, error, retry } = usePosts({ limit: 100 });

  useEffect(() => {
    if (posts.length > 0) {
      // Extract unique authors from posts
      const uniqueAuthors = posts
        .map(post => post.author)
        .reduce((acc: User[], author) => {
          if (!acc.find(a => a.id === author.id)) {
            acc.push(author);
          }
          return acc;
        }, [])
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      
      setAuthors(uniqueAuthors);
    }
  }, [posts]);

  const handleAuthorPress = (authorId: string) => {
    router.push(`/(tabs)/explore/author/${authorId}`);
  };

  const renderAuthorCard = ({ item }: { item: User }) => (
    <View style={styles.authorCardContainer}>
      <AuthorCard
        author={item}
        onPress={() => handleAuthorPress(item.id)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Authors</Text>
        </View>
        <LoadingSpinner message="Loading authors..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Authors</Text>
        </View>
        <ErrorMessage message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Authors</Text>
        <Text style={styles.subtitle}>
          {authors.length} author{authors.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={authors}
        renderItem={renderAuthorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No authors found</Text>
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
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  content: {
    padding: SPACING.md,
  },
  authorCardContainer: {
    marginBottom: SPACING.md,
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