import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { EmptyState } from '../../src/components/common/EmptyState';
import { EventService } from '../../src/services/eventService';
import { EventItem } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

export default function MyEventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const data = await EventService.getOrganizerEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDeleteEvent = (event: EventItem) => {
    Alert.alert(
      'Delete Event Listing?',
      `Are you sure you want to permanently delete "${event.title}"? Any registered attendees will be notified.`,
      [
        { text: 'Keep Event', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await EventService.deleteEvent(event.id);
            Alert.alert('Event Deleted', 'The event has been removed from EventHub.');
            loadEvents();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>Hosted Events</Text>
          <Text style={styles.subtitle}>Manage your society listings and capacity</Text>
        </View>
        <AppButton
          title="+ Add"
          size="sm"
          onPress={() => router.push('/organizer/add-event')}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No Events Hosted"
          description="You haven't created any events yet. Publish your first event to start accepting bookings!"
          actionTitle="Create First Event"
          onAction={() => router.push('/organizer/add-event')}
        />
      ) : (
        events.map((event) => {
          const bookedCount = event.totalSeats - event.availableSeats;

          return (
            <AppCard key={event.id} style={styles.eventCard}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <StatusBadge label={event.category} status="primary" />
                </View>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                <Text style={styles.metaText}>
                  {event.date} • {event.time}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={Colors.secondaryDark} />
                <Text style={styles.metaText}>{event.location}</Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="pricetag-outline" size={14} color={Colors.accent} />
                <Text style={styles.metaText}>
                  {event.price === 0 ? 'Free Entry' : `Rs. ${event.price}`} • {event.availableSeats} of{' '}
                  {event.totalSeats} seats remaining ({bookedCount} booked)
                </Text>
              </View>

              {/* Action Buttons: Edit, View Bookings, Delete */}
              <View style={styles.actionsRow}>
                <AppButton
                  title="Edit"
                  variant="outline"
                  size="sm"
                  icon={<Ionicons name="pencil" size={13} color={Colors.primary} />}
                  onPress={() => router.push(`/organizer/edit-event?id=${event.id}` as any)}
                  style={styles.actionBtn}
                />
                <AppButton
                  title="Bookings"
                  variant="secondary"
                  size="sm"
                  icon={<Ionicons name="people" size={13} color={Colors.primary} />}
                  onPress={() => router.push(`/organizer/event-bookings?id=${event.id}` as any)}
                  style={styles.actionBtn}
                />
                <AppButton
                  title="Delete"
                  variant="danger"
                  size="sm"
                  onPress={() => handleDeleteEvent(event)}
                  style={styles.deleteBtn}
                />
              </View>
            </AppCard>
          );
        })
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.h2,
  },
  subtitle: {
    ...Typography.subtitle,
    marginTop: 2,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  eventCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  eventTitle: {
    ...Typography.h3,
    fontSize: 16,
    flex: 1,
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
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    minWidth: 70,
  },
});
