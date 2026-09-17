import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { EmptyState } from '../../src/components/common/EmptyState';
import { BookingService } from '../../src/services/bookingService';
import { BookingItem } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [upcomingList, setUpcomingList] = useState<BookingItem[]>([]);
  const [previousList, setPreviousList] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    const [upcoming, prev] = await Promise.all([
      BookingService.getUpcomingBookings(),
      BookingService.getPreviousBookings(),
    ]);
    setUpcomingList(upcoming);
    setPreviousList(prev);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = (booking: BookingItem) => {
    Alert.alert(
      'Cancel Booking Reservation?',
      `Are you sure you want to cancel your pass for "${booking.eventTitle}" (${booking.bookingRef})? This seat will be released.`,
      [
        { text: 'Keep Ticket', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            await BookingService.cancelBooking(booking.id);
            Alert.alert('Booking Cancelled', 'Your reservation has been cancelled.');
            loadBookings();
          },
        },
      ]
    );
  };

  const displayedList = activeTab === 'upcoming' ? upcomingList : previousList;

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Track your registered tickets and campus event passes</Text>
      </View>

      {/* Segmented Tab Selector */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'upcoming' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Ionicons
            name="calendar"
            size={16}
            color={activeTab === 'upcoming' ? Colors.primary : Colors.textSecondary}
          />
          <Text
            style={[
              styles.segmentText,
              activeTab === 'upcoming' && styles.segmentTextActive,
            ]}
          >
            Upcoming ({upcomingList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'previous' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('previous')}
        >
          <Ionicons
            name="checkmark-done"
            size={16}
            color={activeTab === 'previous' ? Colors.primary : Colors.textSecondary}
          />
          <Text
            style={[
              styles.segmentText,
              activeTab === 'previous' && styles.segmentTextActive,
            ]}
          >
            Previous ({previousList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={activeTab === 'upcoming' ? 'ticket-outline' : 'time-outline'}
          title={activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming event passes. Explore campus events and book your seat now!"
              : "You haven't attended or completed any events yet."
          }
          actionTitle={activeTab === 'upcoming' ? 'Explore Events' : undefined}
          onAction={activeTab === 'upcoming' ? () => router.push('/(tabs)') : undefined}
        />
      ) : (
        displayedList.map((booking) => {
          const isCancelled = booking.status === 'cancelled';
          const isConfirmed = booking.status === 'confirmed';

          return (
            <AppCard key={booking.id} style={styles.bookingCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.refPill}>
                  <Text style={styles.refText}>{booking.bookingRef}</Text>
                </View>
                <StatusBadge
                  label={booking.status}
                  status={isConfirmed ? 'success' : isCancelled ? 'error' : 'neutral'}
                />
              </View>

              <Text style={styles.eventTitle}>{booking.eventTitle}</Text>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
                <Text style={styles.metaText}>
                  {booking.eventDate} {booking.eventTime ? `• ${booking.eventTime}` : ''}
                </Text>
              </View>

              {booking.eventLocation ? (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={15} color={Colors.secondaryDark} />
                  <Text style={styles.metaText}>{booking.eventLocation}</Text>
                </View>
              ) : null}

              <View style={styles.metaRow}>
                <Ionicons name="ticket-outline" size={15} color={Colors.accent} />
                <Text style={styles.metaText}>
                  {booking.ticketsCount} Ticket(s) • Total:{' '}
                  {booking.totalAmount === 0 ? 'FREE' : `Rs. ${booking.totalAmount}`}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                {isConfirmed && activeTab === 'upcoming' ? (
                  <>
                    <AppButton
                      title="View Pass"
                      size="sm"
                      variant="outline"
                      icon={<Ionicons name="qr-code-outline" size={14} color={Colors.primary} />}
                      onPress={() =>
                        router.push({
                          pathname: '/event/confirmation',
                          params: {
                            bookingRef: booking.bookingRef,
                            eventTitle: booking.eventTitle,
                            eventDate: booking.eventDate,
                            eventTime: booking.eventTime || '09:00 AM',
                            location: booking.eventLocation || 'University Campus',
                            ticketsCount: booking.ticketsCount.toString(),
                            totalAmount:
                              booking.totalAmount === 0 ? 'FREE' : `Rs. ${booking.totalAmount}`,
                          },
                        })
                      }
                      style={styles.actionBtn}
                    />
                    <AppButton
                      title="Cancel"
                      size="sm"
                      variant="danger"
                      onPress={() => handleCancelBooking(booking)}
                      style={styles.cancelBtn}
                    />
                  </>
                ) : (
                  <AppButton
                    title="View Event Details"
                    size="sm"
                    variant="ghost"
                    onPress={() => router.push(`/event/${booking.eventId}` as any)}
                    style={styles.actionBtn}
                  />
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  segmentBtnActive: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  segmentText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  bookingCard: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  refPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  refText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  eventTitle: {
    ...Typography.h3,
    fontSize: 17,
    marginTop: 4,
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
  cardActions: {
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
  cancelBtn: {
    minWidth: 80,
  },
});
