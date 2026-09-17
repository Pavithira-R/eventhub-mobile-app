import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

const MOCK_ATTENDEES = [
  {
    bookingId: 'BK-1001',
    name: 'Kasun Perera',
    email: 'kasun@stu.kln.ac.lk',
    seats: 1,
    checkedIn: true,
    bookingTime: 'Today, 10:30 AM',
  },
  {
    bookingId: 'BK-1002',
    name: 'Nimesha Fernando',
    email: 'nimesha@stu.kln.ac.lk',
    seats: 2,
    checkedIn: false,
    bookingTime: 'Yesterday, 04:15 PM',
  },
  {
    bookingId: 'BK-1003',
    name: 'Sachith Silva',
    email: 'sachith@stu.kln.ac.lk',
    seats: 1,
    checkedIn: false,
    bookingTime: 'Sep 15, 2026',
  },
];

export default function EventBookingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendee & Booking List</Text>
        <Text style={styles.subtitle}>Event ID: {id || 'evt-101'} • 55 Bookings Total</Text>
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>55</Text>
          <Text style={styles.summaryLabel}>Total Tickets</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>18</Text>
          <Text style={styles.summaryLabel}>Checked In</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>37</Text>
          <Text style={styles.summaryLabel}>Awaiting</Text>
        </View>
      </View>

      <Text style={styles.listHeader}>Recent Attendee Bookings</Text>

      {MOCK_ATTENDEES.map((item) => (
        <AppCard key={item.bookingId} style={styles.attendeeCard}>
          <View style={styles.cardHeader}>
            <View style={styles.nameSection}>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
            <StatusBadge
              label={item.checkedIn ? 'Checked In' : 'Registered'}
              status={item.checkedIn ? 'success' : 'info'}
            />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Ionicons name="ticket-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{item.seats} Ticket(s)</Text>
            </View>
            <View style={styles.metaCol}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{item.bookingTime}</Text>
            </View>
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
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  summaryLabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  listHeader: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  attendeeCard: {
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  nameSection: {
    flex: 1,
  },
  attendeeName: {
    ...Typography.body,
    fontWeight: '700',
  },
  attendeeEmail: {
    ...Typography.caption,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.caption,
  },
});
