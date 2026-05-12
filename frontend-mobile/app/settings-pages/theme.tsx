import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { ThemePicker } from "@/components/business/ThemePicker/ThemePicker";

/**
 * Screen to manage theme and appearance settings.
 */
export default function ThemeSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Apparence</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: colors.foreground }]}>Personnalisation</Text>
          <Text style={[styles.introText, { color: colors.mutedForeground }]}>
            Choisissez le thème qui vous convient le mieux pour une expérience optimale.
          </Text>
        </View>

        <ThemePicker />

        <View style={[styles.infoCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Feather name="info" size={18} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Les changements de thème s'appliquent instantanément à toute l'application.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  content: { padding: 20 },
  introSection: { marginBottom: 32 },
  introTitle: { fontFamily: "Inter_700Bold", fontSize: 24, marginBottom: 8 },
  introText: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  infoCard: { marginTop: 32, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  infoText: { fontFamily: "Inter_500Medium", fontSize: 13, flex: 1, lineHeight: 18 }
});
