import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function OrganizerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Organizer Dashboard' }} />
      <Stack.Screen name="events" options={{ title: 'My Hosted Events' }} />
      <Stack.Screen name="add-event" options={{ title: 'Create Event' }} />
      <Stack.Screen name="edit-event" options={{ title: 'Edit Event' }} />
      <Stack.Screen name="event-bookings" options={{ title: 'Event Bookings & Attendees' }} />
    </Stack>
  );
}
