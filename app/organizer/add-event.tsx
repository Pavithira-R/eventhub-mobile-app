import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { EventService } from '../../src/services/eventService';
import { CATEGORIES } from '../../src/data/mockData';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Spacing, Typography } from '../../src/constants/Theme';

const IMAGE_PRESETS = [
  {
    label: 'Tech / AI',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Music / Acoustic',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Sports / Games',
    url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Academic / Workshop',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function AddEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('0');
  const [seats, setSeats] = useState('100');
  const [selectedImage, setSelectedImage] = useState(IMAGE_PRESETS[0].url);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    seats?: string;
  }>({});
  const [saving, setSaving] = useState(false);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!title.trim()) nextErrors.title = 'Event title is required.';
    if (!description.trim()) nextErrors.description = 'Description is required.';
    if (!date.trim()) nextErrors.date = 'Event date is required (e.g. Nov 25, 2026).';
    if (!time.trim()) nextErrors.time = 'Event time is required (e.g. 10:00 AM).';
    if (!location.trim()) nextErrors.location = 'Location/venue is required.';
    if (!seats || parseInt(seats, 10) <= 0) nextErrors.seats = 'Valid seat capacity is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    setSaving(true);
    const capacityNum = parseInt(seats, 10) || 50;
    const priceNum = parseFloat(price) || 0;

    await EventService.createEvent({
      title,
      description,
      category,
      date,
      time,
      location,
      price: priceNum,
      availableSeats: capacityNum,
      totalSeats: capacityNum,
      image: selectedImage,
      organizerName: 'Kelaniya Student Council',
      featured: false,
    });

    setSaving(false);
    Alert.alert('Event Published! 🎉', 'Your event has been successfully listed on EventHub.', [
      { text: 'View Events', onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <AppCard style={styles.formCard}>
        <Text style={styles.formHeader}>Create New Event</Text>
        <Text style={styles.formSub}>Fill in event details to publish to students</Text>

        <AppInput
          label="Event Title *"
          placeholder="e.g. AI & Robotics Symposium 2026"
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

        {/* Image Preset Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banner Theme Preset</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
            {IMAGE_PRESETS.map((preset) => {
              const isSelected = selectedImage === preset.url;
              return (
                <TouchableOpacity
                  key={preset.label}
                  style={[styles.presetCard, isSelected && styles.presetCardActive]}
                  onPress={() => setSelectedImage(preset.url)}
                >
                  <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                    {preset.label}
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
              placeholder="e.g. Nov 25, 2026"
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
              placeholder="e.g. 09:30 AM"
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
          placeholder="e.g. Science Auditorium, UoK"
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
              label="Max Seats *"
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
          placeholder="Provide details about the schedule, requirements, guidelines..."
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
          title="Publish Event"
          size="lg"
          icon={<Ionicons name="cloud-upload-outline" size={20} color={Colors.textInverse} />}
          onPress={handleCreate}
          loading={saving}
          style={styles.publishBtn}
        />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    ...Typography.bodySmall,
    color: Colors.textSecondary,
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
  presetRow: {
    gap: Spacing.xs,
  },
  presetCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 6,
  },
  presetCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  presetText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: Colors.primary,
    fontWeight: '700',
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
  publishBtn: {
    marginTop: Spacing.md,
  },
});
