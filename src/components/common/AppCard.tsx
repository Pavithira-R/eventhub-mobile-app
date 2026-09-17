import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadows, Spacing } from '../../constants/Theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'flat';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const cardStyle = [
    styles.base,
    variant === 'default' && styles.default,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  default: {
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  flat: {
    backgroundColor: Colors.surfaceSubtle,
  },
});
