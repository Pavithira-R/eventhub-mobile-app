import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingRef?: string;
    eventTitle?: string;
    eventDate?: string;
    eventTime?: string;
    location?: string;
    ticketsCount?: string;
    totalAmount?: string;
  }>();

  const bookingRef = params.bookingRef || 'EH-BK-9182';
  const eventTitle = params.eventTitle || 'University Hackathon & CodeFest 2026';
  const eventDate = params.eventDate || 'Oct 25, 2026';
  const eventTime = params.eventTime || '09:00 AM';
  const location = params.location || 'Main Auditorium, University of Kelaniya';
  const ticketsCount = params.ticketsCount || '2';
  const totalAmount = params.totalAmount || 'FREE';

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Success Badge */}
      <View style={styles.successWrapper}>
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-sharp" size={42} color={Colors.textInverse} />
        </View>
        <Text style={styles.title}>Booking Confirmed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your seats are reserved. A digital pass has been added to your My Bookings list.
        </Text>
      </View>

      {/* Ticket Pass Presentation Card */}
      <AppCard style={styles.ticketPassCard}>
        <View style={styles.passHeader}>
          <View style={styles.refRow}>
            <Text style={styles.passType}>CAMPUS ADMISSION PASS</Text>
            <View style={styles.refBadge}>
              <Text style={styles.refCode}>{bookingRef}</Text>
            </View>
          </View>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
        </View>

        {/* Perforated Divider */}
        <View style={styles.perforatedLine}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedDivider} />
          <View style={styles.notchRight} />
        </View>

        <View style={styles.passBody}>
          <View style={styles.infoGrid}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.val}>{eventDate}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.val}>{eventTime}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Reserved Seats</Text>
              <Text style={styles.val}>{ticketsCount} Pass(es)</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Amount Paid</Text>
              <Text style={[styles.val, { color: Colors.primary }]}>{totalAmount}</Text>
            </View>
          </View>

          <View style={styles.locationBlock}>
            <Ionicons name="location" size={16} color={Colors.secondaryDark} />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code-outline" size={64} color={Colors.textPrimary} />
            <Text style={styles.qrNotice}>Present this pass at venue entrance for check-in</Text>
          </View>
        </View>
      </AppCard>

      {/* Action Buttons */}
      <View style={styles.actionGroup}>
        <AppButton
          title="View in My Bookings"
          size="lg"
          icon={<Ionicons name="ticket-outline" size={20} color={Colors.textInverse} />}
          onPress={() => router.replace('/(tabs)/my-bookings')}
          style={styles.actionBtn}
        />
        <AppButton
          title="Explore More Events"
          variant="outline"
          size="md"
          icon={<Ionicons name="compass-outline" size={20} color={Colors.primary} />}
          onPress={() => router.replace('/(tabs)')}
          style={styles.actionBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  successWrapper: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 26,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  ticketPassCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 0,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  passHeader: {
    padding: Spacing.md,
    backgroundColor: Colors.primaryLight,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  passType: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  refBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  refCode: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  eventTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  perforatedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 20,
    backgroundColor: Colors.surface,
  },
  notchLeft: {
    width: 14,
    height: 20,
    backgroundColor: Colors.background,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  dashedDivider: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  notchRight: {
    width: 14,
    height: 20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  passBody: {
    padding: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  gridCol: {
    width: '45%',
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  val: {
    ...Typography.body,
    fontWeight: '700',
    marginTop: 2,
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    marginBottom: Spacing.md,
  },
  locationText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  qrNotice: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  actionGroup: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
