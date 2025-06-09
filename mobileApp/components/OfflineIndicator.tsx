import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/config';
import { WifiOff } from 'lucide-react-native';

interface OfflineIndicatorProps {
  visible: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={16} color={COLORS.background} />
      <Text style={styles.text}>Offline Mode</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
});