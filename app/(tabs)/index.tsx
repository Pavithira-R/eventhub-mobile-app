import React, { useState, useEffect } from 'react';
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
import { EventCard } from '../../src/components/events/EventCard';
import { FeaturedEventCard } from '../../src/components/events/FeaturedEventCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { EventService } from '../../src/services/eventService';
import { useAuth } from '../../src/context/AuthContext';
import { EventItem, EventCategory } from '../../src/types';
import { CATEGORIES } from '../../src/data/mockData';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [allEvts, featEvts] = await Promise.all([
      EventService.getEvents(searchQuery, selectedCategory),
      EventService.getFeaturedEvents(),
    ]);
    setEvents(allEvts);
    setFeaturedEvents(featEvts);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Explorer';

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      {/* Top Banner Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greetingText}>Hello, {firstName} 👋</Text>
          <Text style={styles.headerSubtitle}>Discover university events & activities</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBadge}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar with live filter and clear button */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by event name, location..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Pills Horizontal Filter */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Featured Section (Shows when no search query and 'All' category) */}
      {!searchQuery && selectedCategory === 'All' && featuredEvents.length > 0 ? (
        <View style={styles.featuredSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Ionicons name="flame" size={20} color={Colors.warning} />
              <Text style={styles.sectionTitle}>Featured Events</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredEvents.map((evt) => (
              <FeaturedEventCard
                key={evt.id}
                event={evt}
                onPress={() => router.push(`/event/${evt.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Upcoming / Filtered Events Section */}
      <View style={styles.mainEventsSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Search Results (${events.length})`
              : selectedCategory !== 'All'
              ? `${selectedCategory} Events (${events.length})`
              : 'Upcoming Events'}
          </Text>
          {(searchQuery || selectedCategory !== 'All') && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetFilterText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {events.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No Events Found"
            description={`We couldn't find any events matching "${searchQuery || selectedCategory}". Try searching for another keyword or reset the category filter.`}
            actionTitle="Show All Events"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onPress={() => router.push(`/event/${evt.id}` as any)}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  greetingText: {
    ...Typography.h2,
    fontSize: 22,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  categoriesSection: {
    marginBottom: Spacing.md,
  },
  categoriesList: {
    gap: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextSelected: {
    color: Colors.textInverse,
  },
  featuredSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 18,
  },
  resetFilterText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  featuredList: {
    paddingVertical: Spacing.xs,
  },
  mainEventsSection: {
    marginTop: Spacing.xs,
  },
});
