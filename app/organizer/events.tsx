import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

const ORGANIZER_EVENTS = [
  {
    id: 'evt-101',
    title: 'University Hackathon 2026',
    date: 'Oct 25, 2026',
    status: 'Published',
    bookings: 55,
    capacity: 100,
  },
  {
    id: 'evt-103',
    title: 'Mobile App Development Masterclass',
    date: 'Nov 20, 2026',
    status: 'Draft',
    bookings: 0,
    capacity: 50,
  },
];

export default function MyEventsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>My Hosted Events</Text>
          <Text style={styles.subtitle}>Manage listings and edit event parameters</Text>
        </View>
        <AppButton
          title="+ Add"
          size="sm"
          onPress={() => router.push('/organizer/add-event')}
        />
      </View>

      {ORGANIZER_EVENTS.map((event) => (
        <AppCard key={event.id} style={styles.eventCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <StatusBadge
              label={event.status}
              status={event.status === 'Published' ? 'success' : 'neutral'}
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {event.bookings} / {event.capacity} Registered Attendees
            </Text>
          </View>

          <View style={styles.actionRow}>
            <AppButton
              title="Edit Event"
              variant="outline"
              size="sm"
              onPress={() => router.push(`/organizer/edit-event?id=${event.id}` as any)}
              style={styles.actionBtn}
            />
            <AppButton
              title="View Bookings"
              variant="secondary"
              size="sm"
              onPress={() => router.push(`/organizer/event-bookings?id=${event.id}` as any)}
              style={styles.actionBtn}
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  eventCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    ...Typography.h3,
    flex: 1,
    marginRight: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  actionBtn: {
    flex: 1,
  },
});
