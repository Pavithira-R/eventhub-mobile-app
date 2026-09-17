import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <AppCard style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>Pavithira R.</Text>
        <Text style={styles.userEmail}>student@kln.ac.lk</Text>
        <View style={styles.badgeRow}>
          <StatusBadge label="University of Kelaniya" status="info" />
          <StatusBadge label="Organizer & Student" status="primary" />
        </View>
        <AppButton
          title="Edit Profile"
          variant="outline"
          size="sm"
          onPress={() => router.push('/profile/edit' as any)}
          style={styles.editBtn}
        />
      </AppCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Preferences</Text>
        <AppCard style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>Support & Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
        </AppCard>
      </View>

      <AppButton
        title="Sign Out"
        variant="ghost"
        onPress={() => router.replace('/(auth)/welcome')}
        style={styles.signOutBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  userName: {
    ...Typography.h2,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  editBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingText: {
    ...Typography.body,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  signOutBtn: {
    marginTop: Spacing.sm,
  },
});
