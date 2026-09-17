import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container} contentContainerStyle={styles.content}>
      {/* Visual Header / Brand Area */}
      <View style={styles.brandSection}>
        <View style={styles.logoBadge}>
          <Ionicons name="sparkles" size={32} color={Colors.textInverse} />
        </View>
        <Text style={styles.brandTitle}>EventHub</Text>
        <Text style={styles.tagline}>University Event Discovery & Booking</Text>
      </View>

      {/* Hero Visual Card */}
      <View style={styles.heroCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroTag}>
            <Ionicons name="location" size={14} color={Colors.textInverse} />
            <Text style={styles.heroTagText}>University of Kelaniya</Text>
          </View>
          <Text style={styles.heroHeading}>Never Miss a Campus Beat</Text>
          <Text style={styles.heroSub}>
            From tech hackathons to acoustic nights — discover, book tickets, and manage university
            events with ease.
          </Text>
        </View>
      </View>

      {/* Feature Highlights Grid */}
      <View style={styles.highlightGrid}>
        <View style={styles.highlightItem}>
          <View style={[styles.highlightIcon, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="compass" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.highlightLabel}>Browse Events</Text>
        </View>

        <View style={styles.highlightItem}>
          <View style={[styles.highlightIcon, { backgroundColor: Colors.secondaryLight }]}>
            <Ionicons name="ticket" size={20} color={Colors.secondaryDark} />
          </View>
          <Text style={styles.highlightLabel}>Fast Booking</Text>
        </View>

        <View style={styles.highlightItem}>
          <View style={[styles.highlightIcon, { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.warning} />
          </View>
          <Text style={styles.highlightLabel}>Instant Passes</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <AppButton
          title="Get Started"
          size="lg"
          onPress={() => router.push('/(auth)/register')}
          style={styles.actionBtn}
        />
        <AppButton
          title="Sign In to Existing Account"
          variant="outline"
          size="md"
          onPress={() => router.push('/(auth)/login')}
          style={styles.actionBtn}
        />
        <AppButton
          title="Explore Events Directly"
          variant="ghost"
          size="sm"
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  brandTitle: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  heroOverlay: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  heroTagText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  heroHeading: {
    ...Typography.h3,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  heroSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  highlightGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  highlightItem: {
    alignItems: 'center',
    width: (width - Spacing.lg * 2 - Spacing.md * 2) / 3,
  },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  highlightLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionSection: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
