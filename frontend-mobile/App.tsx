import { StatusBar } from 'expo-status-bar';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useAuth,
  useOAuth,
  useSignIn,
  useSignUp,
  useUser,
} from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore
    }
  },
};

function SignedInHome() {
  const { signOut } = useAuth();
  const { user } = useUser();
  return (
    <View style={styles.signedInShell}>
      <Text style={styles.signedInTitle}>You’re signed in</Text>
      <Text style={styles.signedInSubtitle}>
        {user?.primaryEmailAddress?.emailAddress ?? 'Clerk is working on mobile.'}
      </Text>
      <View style={styles.signedInRow}>
        <View />
        <Pressable accessibilityRole="button" onPress={() => signOut()} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = identifier.trim().length > 3 && identifier.includes('@') && password.length >= 6 && !submitting;

  const onSubmit = async () => {
    if (!isLoaded || !signIn) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier: identifier.trim(), password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return;
      }
      setError('Sign-in requires additional steps in this Clerk instance.');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={onGoogle}
        disabled={submitting}
        style={({ pressed }) => [
          styles.oauthBtn,
          submitting && styles.primaryBtnDisabled,
          pressed && !submitting && styles.primaryBtnPressed,
        ]}
      >
        <Text style={styles.oauthBtnText}>Continue with Google</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="you@example.com"
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPassword((v) => !v)}
          style={styles.helperBtn}
        >
          <Text style={styles.helperBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.primaryBtn,
          !canSubmit && styles.primaryBtnDisabled,
          pressed && canSubmit && styles.primaryBtnPressed,
        ]}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryBtnText}>Sign in</Text>
        )}
      </Pressable>
    </View>
  );
}

function SignUpForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [needsEmailCode, setNeedsEmailCode] = useState(false);
  const [emailCode, setEmailCode] = useState('');

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 3 &&
    email.includes('@') &&
    password.length >= 6 &&
    confirmPassword === password &&
    !submitting;

  const onSubmit = async () => {
    if (!isLoaded || !signUp) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await signUp.create({ firstName: firstName.trim(), lastName: lastName.trim(), emailAddress: email.trim(), password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return;
      }

      // Most common next step on mobile: email code verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setNeedsEmailCode(true);
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? 'Sign-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? 'Google sign-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded || !signUp) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: emailCode.trim() });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return;
      }
      setError('Verification not complete. Check the code and try again.');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (needsEmailCode) {
    return (
      <View>
        <Text style={styles.label}>Email verification code</Text>
        <TextInput
          value={emailCode}
          onChangeText={setEmailCode}
          placeholder="123456"
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          onPress={onVerify}
          disabled={emailCode.trim().length < 4 || submitting}
          style={({ pressed }) => [
            styles.primaryBtn,
            (emailCode.trim().length < 4 || submitting) && styles.primaryBtnDisabled,
            pressed && emailCode.trim().length >= 4 && !submitting && styles.primaryBtnPressed,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryBtnText}>Verify</Text>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={onGoogle}
        disabled={submitting}
        style={({ pressed }) => [
          styles.oauthBtn,
          submitting && styles.primaryBtnDisabled,
          pressed && !submitting && styles.primaryBtnPressed,
        ]}
      >
        <Text style={styles.oauthBtnText}>Continue with Google</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.nameRow}>
        <View style={[styles.field, styles.nameField]}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.input}
            selectionColor="#8B5CF6"
          />
        </View>
        <View style={[styles.field, styles.nameField]}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.input}
            selectionColor="#8B5CF6"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPassword((v) => !v)}
          style={styles.helperBtn}
        >
          <Text style={styles.helperBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          selectionColor="#8B5CF6"
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.primaryBtn,
          !canSubmit && styles.primaryBtnDisabled,
          pressed && canSubmit && styles.primaryBtnPressed,
        ]}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryBtnText}>Create account</Text>
        )}
      </Pressable>
    </View>
  );
}

export default function App() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const isSignIn = mode === 'signin';

  if (!publishableKey) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <Text style={styles.brand}>WinSpot</Text>
          <Text style={styles.subtitle}>
            Missing Clerk key. Set{' '}
            <Text style={styles.inlineCode}>EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY</Text> in{' '}
            <Text style={styles.inlineCode}>frontend-mobile/.env</Text> then restart Expo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.bgTopGlow} pointerEvents="none" />
        <View style={styles.bgBottomGlow} pointerEvents="none" />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.brand}>WinSpot</Text>
            <Text style={styles.subtitle}>
              {isSignIn ? 'Welcome back — sign in to continue.' : 'Create an account to get started.'}
            </Text>
          </View>

          <View style={styles.card}>
            <SignedOut>
              <View style={styles.segment}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setMode('signin')}
                  style={[styles.segmentBtn, isSignIn && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, isSignIn && styles.segmentTextActive]}>
                    Sign in
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setMode('signup')}
                  style={[styles.segmentBtn, !isSignIn && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, !isSignIn && styles.segmentTextActive]}>
                    Sign up
                  </Text>
                </Pressable>
              </View>

              <View style={styles.clerkCard}>{isSignIn ? <SignInForm /> : <SignUpForm />}</View>
            </SignedOut>

            <SignedIn>
              <SignedInHome />
            </SignedIn>
          </View>

          <Text style={styles.footer}>
            Expo managed workflow — no native Android/iOS folders needed.
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#070A13',
  },
  bgTopGlow: {
    position: 'absolute',
    top: -180,
    left: -120,
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
  },
  bgBottomGlow: {
    position: 'absolute',
    bottom: -200,
    right: -140,
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: 'rgba(34, 211, 238, 0.16)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.96)',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.62)',
  },
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.45)',
  },
  segmentText: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
  },
  segmentTextActive: {
    color: 'rgba(255,255,255,0.95)',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  nameField: {
    flex: 1,
    marginTop: 0,
  },
  field: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: 'rgba(255,255,255,0.70)',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: 'rgba(255,255,255,0.92)',
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  helperBtn: {
    position: 'absolute',
    right: 10,
    top: 29,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  helperBtnText: {
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '700',
    fontSize: 12,
  },
  primaryBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
  },
  primaryBtnPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  primaryBtnDisabled: {
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.60)',
  },
  metaLink: {
    color: 'rgba(34, 211, 238, 0.95)',
    fontWeight: '800',
  },
  footer: {
    marginTop: 14,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.40)',
    fontSize: 12,
  },
  inlineCode: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    color: 'rgba(255,255,255,0.85)',
  },
  clerkCard: {
    borderRadius: 14,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  errorText: {
    marginTop: 10,
    color: 'rgba(248, 113, 113, 0.95)',
    fontWeight: '700',
  },
  oauthBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  oauthBtnText: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  dividerRow: {
    marginTop: 14,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '800',
  },
  signedInShell: {
    paddingVertical: 10,
  },
  signedInTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.95)',
  },
  signedInSubtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.60)',
  },
  signedInRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ghostBtn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ghostBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '800',
  },
});
