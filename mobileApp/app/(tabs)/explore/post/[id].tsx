import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { AuthorCard } from '@/components/AuthorCard';
import { PostWithAuthor } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { 
  ArrowLeft, 
  Share2, 
  FileText, 
  Music, 
  Video, 
  Image as ImageIcon,
  Play,
  Pause
} from 'lucide-react-native';
import { formatDateTime } from '@/utils/dateUtils';
import { removeMarkdown } from '@/utils/formatting';

const { width } = Dimensions.get('window');

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the post by ID
    // For demo purposes, we'll simulate this
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock post data
      const mockPost: PostWithAuthor = {
        id: id!,
        title: 'Sample Blog Post Title',
        content: `# Sample Blog Post

This is a sample blog post content that demonstrates how the post detail screen looks. It includes markdown formatting and various text styles.

## Features
- Rich text formatting
- Code blocks
- Lists and more

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

This post shows how different content types are displayed in the mobile application.`,
        contentType: 'markdown',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: '1',
          username: 'johndoe',
          email: 'john@example.com',
          displayName: 'John Doe',
          avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          createdAt: new Date(),
        },
      };
      
      setPost(mockPost);
    } catch (err) {
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (post) {
      try {
        await Share.share({
          message: `Check out this post: ${post.title}`,
          title: post.title,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleAuthorPress = () => {
    if (post) {
      router.push(`/(tabs)/explore/author/${post.author.id}`);
    }
  };

  const getContentTypeIcon = (type: PostWithAuthor['contentType']) => {
    const iconProps = { size: 20, color: COLORS.primary };
    
    switch (type) {
      case 'markdown':
        return <FileText {...iconProps} />;
      case 'audio':
        return <Music {...iconProps} />;
      case 'video':
        return <Video {...iconProps} />;
      case 'gif':
        return <ImageIcon {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const renderContent = () => {
    if (!post) return null;

    switch (post.contentType) {
      case 'markdown':
        return (
          <Text style={styles.content}>
            {removeMarkdown(post.content)}
          </Text>
        );
      
      case 'audio':
        return (
          <View style={styles.mediaContainer}>
            <View style={styles.audioPlayer}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setIsPlaying(!isPlaying)}
                activeOpacity={0.7}
              >
                {isPlaying ? (
                  <Pause size={24} color={COLORS.background} />
                ) : (
                  <Play size={24} color={COLORS.background} />
                )}
              </TouchableOpacity>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>Audio Content</Text>
                <Text style={styles.audioDuration}>00:00 / 05:32</Text>
              </View>
            </View>
            <Text style={styles.content}>
              {removeMarkdown(post.content)}
            </Text>
          </View>
        );
      
      case 'video':
        return (
          <View style={styles.mediaContainer}>
            <View style={styles.videoPlayer}>
              <TouchableOpacity
                style={styles.videoPlayButton}
                activeOpacity={0.7}
              >
                <Play size={32} color={COLORS.background} />
              </TouchableOpacity>
            </View>
            <Text style={styles.content}>
              {removeMarkdown(post.content)}
            </Text>
          </View>
        );
      
      case 'gif':
        return (
          <View style={styles.mediaContainer}>
            <View style={styles.gifContainer}>
              <Text style={styles.gifPlaceholder}>GIF Content</Text>
            </View>
            <Text style={styles.content}>
              {removeMarkdown(post.content)}
            </Text>
          </View>
        );
      
      default:
        return (
          <Text style={styles.content}>
            {removeMarkdown(post.content)}
          </Text>
        );
    }
  };

  if (loading) {
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
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <LoadingSpinner message="Loading post..." />
      </SafeAreaView>
    );
  }

  if (error || !post) {
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
        </View>
        <ErrorMessage 
          message={error || 'Post not found'} 
          onRetry={fetchPost} 
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
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.postHeader}>
          <View style={styles.typeIndicator}>
            {getContentTypeIcon(post.contentType)}
            <Text style={styles.typeLabel}>
              {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.title}>{post.title}</Text>
          
          <Text style={styles.date}>
            {formatDateTime(post.createdAt)}
          </Text>
        </View>

        <View style={styles.authorContainer}>
          <AuthorCard 
            author={post.author} 
            onPress={handleAuthorPress}
          />
        </View>

        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  shareButton: {
    padding: SPACING.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  postHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  typeLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    color: COLORS.text,
    lineHeight: 32,
    marginBottom: SPACING.md,
  },
  date: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  authorContainer: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  content: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 24,
  },
  mediaContainer: {
    gap: SPACING.lg,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  audioDuration: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gifPlaceholder: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
  },
});