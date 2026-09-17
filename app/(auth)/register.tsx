import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Account Created! 🎉',
        'Welcome to EventHub. Your account is ready for booking campus events.',
        [{ text: 'Continue to App', onPress: () => router.replace('/(tabs)') }]
      );
    }, 400);
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-add" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Create EventHub Account</Text>
        <Text style={styles.subtitle}>
          Sign up with your university email to book tickets and explore activities.
        </Text>
      </View>

      <AppCard style={styles.formCard}>
        <AppInput
          label="Full Name"
          placeholder="e.g. Pavithira Rajendran"
          icon="person-outline"
          value={fullName}
          onChangeText={(val) => {
            setFullName(val);
            if (errors.fullName) setErrors((e) => ({ ...e, fullName: undefined }));
          }}
          error={errors.fullName}
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
          label="Password"
          placeholder="At least 6 characters"
          icon="lock-closed-outline"
          isPassword
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
          }}
          error={errors.password}
        />

        <AppInput
          label="Confirm Password"
          placeholder="Re-enter password"
          icon="shield-checkmark-outline"
          isPassword
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            if (errors.confirmPassword)
              setErrors((e) => ({ ...e, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
        />

        {/* Account Role Selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Account Type</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'attendee' && styles.roleBtnActive]}
              onPress={() => setRole('attendee')}
            >
              <Ionicons
                name="school-outline"
                size={18}
                color={role === 'attendee' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.roleBtnText, role === 'attendee' && styles.roleBtnTextActive]}>
                Student / Attendee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'organizer' && styles.roleBtnActive]}
              onPress={() => setRole('organizer')}
            >
              <Ionicons
                name="briefcase-outline"
                size={18}
                color={role === 'organizer' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.roleBtnText, role === 'organizer' && styles.roleBtnTextActive]}>
                Society / Organizer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AppButton
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.submitBtn}
        />
      </AppCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  formCard: {
    padding: Spacing.lg,
    ...Shadows.md,
  },
  roleContainer: {
    marginBottom: Spacing.md,
  },
  roleLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSubtle,
  },
  roleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  roleBtnText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  roleBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  linkText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
});
