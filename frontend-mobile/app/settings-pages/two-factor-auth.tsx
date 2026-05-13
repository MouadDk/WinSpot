import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Switch, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

/**
 * Screen to manage Two-Factor Authentication.
 */
export default function TwoFactorAuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [tfaEnabled, setTfaEnabled] = useState(false);

  const handleToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        "Activer la 2FA",
        "Pour activer l'authentification à deux facteurs, vous devez scanner un code QR avec une application d'authentification (Google Authenticator, Authy, etc.).",
        [
          { text: "Annuler", style: "cancel", onPress: () => setTfaEnabled(false) },
          { text: "Continuer", onPress: () => {
              setTfaEnabled(true);
              Alert.alert("Succès", "L'authentification à deux facteurs a été activée (simulation).");
            } 
          }
        ]
      );
    } else {
      Alert.alert(
        "Désactiver la 2FA",
        "Êtes-vous sûr de vouloir désactiver la protection à deux facteurs ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Désactiver", style: "destructive", onPress: () => setTfaEnabled(false) }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Authentification 2FA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="shield" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.introTitle, { color: colors.foreground }]}>Sécurisez votre compte</Text>
          <Text style={[styles.introText, { color: colors.mutedForeground }]}>
            L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant un code en plus de votre mot de passe.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Authentification par App</Text>
              <Text style={[styles.rowSubLabel, { color: colors.mutedForeground }]}>Utiliser une application comme Google Authenticator.</Text>
            </View>
            <Switch
              value={tfaEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={"#FFF"}
            />
          </View>
        </View>

        {tfaEnabled && (
          <View style={[styles.infoBox, { backgroundColor: colors.secondary }]}>
            <Feather name="info" size={18} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              2FA simulée : protégé localement.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 17 },
  content: { padding: 20 },
  introSection: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  introTitle: { fontFamily: "Inter_700Bold", fontSize: 20, marginBottom: 12, textAlign: 'center' },
  introText: { fontFamily: "Inter_400Regular", fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  card: { borderRadius: 16, borderWidth: 1, padding: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 4 },
  rowSubLabel: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  infoBox: { marginTop: 20, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  infoText: { fontFamily: "Inter_500Medium", fontSize: 14, flex: 1 }
});
