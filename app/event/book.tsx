import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 0; // Free for university event placeholder

  const handleConfirm = () => {
    // Phase 1 navigation placeholder
    router.replace('/event/confirmation' as any);
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Tickets</Text>
        <Text style={styles.subtitle}>University Hackathon 2026</Text>
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>Select Quantity</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setTicketCount((c) => Math.max(1, c - 1))}
          >
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.countText}>{ticketCount}</Text>

          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setTicketCount((c) => Math.min(5, c + 1))}
          >
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.limitNotice}>Maximum 5 tickets per attendee</Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Standard Admission ({ticketCount}x)</Text>
          <Text style={styles.summaryValue}>
            {ticketPrice === 0 ? 'FREE' : `Rs. ${ticketPrice * ticketCount}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Booking Fee</Text>
          <Text style={styles.summaryValue}>Rs. 0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {ticketPrice === 0 ? 'FREE' : `Rs. ${ticketPrice * ticketCount}`}
          </Text>
        </View>
      </AppCard>

      <AppButton
        title="Confirm & Generate Ticket"
        onPress={handleConfirm}
        style={styles.confirmButton}
      />
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
  card: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    ...Typography.h1,
    color: Colors.primary,
  },
  limitNotice: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
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
  },
  totalValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
  confirmButton: {
    marginTop: Spacing.md,
  },
});
