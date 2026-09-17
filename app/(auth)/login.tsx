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
import { Colors } from '../../src/constants/Colors';
import { BorderRadius, Shadows, Spacing, Typography } from '../../src/constants/Theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};

    const emailErr = Validation.validateEmail(email);
    if (emailErr) nextErrors.email = emailErr;

    const passErr = Validation.validatePassword(password, 6);
    if (passErr) nextErrors.password = passErr;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      await login({
        email: email.trim(),
        password: password,
      });

      // Navigate to main application area
      router.replace('/(tabs)');
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || 'Login failed. Please check your credentials and try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper for evaluation testing
  const handleDemoFill = (type: 'student' | 'organizer') => {
    if (type === 'student') {
      setEmail('student@kln.ac.lk');
      setPassword('password123');
    } else {
      setEmail('organizer@kln.ac.lk');
      setPassword('organizer123');
    }
    setErrors({});
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Sign in to EventHub</Text>
        <Text style={styles.subtitle}>
          Enter your university credentials to explore and book campus events.
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
          label="Email Address"
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
          label="Password"
          placeholder="••••••••"
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

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() =>
            Alert.alert(
              'Reset Password',
              'A password reset link will be sent to your university email address in later phases.'
            )
          }
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AppButton
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.submitBtn}
        />
      </AppCard>

      {/* Demo Credentials Helper for Evaluators */}
      <View style={styles.demoSection}>
        <Text style={styles.demoLabel}>Demo Quick Logins:</Text>
        <View style={styles.demoBtnRow}>
          <TouchableOpacity
            style={styles.demoChip}
            onPress={() => handleDemoFill('student')}
          >
            <Ionicons name="school-outline" size={14} color={Colors.primary} />
            <Text style={styles.demoChipText}>Student Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoChip}
            onPress={() => handleDemoFill('organizer')}
          >
            <Ionicons name="briefcase-outline" size={14} color={Colors.secondaryDark} />
            <Text style={styles.demoChipText}>Organizer Demo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an EventHub account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>Register</Text>
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
    fontSize: 26,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  forgotText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
  demoSection: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  demoLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  demoBtnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  demoChipText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
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
