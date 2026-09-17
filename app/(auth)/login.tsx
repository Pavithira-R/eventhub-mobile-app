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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: { email?: string; password?: string } = {};

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    setIsLoading(true);
    // Simulate brief network latency for realistic feel
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 400);
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
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
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
            if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
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
