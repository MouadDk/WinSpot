import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Avatar } from "@/components/common/Avatar";
import { useAuth } from "@/context/AuthContext";

/**
 * Screen to edit user profile information.
 */
export default function ProfileEditScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedFirstName || !trimmedLastName || !normalizedEmail) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    try {
      await updateUser({ 
        firstName: trimmedFirstName, 
        lastName: trimmedLastName, 
        email: normalizedEmail 
      });
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Photo de profil", "Cette fonctionnalité nécessite l'accès à votre galerie ou appareil photo.");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Retour"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Modifier le profil</Text>
        <Pressable onPress={handleSave} disabled={loading} accessibilityLabel="Enregistrer les modifications" accessibilityRole="button">
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.saveText, { color: colors.primary }]}>Enregistrer</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Avatar initials={user?.avatarInitials || "U"} size="xl" />
          <Pressable 
            style={[styles.changeAvatarBtn, { backgroundColor: colors.primary }]}
            onPress={handleChangePhoto}
            accessibilityLabel="Modifier la photo de profil"
            accessibilityRole="button"
          >
            <Feather name="camera" size={16} color={colors.primaryForeground} />
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>PRÉNOM</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Prénom"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>NOM</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nom"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 17 },
  saveText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  content: { padding: 20, alignItems: "center" },
  avatarSection: { position: "relative", marginBottom: 32 },
  changeAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  form: { width: "100%" },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 12, marginBottom: 8 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});
