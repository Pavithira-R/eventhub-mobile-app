import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../constants/Theme';

interface EventCardProps {
  event: EventItem;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeOverlay}>
          <StatusBadge label={event.category} status="primary" />
        </View>
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            {event.price === 0 ? 'FREE' : `Rs. ${event.price}`}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
          <Text style={styles.metaText}>
            {event.date} • {event.time}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={Colors.secondaryDark} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.seatsRow}>
            <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.seatsText}>
              {event.availableSeats} / {event.totalSeats} seats left
            </Text>
          </View>
          <View style={styles.arrowRow}>
            <Text style={styles.detailsLabel}>Details</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  priceOverlay: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priceText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h3,
    fontSize: 16,
    lineHeight: 22,
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
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatsText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsLabel: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
