import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function BookingConfirmationScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.successCircle}>
        <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
      </View>

      <Text style={styles.title}>Booking Confirmed! 🎉</Text>
      <Text style={styles.subtitle}>
        Your reservation has been recorded. A pass has been added to your account.
      </Text>

      <AppCard style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.eventTitle}>University Hackathon 2026</Text>
          <Text style={styles.ticketCode}>Pass #EH-889024</Text>
        </View>

        <View style={styles.dashedDivider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>Oct 25, 2026</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>09:00 AM</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Seats</Text>
            <Text style={styles.infoValue}>1 Pass</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: Colors.success }]}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.venueRow}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.venueText}>Main Auditorium, University of Kelaniya</Text>
        </View>
      </AppCard>

      <View style={styles.buttonGroup}>
        <AppButton
          title="View My Bookings"
          onPress={() => router.replace('/(tabs)/my-bookings')}
          style={styles.mainBtn}
        />
        <AppButton
          title="Back to Home"
          variant="outline"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  successCircle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  eventTitle: {
    ...Typography.h2,
    fontSize: 20,
    textAlign: 'center',
  },
  ticketCode: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  dashedDivider: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginVertical: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoCol: {
    width: '45%',
  },
  infoLabel: {
    ...Typography.caption,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  venueText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.sm,
  },
  mainBtn: {
    width: '100%',
  },
});
