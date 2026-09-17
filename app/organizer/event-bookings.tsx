import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { BookingService } from '../../src/services/bookingService';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

interface AttendeeRow {
  bookingRef: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  status: 'confirmed' | 'cancelled';
  checkedIn: boolean;
  registeredAt: string;
}

export default function EventBookingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [attendees, setAttendees] = useState<AttendeeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendees = async () => {
    setLoading(true);
    const data = await BookingService.getEventAttendees();
    setAttendees(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAttendees();
  }, [id]);

  const toggleCheckIn = (index: number) => {
    const target = attendees[index];
    if (target.status === 'cancelled') {
      Alert.alert('Cannot Check-in', 'This reservation was cancelled by the attendee.');
      return;
    }

    const updated = [...attendees];
    updated[index] = {
      ...target,
      checkedIn: !target.checkedIn,
    };
    setAttendees(updated);
  };

  const totalSeats = attendees.reduce((acc, curr) => acc + curr.tickets, 0);
  const checkedInSeats = attendees
    .filter((a) => a.checkedIn)
    .reduce((acc, curr) => acc + curr.tickets, 0);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendee & Booking List</Text>
        <Text style={styles.subtitle}>
          Event ID: {id || 'evt-101'} • Real-time attendee check-in
        </Text>
      </View>

      {/* Summary KPI Bar */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiNumber}>{attendees.length}</Text>
          <Text style={styles.kpiLabel}>Registrations</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={styles.kpiNumber}>{totalSeats}</Text>
          <Text style={styles.kpiLabel}>Total Seats</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiNumber, { color: Colors.success }]}>{checkedInSeats}</Text>
          <Text style={styles.kpiLabel}>Checked In</Text>
        </View>
      </View>

      <Text style={styles.listHeading}>Attendee Roster ({attendees.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        attendees.map((item, idx) => {
          const isCancelled = item.status === 'cancelled';

          return (
            <AppCard key={item.bookingRef} style={styles.attendeeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.nameBlock}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerEmail}>{item.email}</Text>
                </View>

                <StatusBadge
                  label={
                    isCancelled
                      ? 'Cancelled'
                      : item.checkedIn
                      ? 'Checked-In'
                      : 'Confirmed'
                  }
                  status={
                    isCancelled
                      ? 'error'
                      : item.checkedIn
                      ? 'success'
                      : 'primary'
                  }
                />
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="ticket-outline" size={14} color={Colors.primary} />
                  <Text style={styles.metaText}>{item.tickets} Seat(s)</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="pricetag-outline" size={14} color={Colors.secondaryDark} />
                  <Text style={styles.metaText}>{item.bookingRef}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{item.registeredAt}</Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.phoneBlock}>
                  <Ionicons name="call-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.phoneText}>{item.phone}</Text>
                </View>

                {!isCancelled ? (
                  <TouchableOpacity
                    style={[
                      styles.checkInBtn,
                      item.checkedIn && styles.checkInBtnActive,
                    ]}
                    onPress={() => toggleCheckIn(idx)}
                  >
                    <Ionicons
                      name={item.checkedIn ? 'checkmark-circle' : 'radio-button-off'}
                      size={16}
                      color={item.checkedIn ? Colors.success : Colors.primary}
                    />
                    <Text
                      style={[
                        styles.checkInText,
                        item.checkedIn && styles.checkInTextActive,
                      ]}
                    >
                      {item.checkedIn ? 'Checked In' : 'Check In'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.cancelledNotice}>Reservation Void</Text>
                )}
              </View>
            </AppCard>
          );
        })
      )}
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
  kpiContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
  },
  kpiNumber: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.primary,
  },
  kpiLabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  kpiDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  listHeading: {
    ...Typography.h3,
    fontSize: 17,
    marginBottom: Spacing.xs,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  attendeeCard: {
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  nameBlock: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  customerName: {
    ...Typography.body,
    fontWeight: '700',
  },
  customerEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  phoneBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  checkInBtnActive: {
    backgroundColor: Colors.successLight,
  },
  checkInText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkInTextActive: {
    color: Colors.success,
  },
  cancelledNotice: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
  },
});
