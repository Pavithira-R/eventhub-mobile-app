import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { EventService } from '../../src/services/eventService';
import { CATEGORIES } from '../../src/data/mockData';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('0');
  const [seats, setSeats] = useState('100');

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    seats?: string;
  }>({});

  useEffect(() => {
    async function loadEvent() {
      if (id) {
        const found = await EventService.getEventById(id);
        if (found) {
          setTitle(found.title);
          setDescription(found.description);
          setCategory(found.category);
          setDate(found.date);
          setTime(found.time);
          setLocation(found.location);
          setPrice(found.price.toString());
          setSeats(found.totalSeats.toString());
        }
      }
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!title.trim()) nextErrors.title = 'Event title is required.';
    if (!description.trim()) nextErrors.description = 'Description is required.';
    if (!date.trim()) nextErrors.date = 'Event date is required.';
    if (!time.trim()) nextErrors.time = 'Event time is required.';
    if (!location.trim()) nextErrors.location = 'Location is required.';
    if (!seats || parseInt(seats, 10) <= 0) nextErrors.seats = 'Valid capacity required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate() || !id) return;

    setSaving(true);
    const capacityNum = parseInt(seats, 10) || 50;
    const priceNum = parseFloat(price) || 0;

    await EventService.updateEvent(id, {
      title,
      description,
      category,
      date,
      time,
      location,
      price: priceNum,
      totalSeats: capacityNum,
    });

    setSaving(false);
    Alert.alert('Changes Saved', 'Event details have been updated successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <AppCard style={styles.formCard}>
        <Text style={styles.formHeader}>Edit Event Details</Text>
        <Text style={styles.formSub}>ID: {id}</Text>

        <AppInput
          label="Event Title *"
          placeholder="Event title"
          icon="sparkles-outline"
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
          }}
          error={errors.title}
        />

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <AppInput
              label="Date *"
              placeholder="e.g. Oct 25, 2026"
              icon="calendar-outline"
              value={date}
              onChangeText={(val) => {
                setDate(val);
                if (errors.date) setErrors((e) => ({ ...e, date: undefined }));
              }}
              error={errors.date}
            />
          </View>
          <View style={styles.col}>
            <AppInput
              label="Time *"
              placeholder="e.g. 09:00 AM"
              icon="time-outline"
              value={time}
              onChangeText={(val) => {
                setTime(val);
                if (errors.time) setErrors((e) => ({ ...e, time: undefined }));
              }}
              error={errors.time}
            />
          </View>
        </View>

        <AppInput
          label="Location / Venue *"
          placeholder="Venue"
          icon="location-outline"
          value={location}
          onChangeText={(val) => {
            setLocation(val);
            if (errors.location) setErrors((e) => ({ ...e, location: undefined }));
          }}
          error={errors.location}
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <AppInput
              label="Total Capacity *"
              placeholder="100"
              icon="people-outline"
              keyboardType="number-pad"
              value={seats}
              onChangeText={(val) => {
                setSeats(val);
                if (errors.seats) setErrors((e) => ({ ...e, seats: undefined }));
              }}
              error={errors.seats}
            />
          </View>
          <View style={styles.col}>
            <AppInput
              label="Ticket Price (Rs.)"
              placeholder="0 (Free)"
              icon="cash-outline"
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        <AppInput
          label="Event Description *"
          placeholder="Description"
          icon="document-text-outline"
          value={description}
          onChangeText={(val) => {
            setDescription(val);
            if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
          }}
          error={errors.description}
          multiline
          numberOfLines={4}
          style={styles.descInput}
        />

        <AppButton
          title="Save Changes"
          size="lg"
          icon={<Ionicons name="save-outline" size={20} color={Colors.textInverse} />}
          onPress={handleUpdate}
          loading={saving}
          style={styles.saveBtn}
        />
      </AppCard>
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
  formCard: {
    padding: Spacing.lg,
  },
  formHeader: {
    ...Typography.h2,
    fontSize: 22,
  },
  formSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  catRow: {
    gap: Spacing.xs,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catChipTextActive: {
    color: Colors.textInverse,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  col: {
    flex: 1,
  },
  descInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
