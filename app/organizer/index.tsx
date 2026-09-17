import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function OrganizerDashboardScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Organizer Dashboard</Text>
        <Text style={styles.subtitle}>Overview of your societies and event management</Text>
      </View>

      {/* Metric Cards */}
      <View style={styles.metricsGrid}>
        <AppCard style={styles.metricCard}>
          <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
          <Text style={styles.metricValue}>3</Text>
          <Text style={styles.metricLabel}>Live Events</Text>
        </AppCard>

        <AppCard style={styles.metricCard}>
          <Ionicons name="ticket-outline" size={24} color={Colors.secondary} />
          <Text style={styles.metricValue}>245</Text>
          <Text style={styles.metricLabel}>Total Tickets</Text>
        </AppCard>

        <AppCard style={styles.metricCard}>
          <Ionicons name="cash-outline" size={24} color={Colors.accent} />
          <Text style={styles.metricValue}>Rs. 12.5k</Text>
          <Text style={styles.metricLabel}>Revenue</Text>
        </AppCard>

        <AppCard style={styles.metricCard}>
          <Ionicons name="people-outline" size={24} color={Colors.success} />
          <Text style={styles.metricValue}>94%</Text>
          <Text style={styles.metricLabel}>Turnout Rate</Text>
        </AppCard>
      </View>

      {/* Quick Action Button */}
      <AppButton
        title="+ Create New Event"
        onPress={() => router.push('/organizer/add-event')}
        style={styles.createBtn}
      />

      {/* Section Links */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Management Modules</Text>
      </View>

      <AppCard
        style={styles.navCard}
        onPress={() => router.push('/organizer/events')}
      >
        <View style={styles.navCardLeft}>
          <View style={[styles.navIconBox, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="list-circle-outline" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.navCardTitle}>My Events</Text>
            <Text style={styles.navCardSub}>View, edit, or publish scheduled events</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </AppCard>

      <AppCard
        style={styles.navCard}
        onPress={() => router.push('/organizer/event-bookings')}
      >
        <View style={styles.navCardLeft}>
          <View style={[styles.navIconBox, { backgroundColor: Colors.secondaryLight }]}>
            <Ionicons name="people-circle-outline" size={24} color={Colors.secondaryDark} />
          </View>
          <View>
            <Text style={styles.navCardTitle}>Event Bookings</Text>
            <Text style={styles.navCardSub}>Inspect attendee lists & check-ins</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </AppCard>
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  metricValue: {
    ...Typography.h2,
    marginTop: Spacing.xs,
  },
  metricLabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  createBtn: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  navCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCardTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  navCardSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
