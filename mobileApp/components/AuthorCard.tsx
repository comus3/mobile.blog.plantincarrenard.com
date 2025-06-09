import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { User as UserType } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { User, AtSign } from 'lucide-react-native';

interface AuthorCardProps {
  author: UserType;
  onPress: () => void;
  showBio?: boolean;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  onPress,
  showBio = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {author.avatarUrl ? (
          <Image 
            source={{ uri: author.avatarUrl }} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={24} color={COLORS.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.displayName}>
          {author.displayName}
        </Text>
        <View style={styles.usernameContainer}>
          <AtSign size={12} color={COLORS.textMuted} />
          <Text style={styles.username}>
            {author.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  displayName: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
});