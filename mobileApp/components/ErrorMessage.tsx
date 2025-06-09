import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { RefreshCw, AlertCircle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showIcon = true,
}) => {
  return (
    <View style={styles.container}>
      {showIcon && (
        <AlertCircle 
          size={48} 
          color={COLORS.error} 
          style={styles.icon}
        />
      )}
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <RefreshCw size={16} color={COLORS.background} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  message: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
});