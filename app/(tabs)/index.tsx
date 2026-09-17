import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

const CATEGORIES = ['All', 'Academic', 'Tech', 'Cultural', 'Sports', 'Workshops'];

const MOCK_EVENTS = [
  {
    id: 'evt-101',
    title: 'University Hackathon 2026',
    category: 'Tech',
    date: 'Oct 25, 2026',
    time: '09:00 AM',
    location: 'Main Auditorium, UoK',
    price: 0,
    availableSeats: 45,
    organizer: 'Computer Science Society',
  },
  {
    id: 'evt-102',
    title: 'Annual Cultural Fiesta & Musical Eve',
    category: 'Cultural',
    date: 'Nov 12, 2026',
    time: '06:00 PM',
    location: 'Open Air Grounds',
    price: 500,
    availableSeats: 120,
    organizer: 'Arts & Cultural Council',
  },
  {
    id: 'evt-103',
    title: 'Mobile App Development Masterclass',
    category: 'Academic',
    date: 'Nov 20, 2026',
    time: '02:00 PM',
    location: 'IT Lab 03',
    price: 250,
    availableSeats: 20,
    organizer: 'IEEE Student Branch',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search campus events..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured / Upcoming Events */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <Text style={styles.sectionSubtitle}>Tap any event to view details & book</Text>
      </View>

      {MOCK_EVENTS.map((event) => (
        <AppCard
          key={event.id}
          style={styles.eventCard}
          onPress={() => router.push(`/event/${event.id}` as any)}
        >
          <View style={styles.cardHeader}>
            <StatusBadge label={event.category} status="primary" />
            <Text style={styles.priceTag}>
              {event.price === 0 ? 'FREE' : `Rs. ${event.price}`}
            </Text>
          </View>

          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {event.date} • {event.time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.organizerText}>By {event.organizer}</Text>
            <View style={styles.viewDetailsRow}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </View>
          </View>
        </AppCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
  },
  categoriesScroll: {
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.textInverse,
  },
  sectionHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  eventCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  priceTag: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.primary,
  },
  eventTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  organizerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
});
