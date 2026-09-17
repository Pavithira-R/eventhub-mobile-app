import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { useAuth } from '../../src/context/AuthContext';
import { Validation } from '../../src/utils/validation';
import { Colors } from '../../src/constants/Colors';
import { Spacing, Typography } from '../../src/constants/Theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('');
  const [bio, setBio] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; general?: string }>({});

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setFaculty(user.faculty || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    const nameErr = Validation.validateName(name);
    if (nameErr) nextErrors.name = nameErr;

    const emailErr = Validation.validateEmail(email);
    if (emailErr) nextErrors.email = emailErr;

    const phoneErr = Validation.validatePhone(phone);
    if (phoneErr) nextErrors.phone = phoneErr;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        faculty: faculty.trim(),
        bio: bio.trim(),
      });

      Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || 'Failed to update profile. Please try again.',
      }));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      {errors.general ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errors.general}</Text>
        </View>
      ) : null}

      <AppCard style={styles.formCard}>
        <Text style={styles.sectionHeading}>Personal Information</Text>

        <AppInput
          label="Full Name *"
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
          label="Email Address *"
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
          label="Contact Number"
          placeholder="+94 77 123 4567"
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
          }}
          error={errors.phone}
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
  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '500',
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
