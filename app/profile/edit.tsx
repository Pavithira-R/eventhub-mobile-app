import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { ProfileService } from '../../src/services/profileService';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('');
  const [bio, setBio] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    async function loadData() {
      const profile = await ProfileService.getProfile();
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
      setFaculty(profile.faculty || '');
      setBio(profile.bio || '');
      setLoading(false);
    }
    loadData();
  }, []);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!name.trim()) {
      nextErrors.name = 'Full name cannot be empty.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email address cannot be empty.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    await ProfileService.updateProfile({
      name,
      email,
      phone,
      faculty,
      bio,
    });
    setSaving(false);

    Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
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
        <Text style={styles.sectionHeading}>Personal Information</Text>

        <AppInput
          label="Full Name"
          placeholder="Your full name"
          icon="person-outline"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
          }}
          error={errors.name}
        />

        <AppInput
          label="Email Address"
          placeholder="student@kln.ac.lk"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
          error={errors.email}
        />

        <AppInput
          label="Phone Number"
          placeholder="+94 77 123 4567"
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <AppInput
          label="Faculty / Department"
          placeholder="e.g. Faculty of Computing & Technology"
          icon="school-outline"
          value={faculty}
          onChangeText={setFaculty}
        />

        <AppInput
          label="Bio / Short Description"
          placeholder="Tell other students about your interests..."
          icon="document-text-outline"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          style={styles.bioInput}
        />

        <AppButton
          title="Save Changes"
          onPress={handleSave}
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
  sectionHeading: {
    ...Typography.h2,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
