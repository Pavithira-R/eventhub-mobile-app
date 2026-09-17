import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

const MOCK_BOOKINGS = [
  {
    id: 'BK-9801',
    eventId: 'evt-101',
    eventTitle: 'University Hackathon 2026',
    date: 'Oct 25, 2026',
    time: '09:00 AM',
    location: 'Main Auditorium, UoK',
    tickets: 1,
    status: 'confirmed' as const,
    total: 'FREE',
  },
  {
    id: 'BK-9802',
    eventId: 'evt-103',
    eventTitle: 'Mobile App Development Masterclass',
    date: 'Nov 20, 2026',
    time: '02:00 PM',
    location: 'IT Lab 03',
    tickets: 2,
    status: 'pending' as const,
    total: 'Rs. 500',
  },
];

export default function MyBookingsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Registered Events</Text>
        <Text style={styles.subtitle}>Review your upcoming tickets & booking history</Text>
      </View>

      {MOCK_BOOKINGS.map((booking) => (
        <AppCard key={booking.id} style={styles.bookingCard}>
          <View style={styles.cardTop}>
            <Text style={styles.bookingId}>Booking #{booking.id}</Text>
            <StatusBadge
              label={booking.status}
              status={booking.status === 'confirmed' ? 'success' : 'warning'}
            />
          </View>

          <Text style={styles.eventTitle}>{booking.eventTitle}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{booking.date} • {booking.time}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{booking.location}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="ticket-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{booking.tickets} Ticket(s) • Total: {booking.total}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton
              title="View Confirmation"
              variant="outline"
              size="sm"
              onPress={() => router.push('/event/confirmation' as any)}
              style={styles.actionBtn}
            />
            <AppButton
              title="Event Details"
              variant="ghost"
              size="sm"
              onPress={() => router.push(`/event/${booking.eventId}` as any)}
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
  bookingCard: {
    marginBottom: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bookingId: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  eventTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  actions: {
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
