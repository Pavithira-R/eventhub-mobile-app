import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { useAuth } from '../../src/context/AuthContext';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isOrganizer, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of EventHub?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.notLoggedInText}>No active user session.</Text>
        <AppButton
          title="Sign In"
          onPress={() => router.replace('/(auth)/welcome')}
          style={styles.signInBtn}
        />
      </ScreenContainer>
    );
  }

  const roleLabel = isOrganizer ? 'Event Organizer' : 'University Student';

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <AppCard style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
          </View>
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        <View style={styles.badgesRow}>
          <StatusBadge
            label={roleLabel}
            status={isOrganizer ? 'warning' : 'primary'}
          />
          <StatusBadge
            label={user.faculty || 'University of Kelaniya'}
            status="info"
          />
        </View>

        {user.bio ? <Text style={styles.bioText}>{user.bio}</Text> : null}

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
          <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Account Role</Text>
            <Text style={styles.infoVal}>
              {isOrganizer ? 'Organizer (Event Management Access)' : 'Student / Attendee'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoVal}>{user.phone || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Ionicons name="school-outline" size={18} color={Colors.textSecondary} />
          <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>Affiliation</Text>
            <Text style={styles.infoVal}>{user.faculty || 'University of Kelaniya, Sri Lanka'}</Text>
          </View>
        </View>
      </AppCard>

      {/* Organizer Mode Portal (Visible for organizers) */}
      {isOrganizer ? (
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
      ) : null}

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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notLoggedInText: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  signInBtn: {
    minWidth: 150,
  },
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
