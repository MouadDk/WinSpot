import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Alert, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/context/SettingsContext";

export default function SecurityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, requestLocationPermission } = useSettings();

  const handleAction = (actionId: "changePassword" | "twoFactor" | "devices") => {
    switch (actionId) {
      case "changePassword":
        router.push("/settings-pages/change-password");
        break;
      case "twoFactor":
        router.push("/settings-pages/two-factor-auth");
        break;
      case "devices":
        Alert.alert("Appareils connectés", "Cette action sera implémentée prochainement.");
        break;
    }
  };

  const Row = ({ icon, label, actionId, isLast = false }: { icon: any, label: string, actionId: any, isLast?: boolean }) => (
    <Pressable 
      onPress={() => handleAction(actionId)}
      style={({ pressed }) => [
        styles.row, 
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 },
        pressed && { backgroundColor: colors.secondary }
      ]}
    >
      <Feather name={icon} size={20} color={colors.primary} style={{ marginRight: 12 }} />
      <Text style={{ flex: 1, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Sécurité</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CONNEXION</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, marginBottom: 24 }]}>
          <Row icon="lock" label="Changer le mot de passe" actionId="changePassword" />
          <Row icon="shield" label="Authentification à deux facteurs" actionId="twoFactor" />
          <Row icon="smartphone" label="Appareils connectés" actionId="devices" isLast />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PERMISSIONS</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16 }]}>
          <View style={styles.permissionRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <Feather name="map-pin" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Localisation GPS</Text>
              <Text style={[styles.rowSubLabel, { color: colors.mutedForeground }]}>
                Nécessaire pour trouver des spots autour de vous.
              </Text>
            </View>
            <Switch
              value={settings.locationEnabled}
              onValueChange={requestLocationPermission}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 17 },
  card: { overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 16 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12, marginBottom: 8, marginLeft: 4, textTransform: "uppercase" },
  permissionRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rowLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  rowSubLabel: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
});
