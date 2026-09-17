import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../constants/Theme';

interface FeaturedEventCardProps {
  event: EventItem;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.82, 320);

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, { width: CARD_WIDTH }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeRow}>
          <StatusBadge label="Featured" status="warning" />
          <StatusBadge label={event.category} status="primary" />
        </View>
        <View style={styles.priceTag}>
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
          <Ionicons name="calendar" size={14} color={Colors.primary} />
          <Text style={styles.metaText}>{event.date}</Text>
          <Text style={styles.dot}>•</Text>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{event.time}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={14} color={Colors.secondaryDark} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginRight: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  priceTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary,
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
    fontSize: 15,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  dot: {
    color: Colors.textMuted,
    marginHorizontal: 2,
  },
});
