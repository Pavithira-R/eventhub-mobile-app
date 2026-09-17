import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { EventService } from '../../src/services/eventService';
import { BookingService } from '../../src/services/bookingService';
import { EventItem, OrganizerStats } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function OrganizerDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function loadOrganizerData() {
      const [metrics, events] = await Promise.all([
        BookingService.getOrganizerStats(),
        EventService.getOrganizerEvents(),
      ]);
      setStats(metrics);
      setRecentEvents(events.slice(0, 3));
    }
    loadOrganizerData();
  }, []);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Organizer Dashboard</Text>
        <Text style={styles.subtitle}>Manage campus society events and attendee records</Text>
      </View>

      {/* KPI Stats Grid */}
      <View style={styles.statsGrid}>
        <AppCard style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="calendar" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.statVal}>{stats?.totalEvents ?? 6}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: Colors.secondaryLight }]}>
            <Ionicons name="ticket" size={22} color={Colors.secondaryDark} />
          </View>
          <Text style={styles.statVal}>{stats?.totalBookings ?? 184}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="cash" size={22} color={Colors.warning} />
          </View>
          <Text style={styles.statVal}>Rs. 24.5k</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: Colors.successLight }]}>
            <Ionicons name="people" size={22} color={Colors.success} />
          </View>
          <Text style={styles.statVal}>92%</Text>
          <Text style={styles.statLabel}>Capacity Avg</Text>
        </AppCard>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionRow}>
        <AppButton
          title="+ Add Event"
          size="md"
          icon={<Ionicons name="add-circle-outline" size={18} color={Colors.textInverse} />}
          onPress={() => router.push('/organizer/add-event')}
          style={styles.actionBtn}
        />
        <AppButton
          title="My Events"
          variant="outline"
          size="md"
          icon={<Ionicons name="list-outline" size={18} color={Colors.primary} />}
          onPress={() => router.push('/organizer/events')}
          style={styles.actionBtn}
        />
      </View>

      {/* Upcoming Hosted Events */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Upcoming Managed Events</Text>
        <AppButton
          title="View All"
          variant="ghost"
          size="sm"
          onPress={() => router.push('/organizer/events')}
        />
      </View>

      {recentEvents.map((event) => (
        <AppCard key={event.id} style={styles.eventItemCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <StatusBadge label={event.category} status="primary" />
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{event.date}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {event.totalSeats - event.availableSeats} Bookings
            </Text>
          </View>

          <View style={styles.cardActions}>
            <AppButton
              title="Edit"
              variant="outline"
              size="sm"
              onPress={() => router.push(`/organizer/edit-event?id=${event.id}` as any)}
              style={styles.cardBtn}
            />
            <AppButton
              title="Attendee Roster"
              variant="secondary"
              size="sm"
              onPress={() => router.push(`/organizer/event-bookings?id=${event.id}` as any)}
              style={styles.cardBtn}
            />
          </View>
        </AppCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statVal: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionHeading: {
    ...Typography.h3,
    fontSize: 17,
  },
  eventItemCard: {
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    ...Typography.h3,
    fontSize: 15,
    flex: 1,
    marginRight: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  dot: {
    color: Colors.textMuted,
    marginHorizontal: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  cardBtn: {
    flex: 1,
  },
});
