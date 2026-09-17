import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { AppInput } from '../../src/components/common/AppInput';
import { AppButton } from '../../src/components/common/AppButton';
import { AppCard } from '../../src/components/common/AppCard';
import { useAuth } from '../../src/context/AuthContext';
import { Validation } from '../../src/utils/validation';
import { UserRole } from '../../src/types';
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('attendee');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    const nameErr = Validation.validateName(fullName);
    if (nameErr) nextErrors.fullName = nameErr;

    const emailErr = Validation.validateEmail(email);
    if (emailErr) nextErrors.email = emailErr;

    const passErr = Validation.validatePassword(password, 6);
    if (passErr) nextErrors.password = passErr;

    const confirmErr = Validation.validateConfirmPassword(password, confirmPassword);
    if (confirmErr) nextErrors.confirmPassword = confirmErr;

    const phoneErr = Validation.validatePhone(phone);
    if (phoneErr) nextErrors.phone = phoneErr;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      await register({
        name: fullName,
        email: email.trim(),
        password: password,
        role: role,
        phone: phone.trim() || '+94 77 000 0000',
      });

      Alert.alert(
        'Account Created! 🎉',
        `Welcome to EventHub, ${fullName.trim()}! Your ${
          role === 'organizer' ? 'Organizer' : 'Student'
        } account is ready.`,
        [
          {
            text: 'Continue to App',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || 'Registration failed. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
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

      {/* General Error Banner */}
      {errors.general ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color={Colors.error} />
          <Text style={styles.errorBannerText}>{errors.general}</Text>
        </View>
      ) : null}

      <AppCard style={styles.formCard}>
        <AppInput
          label="Full Name *"
          placeholder="e.g. Pavithira Rajendran"
          icon="person-outline"
          value={fullName}
          onChangeText={(val) => {
            setFullName(val);
            if (errors.fullName || errors.general)
              setErrors((e) => ({ ...e, fullName: undefined, general: undefined }));
          }}
          error={errors.fullName}
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
            if (errors.email || errors.general)
              setErrors((e) => ({ ...e, email: undefined, general: undefined }));
          }}
          error={errors.email}
        />

        <AppInput
          label="Phone Number (Optional)"
          placeholder="+94 77 123 4567"
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (errors.phone || errors.general)
              setErrors((e) => ({ ...e, phone: undefined, general: undefined }));
          }}
          error={errors.phone}
        />

        <AppInput
          label="Password *"
          placeholder="At least 6 characters"
          icon="lock-closed-outline"
          isPassword
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (errors.password || errors.general)
              setErrors((e) => ({ ...e, password: undefined, general: undefined }));
          }}
          error={errors.password}
        />

        <AppInput
          label="Confirm Password *"
          placeholder="Re-enter password"
          icon="shield-checkmark-outline"
          isPassword
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            if (errors.confirmPassword || errors.general)
              setErrors((e) => ({ ...e, confirmPassword: undefined, general: undefined }));
          }}
          error={errors.confirmPassword}
        />

        {/* Account Role Selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Account Type *</Text>
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.errorLight,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    ...Typography.bodySmall,
    color: Colors.error,
    flex: 1,
    fontWeight: '500',
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
