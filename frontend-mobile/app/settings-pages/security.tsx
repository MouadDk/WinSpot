import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function SecurityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleAction = (label: string) => {
    if (label === "Changer le mot de passe") {
      router.push("/settings-pages/change-password");
      return;
    }
    if (label === "Authentification à deux facteurs") {
      router.push("/settings-pages/two-factor-auth");
      return;
    }
    Alert.alert(label, "Cette action sera implémentée prochainement.");
  };

  const Row = ({ icon, label, isLast = false }: { icon: any, label: string, isLast?: boolean }) => (
    <Pressable 
      onPress={() => handleAction(label)}
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
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16 }]}>
          <Row icon="lock" label="Changer le mot de passe" />
          <Row icon="shield" label="Authentification à deux facteurs" />
          <Row icon="smartphone" label="Appareils connectés" isLast />
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
});
