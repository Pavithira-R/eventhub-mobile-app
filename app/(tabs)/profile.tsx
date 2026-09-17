import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { ProfileService } from '../../src/services/profileService';
import { UserProfile } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = async () => {
    const user = await ProfileService.getProfile();
    setProfile(user);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of EventHub?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => router.replace('/(auth)/welcome'),
      },
    ]);
  };

  if (!profile) return null;

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <AppCard style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} resizeMode="cover" />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
          </View>
        </View>

        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>

        <View style={styles.badgesRow}>
          <StatusBadge label="University Student" status="primary" />
          <StatusBadge label={profile.faculty || 'Kelaniya University'} status="info" />
        </View>

        {profile.bio ? <Text style={styles.bioText}>{profile.bio}</Text> : null}

        <AppButton
          title="Edit Profile"
          variant="outline"
          size="sm"
          icon={<Ionicons name="create-outline" size={16} color={Colors.primary} />}
          onPress={() => router.push('/profile/edit')}
          style={styles.editBtn}
        />
      </AppCard>

      {/* Account Info Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account Details</Text>
      </View>
      <AppCard style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoVal}>{profile.phone}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Ionicons name="school-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Institution</Text>
            <Text style={styles.infoVal}>University of Kelaniya, Sri Lanka</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={styles.infoVal}>Active & Verified Student</Text>
          </View>
        </View>
      </AppCard>

      {/* Organizer Mode Switch */}
      <AppCard
        style={styles.organizerCard}
        onPress={() => router.push('/organizer')}
      >
        <View style={styles.organizerLeft}>
          <View style={styles.organizerIconCircle}>
            <Ionicons name="briefcase" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.organizerTitle}>Organizer Studio</Text>
            <Text style={styles.organizerSubtitle}>Publish and manage campus events</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </AppCard>

      {/* Logout Button */}
      <AppButton
        title="Sign Out of EventHub"
        variant="ghost"
        icon={<Ionicons name="log-out-outline" size={18} color={Colors.error} />}
        textStyle={{ color: Colors.error }}
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userName: {
    ...Typography.h2,
    marginTop: Spacing.xs,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  bioText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
  },
  editBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  infoCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  infoVal: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.sm,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderColor: Colors.primaryLight,
    borderWidth: 1.5,
  },
  organizerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  organizerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  organizerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: Spacing.xs,
  },
});
