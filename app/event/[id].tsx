import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { EmptyState } from '../../src/components/common/EmptyState';
import { EventService } from '../../src/services/eventService';
import { EventItem } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      if (id) {
        const found = await EventService.getEventById(id);
        setEvent(found);
      }
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  if (!event) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="alert-circle-outline"
          title="Event Not Found"
          description="The event you are trying to view does not exist or has been removed."
          actionTitle="Back to Explore"
          onAction={() => router.replace('/(tabs)')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Large Hero Image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: event.image }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <StatusBadge label={event.category} status="primary" />
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>
            {event.price === 0 ? 'FREE ADMISSION' : `Rs. ${event.price}`}
          </Text>
        </View>
      </View>

      {/* Main Event Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.organizerRow}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
          <Text style={styles.organizerText}>Organized by {event.organizerName}</Text>
        </View>
      </View>

      {/* Event Details Key Info Cards */}
      <AppCard style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={[styles.infoIconBox, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>{event.date}</Text>
            <Text style={styles.infoSub}>{event.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={[styles.infoIconBox, { backgroundColor: Colors.secondaryLight }]}>
            <Ionicons name="location" size={20} color={Colors.secondaryDark} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Location / Venue</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={[styles.infoIconBox, { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="people" size={20} color={Colors.warning} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Seat Availability</Text>
            <Text style={styles.infoValue}>
              {event.availableSeats} of {event.totalSeats} seats remaining
            </Text>
          </View>
        </View>
      </AppCard>

      {/* Event Description Section */}
      <AppCard style={styles.descCard}>
        <Text style={styles.descTitle}>About the Event</Text>
        <Text style={styles.descBody}>{event.description}</Text>
      </AppCard>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPriceLabel}>Ticket Price</Text>
          <Text style={styles.bottomPriceValue}>
            {event.price === 0 ? 'FREE' : `Rs. ${event.price}`}
          </Text>
        </View>
        <AppButton
          title="Book Now"
          size="lg"
          icon={<Ionicons name="ticket-outline" size={20} color={Colors.textInverse} />}
          onPress={() => router.push(`/event/book?id=${event.id}` as any)}
          style={styles.bookBtn}
        />
      </View>
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
  imageWrapper: {
    height: 220,
    width: '100%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSubtle,
    position: 'relative',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
  },
  priceTag: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  priceTagText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  headerBlock: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 6,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  organizerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.sm,
  },
  descCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  descTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  descBody: {
    ...Typography.body,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  priceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    ...Typography.caption,
  },
  bottomPriceValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  bookBtn: {
    minWidth: 150,
  },
});
