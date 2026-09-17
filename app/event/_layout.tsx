import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function EventLayout() {
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
      <Stack.Screen name="[id]" options={{ title: 'Event Details' }} />
      <Stack.Screen name="book" options={{ title: 'Book Tickets' }} />
      <Stack.Screen name="confirmation" options={{ title: 'Confirmation', headerBackVisible: false }} />
    </Stack>
  );
}
