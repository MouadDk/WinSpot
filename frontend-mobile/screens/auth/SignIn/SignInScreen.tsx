import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GoogleIcon } from "@/components/common/GoogleIcon";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./SignInScreen.styles";

type Mode = "sign-in" | "register";

/**
 * SignInScreen
 * 
 * Handles both user registration and login flows.
 * Supports Google Auth and Email/Password authentication.
 */
export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, language } = useAuth();

  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);

  const haptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    }
  };

  const handleGoogle = async () => {
    haptic();
    try {
      setLoading("google");
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch {
      const errTitle = language === "fr" ? "Erreur" : "Error";
      const errMsg = language === "fr" ? "Impossible de se connecter avec Google." : "Impossible to connect with Google.";
      Alert.alert(errTitle, errMsg);
    } finally {
      setLoading(null);
    }
  };

  const handleEmail = async () => {
    haptic();
    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      const title = language === "fr" ? "Champs requis" : "Required fields";
      const msg = language === "fr" ? "Merci de remplir tous les champs pour continuer." : "Please fill in all fields to continue.";
      Alert.alert(title, msg);
      return;
    }
    if (!email.includes("@")) {
      const title = language === "fr" ? "Email invalide" : "Invalid email";
      const msg = language === "fr" ? "Merci de saisir une adresse email valide." : "Please enter a valid email address.";
      Alert.alert(title, msg);
      return;
    }
    try {
      setLoading("email");
      await signInWithEmail(email, mode === "register" ? name : undefined);
      router.replace("/(tabs)");
    } catch {
      const title = language === "fr" ? "Erreur" : "Error";
      const msg = language === "fr" ? "Impossible de créer ton compte." : "Impossible to create your account.";
      Alert.alert(title, msg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(auth)/landing");
                }
              }}
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="arrow-left" size={18} color={colors.foreground} />
            </Pressable>
            <View style={styles.brandRow}>
              <Text style={[styles.brand, { color: colors.foreground }]}>Pub2Win</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {mode === "register"
                ? (language === "fr" ? "Créer ton compte" : "Create your account")
                : (language === "fr" ? "Bon retour" : "Welcome back")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {mode === "register"
                ? (language === "fr" ? "Rejoins la communauté et commence à gagner." : "Join the community and start earning.")
                : (language === "fr" ? "Connecte-toi pour retrouver tes WinCoins." : "Sign in to find your WinCoins.")}
            </Text>
          </View>

          {/* Google */}
          <Pressable
            onPress={handleGoogle}
            disabled={loading !== null}
            style={({ pressed }) => [
              styles.google,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed || loading ? 0.85 : 1,
              },
            ]}
          >
            {loading === "google" ? (
              <ActivityIndicator size="small" color={colors.foreground} />
            ) : (
              <GoogleIcon size={18} />
            )}
            <Text style={[styles.googleText, { color: colors.foreground }]}>
              {language === "fr" ? "Continuer avec Google" : "Continue with Google"}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
              ou avec ton email
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === "register" ? (
              <View
                style={[
                  styles.field,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Feather name="user" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nom complet"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="words"
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
            ) : null}
            <View
              style={[
                styles.field,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="mail" size={16} color={colors.mutedForeground} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
            <View
              style={[
                styles.field,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="lock" size={16} color={colors.mutedForeground} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
            
            {mode === "sign-in" && (
              <Pressable 
                onPress={() => Alert.alert("Réinitialisation", "Un email de récupération va t'être envoyé.")}
                style={styles.forgotPass}
              >
                <Text style={[styles.toggleLink, { color: colors.primary }]}>
                  {language === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleEmail}
              disabled={loading !== null}
              style={({ pressed }) => [
                styles.primary,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed || loading ? 0.85 : 1,
                },
              ]}
            >
              {loading === "email" ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <>
                  <Text
                    style={[styles.primaryText, { color: colors.primaryForeground }]}
                  >
                    {mode === "register" ? "Créer mon compte" : "Se connecter"}
                  </Text>
                  <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
                </>
              )}
            </Pressable>
          </View>

          {/* Toggle mode */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>
              {mode === "register" ? "Tu as déjà un compte ?" : "Pas encore inscrit ?"}
            </Text>
            <Pressable
              onPress={() => setMode(mode === "register" ? "sign-in" : "register")}
            >
              <Text style={[styles.toggleLink, { color: colors.primary }]}>
                {mode === "register" ? "Se connecter" : "Créer un compte"}
              </Text>
            </Pressable>
          </View>

          {/* Legal */}
          <Text style={[styles.legal, { color: colors.mutedForeground }]}>
            En continuant, tu acceptes nos{" "}
            <Text style={{ color: colors.foreground }}>Conditions</Text> et notre{" "}
            <Text style={{ color: colors.foreground }}>
              Politique de confidentialité
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
