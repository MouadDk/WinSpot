import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

/**
 * Screen to change user password.
 */
export default function ChangePasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Erreur", "Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      Alert.alert("Succès", "Votre mot de passe a été modifié avec succès.", [
        { 
          text: "OK", 
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            router.back();
          } 
        }
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder }: any) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Feather name="chevron-left" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Changer le mot de passe</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <InputField 
            label="MOT DE PASSE ACTUEL" 
            value={currentPassword} 
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
          />
          
          <View style={{ height: 12 }} />

          <InputField 
            label="NOUVEAU MOT DE PASSE" 
            value={newPassword} 
            onChangeText={setNewPassword}
            placeholder="••••••••"
          />

          <InputField 
            label="CONFIRMER LE NOUVEAU MOT DE PASSE" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
          />

          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            Votre mot de passe doit comporter au moins 8 caractères, dont des lettres et des chiffres.
          </Text>

          <Pressable 
            onPress={handleSave} 
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn, 
              { backgroundColor: colors.primary },
              (pressed || loading) && { opacity: 0.8 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>Mettre à jour</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 17 },
  content: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 12, marginBottom: 8, letterSpacing: 0.5 },
  inputContainer: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: { fontSize: 16, fontFamily: "Inter_400Regular" },
  hint: { fontSize: 13, lineHeight: 20, marginBottom: 32 },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
