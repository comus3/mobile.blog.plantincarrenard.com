import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { PostWithAuthor } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { 
  FileText, 
  Music, 
  Video, 
  Image as ImageIcon,
  Calendar,
  User
} from 'lucide-react-native';
import { formatDate } from '@/utils/dateUtils';

interface PostCardProps {
  post: PostWithAuthor;
  onPress: () => void;
  onAuthorPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - SPACING.md * 3) / 2;

const getContentTypeIcon = (type: PostWithAuthor['contentType']) => {
  const iconProps = { size: 16, color: COLORS.primary };
  
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

const getContentTypeLabel = (type: PostWithAuthor['contentType']) => {
  switch (type) {
    case 'markdown':
      return 'Article';
    case 'audio':
      return 'Audio';
    case 'video':
      return 'Video';
    case 'gif':
      return 'GIF';
    default:
      return 'Article';
  }
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onAuthorPress,
}) => {
  const previewText = post.content.length > 100 
    ? `${post.content.substring(0, 100)}...` 
    : post.content;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeIndicator}>
          {getContentTypeIcon(post.contentType)}
          <Text style={styles.typeLabel}>
            {getContentTypeLabel(post.contentType)}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.content} numberOfLines={3}>
        {previewText}
      </Text>

      <TouchableOpacity
        style={styles.author}
        onPress={onAuthorPress}
        activeOpacity={0.7}
      >
        <View style={styles.authorImageContainer}>
          {post.author.avatarUrl ? (
            <Image 
              source={{ uri: post.author.avatarUrl }} 
              style={styles.authorImage}
            />
          ) : (
            <View style={styles.authorImagePlaceholder}>
              <User size={12} color={COLORS.textSecondary} />
            </View>
          )}
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName} numberOfLines={1}>
            {post.author.displayName}
          </Text>
          <View style={styles.dateContainer}>
            <Calendar size={10} color={COLORS.textMuted} />
            <Text style={styles.date}>
              {formatDate(post.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  typeLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  content: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImageContainer: {
    marginRight: SPACING.sm,
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorImagePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  date: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
});