import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function OrganizerTabScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Organizer Control Center</Text>
        <Text style={styles.subtitle}>Manage campus events, ticket sales, and attendees</Text>
      </View>

      <View style={styles.statsRow}>
        <AppCard style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Active Events</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={styles.statNumber}>185</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </AppCard>
      </View>

      <View style={styles.menuSection}>
        <AppButton
          title="Open Full Organizer Dashboard"
          onPress={() => router.push('/organizer' as any)}
          style={styles.mainAction}
        />

        <AppCard
          style={styles.menuCard}
          onPress={() => router.push('/organizer/add-event' as any)}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconCircle, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="add" size={22} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.menuTitle}>Create New Event</Text>
              <Text style={styles.menuDesc}>Publish a new campus or society event</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </AppCard>

        <AppCard
          style={styles.menuCard}
          onPress={() => router.push('/organizer/events' as any)}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconCircle, { backgroundColor: Colors.secondaryLight }]}>
              <Ionicons name="list" size={22} color={Colors.secondaryDark} />
            </View>
            <View>
              <Text style={styles.menuTitle}>Manage My Events</Text>
              <Text style={styles.menuDesc}>Edit details, check statuses, view attendees</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </AppCard>

        <AppCard
          style={styles.menuCard}
          onPress={() => router.push('/organizer/event-bookings' as any)}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconCircle, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="people" size={22} color={Colors.warning} />
            </View>
            <View>
              <Text style={styles.menuTitle}>Attendee & Booking Lists</Text>
              <Text style={styles.menuDesc}>Track attendee registrations and tickets</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  subtitle: {
    ...Typography.subtitle,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statNumber: {
    ...Typography.h1,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    marginTop: 4,
  },
  mainAction: {
    marginBottom: Spacing.md,
  },
  menuSection: {
    gap: Spacing.sm,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  menuDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
