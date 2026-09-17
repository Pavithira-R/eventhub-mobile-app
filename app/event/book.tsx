import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { EventService } from '../../src/services/eventService';
import { BookingService } from '../../src/services/bookingService';
import { ProfileService } from '../../src/services/profileService';
import { EventItem } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [errors, setErrors] = useState<{ userName?: string; userEmail?: string }>({});

  useEffect(() => {
    async function loadData() {
      const [userProfile, evt] = await Promise.all([
        ProfileService.getProfile(),
        id ? EventService.getEventById(id) : EventService.getEvents().then((evts) => evts[0]),
      ]);

      if (userProfile) {
        setUserName(userProfile.name);
        setUserEmail(userProfile.email);
        setUserPhone(userProfile.phone);
      }

      setEvent(evt);
      setLoading(false);
    }
    loadData();
  }, [id]);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!userName.trim()) {
      nextErrors.userName = 'Attendee name is required.';
    }

    if (!userEmail.trim()) {
      nextErrors.userEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(userEmail.trim())) {
      nextErrors.userEmail = 'Please enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validate() || !event) return;

    setSubmitting(true);

    try {
      const unitPrice = event.price;
      const totalAmount = unitPrice * ticketCount;

      const newBooking = await BookingService.createBooking({
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        eventLocation: event.location,
        eventDate: event.date,
        eventTime: event.time,
        eventImage: event.image,
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: userPhone,
        ticketsCount: ticketCount,
        totalAmount: totalAmount,
      });

      setSubmitting(false);

      // Navigate to Confirmation screen with booking parameters
      router.replace({
        pathname: '/event/confirmation',
        params: {
          bookingRef: newBooking.bookingRef,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          location: event.location,
          ticketsCount: ticketCount.toString(),
          totalAmount: totalAmount === 0 ? 'FREE' : `Rs. ${totalAmount}`,
        },
      });
    } catch {
      setSubmitting(false);
      Alert.alert('Booking Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  if (loading || !event) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  const unitPrice = event.price;
  const totalPrice = unitPrice * ticketCount;

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Selected Event Card Summary */}
      <AppCard style={styles.eventSummaryCard}>
        <View style={styles.badgeRow}>
          <StatusBadge label={event.category} status="primary" />
          <Text style={styles.unitPriceText}>
            {unitPrice === 0 ? 'Free Entry' : `Rs. ${unitPrice} / ticket`}
          </Text>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
          <Text style={styles.metaText}>
            {event.date} • {event.time}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={15} color={Colors.secondaryDark} />
          <Text style={styles.metaText}>{event.location}</Text>
        </View>
      </AppCard>

      {/* Ticket Quantity Selector */}
      <AppCard style={styles.sectionCard}>
        <Text style={styles.cardHeader}>Select Ticket Quantity</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={[styles.counterBtn, ticketCount <= 1 && styles.counterBtnDisabled]}
            disabled={ticketCount <= 1}
            onPress={() => setTicketCount((prev) => Math.max(1, prev - 1))}
          >
            <Ionicons name="remove" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{ticketCount}</Text>
            <Text style={styles.countLabel}>Seats</Text>
          </View>

          <TouchableOpacity
            style={[styles.counterBtn, ticketCount >= 5 && styles.counterBtnDisabled]}
            disabled={ticketCount >= 5}
            onPress={() => setTicketCount((prev) => Math.min(5, prev + 1))}
          >
            <Ionicons name="add" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.limitText}>Maximum 5 seats per reservation for campus events</Text>
      </AppCard>

      {/* Attendee Form */}
      <AppCard style={styles.sectionCard}>
        <Text style={styles.cardHeader}>Attendee Contact Details</Text>

        <AppInput
          label="Full Name"
          placeholder="Enter attendee full name"
          icon="person-outline"
          value={userName}
          onChangeText={(val) => {
            setUserName(val);
            if (errors.userName) setErrors((e) => ({ ...e, userName: undefined }));
          }}
          error={errors.userName}
        />

        <AppInput
          label="Email Address"
          placeholder="student@kln.ac.lk"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={userEmail}
          onChangeText={(val) => {
            setUserEmail(val);
            if (errors.userEmail) setErrors((e) => ({ ...e, userEmail: undefined }));
          }}
          error={errors.userEmail}
        />

        <AppInput
          label="Phone Number (Optional)"
          placeholder="+94 77 123 4567"
          icon="call-outline"
          keyboardType="phone-pad"
          value={userPhone}
          onChangeText={setUserPhone}
        />
      </AppCard>

      {/* Price Summary */}
      <AppCard style={styles.sectionCard}>
        <Text style={styles.cardHeader}>Price Breakdown</Text>
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>
            Ticket ({ticketCount} x {unitPrice === 0 ? 'FREE' : `Rs. ${unitPrice}`})
          </Text>
          <Text style={styles.summaryVal}>
            {totalPrice === 0 ? 'FREE' : `Rs. ${totalPrice}`}
          </Text>
        </View>
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>Campus Service Fee</Text>
          <Text style={styles.summaryVal}>Rs. 0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryLine}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalVal}>
            {totalPrice === 0 ? 'FREE' : `Rs. ${totalPrice}`}
          </Text>
        </View>
      </AppCard>

      {/* Confirm Button */}
      <AppButton
        title="Confirm & Book Tickets"
        size="lg"
        icon={<Ionicons name="checkmark-circle-outline" size={20} color={Colors.textInverse} />}
        onPress={handleConfirmBooking}
        loading={submitting}
        style={styles.confirmBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  eventSummaryCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  unitPriceText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
  },
  eventTitle: {
    ...Typography.h2,
    fontSize: 20,
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
  sectionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.3,
  },
  countBadge: {
    alignItems: 'center',
    minWidth: 60,
  },
  countNumber: {
    ...Typography.h1,
    color: Colors.primary,
  },
  countLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  limitText: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
    color: Colors.textMuted,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryVal: {
    ...Typography.body,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    ...Typography.h3,
    fontSize: 16,
  },
  totalVal: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.primary,
  },
  confirmBtn: {
    marginTop: Spacing.xs,
  },
});
