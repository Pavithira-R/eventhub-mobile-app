import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>EventHub</Text>
        <Text style={styles.tagline}>Discover, book, and host campus & community events seamlessly.</Text>
      </View>

      <View style={styles.featuresCard}>
        <View style={styles.featureItem}>
          <Ionicons name="search" size={20} color={Colors.primary} style={styles.featureIcon} />
          <Text style={styles.featureText}>Explore trending & local events</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="ticket-outline" size={20} color={Colors.secondary} style={styles.featureIcon} />
          <Text style={styles.featureText}>Instant ticket booking & confirmations</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="calendar-outline" size={20} color={Colors.accent} style={styles.featureIcon} />
          <Text style={styles.featureText}>Organizer tools to manage bookings</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <AppButton
          title="Sign In"
          onPress={() => router.push('/(auth)/login')}
          style={styles.mainButton}
        />
        <AppButton
          title="Create Account"
          variant="outline"
          onPress={() => router.push('/(auth)/register')}
          style={styles.mainButton}
        />
        <AppButton
          title="Explore as Guest"
          variant="ghost"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.subtitle,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  featureIcon: {
    marginRight: Spacing.sm,
  },
  featureText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  buttonGroup: {
    gap: Spacing.sm,
  },
  mainButton: {
    width: '100%',
  },
});
