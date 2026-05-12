import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>À propos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.logoSection}>
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.primaryForeground, fontSize: 32, fontWeight: 'bold' }}>W</Text>
            </View>
            <Text style={[styles.appName, { color: colors.foreground }]}>WinSpot</Text>
            <Text style={{ color: colors.mutedForeground }}>Version 1.0.0 (Beta)</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <Pressable style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.foreground }}>Conditions d'utilisation</Text>
            </Pressable>
            <Pressable style={styles.row}>
                <Text style={{ color: colors.foreground }}>Politique de confidentialité</Text>
            </Pressable>
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
  logoSection: { alignItems: 'center', marginVertical: 40 },
  logoPlaceholder: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  card: { borderRadius: 16, overflow: 'hidden' },
  row: { padding: 16 }
});
