import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Placeholder static event detail
  const event = {
    id: id || 'evt-101',
    title: 'University Hackathon 2026',
    category: 'Tech & Innovation',
    date: 'Saturday, October 25, 2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Main Auditorium, University of Kelaniya',
    price: 0,
    availableSeats: 45,
    totalSeats: 100,
    organizer: 'Computer Science Students Society (CSSS)',
    description:
      'Join us for the premier annual hackathon at University of Kelaniya! Team up with fellow developers, build cutting-edge solutions, and win exciting prizes. Mentorship, refreshments, and certificates will be provided.',
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Banner Card */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerPlaceholder}>
          <Ionicons name="image-outline" size={48} color={Colors.primary} />
          <Text style={styles.bannerText}>Event Banner</Text>
        </View>
      </View>

      <View style={styles.headerBlock}>
        <StatusBadge label={event.category} status="primary" />
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.organizer}>Organized by {event.organizer}</Text>
      </View>

      {/* Quick Details Cards */}
      <AppCard style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{event.date}</Text>
            <Text style={styles.detailSubValue}>{event.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="location" size={20} color={Colors.secondaryDark} />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="people" size={20} color={Colors.accent} />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Availability</Text>
            <Text style={styles.detailValue}>
              {event.availableSeats} of {event.totalSeats} seats remaining
            </Text>
          </View>
        </View>
      </AppCard>

      {/* Description */}
      <AppCard style={styles.descCard}>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.descText}>{event.description}</Text>
      </AppCard>

      {/* Bottom Booking Bar */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>
            {event.price === 0 ? 'FREE' : `Rs. ${event.price}`}
          </Text>
        </View>
        <AppButton
          title="Book Now"
          onPress={() => router.push(`/event/book?id=${event.id}` as any)}
          style={styles.bookButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  bannerContainer: {
    marginBottom: Spacing.md,
  },
  bannerPlaceholder: {
    height: 180,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
  headerBlock: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    marginTop: Spacing.xs,
  },
  organizer: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
  },
  detailsCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  detailValue: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
  detailSubValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.sm,
  },
  descCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  descText: {
    ...Typography.body,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginTop: Spacing.sm,
  },
  priceLabel: {
    ...Typography.caption,
  },
  priceValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  bookButton: {
    paddingHorizontal: Spacing.xl,
  },
});
