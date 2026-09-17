import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/constants/Colors';

function RootNavigation() {
  const { isAuthenticated, isOrganizer, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const firstSegment = segments[0] as string | undefined;
    const secondSegment = segments[1] as string | undefined;

    const inAuthGroup = firstSegment === '(auth)';
    const inOrganizerGroup = firstSegment === 'organizer';

    // Route guard: Protect tabs & details if unauthenticated
    if (!isAuthenticated && !inAuthGroup && firstSegment !== undefined) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup && (secondSegment === 'login' || secondSegment === 'register')) {
      // Already authenticated users visiting login/register go to main tabs
      router.replace('/(tabs)');
    } else if (isAuthenticated && inOrganizerGroup && !isOrganizer) {
      // Protect organizer direct routes for student roles
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isOrganizer, isLoading, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="organizer" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
