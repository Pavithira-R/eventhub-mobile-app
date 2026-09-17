import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../constants/Theme';

interface StatusBadgeProps {
  label: string;
  status?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status = 'primary',
  style,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'success':
        return { bg: Colors.successLight, text: Colors.success };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.warning };
      case 'error':
        return { bg: Colors.errorLight, text: Colors.error };
      case 'info':
        return { bg: Colors.infoLight, text: Colors.info };
      case 'neutral':
        return { bg: Colors.surfaceSubtle, text: Colors.textSecondary };
      case 'primary':
      default:
        return { bg: Colors.primaryLight, text: Colors.primary };
    }
  };

  const current = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: current.bg }, style]}>
      <Text style={[styles.text, { color: current.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
