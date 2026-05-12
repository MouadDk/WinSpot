import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleAddCard = () => {
    Alert.alert("Ajouter une carte", "Interface de saisie de carte bancaire Stripe (simulation).");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderStyle: 'dashed' }]}>
            <Feather name="credit-card" size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 16 }}>Aucune méthode de paiement</Text>
            <Text style={{ color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }}>Ajoutez une carte pour recharger votre Wallet WinCoin.</Text>
            <Pressable 
              onPress={handleAddCard}
              style={({ pressed }) => [
                styles.addBtn, 
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 }
              ]}
            >
                <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }}>Ajouter une carte</Text>
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
  emptyState: { borderRadius: 24, padding: 40, alignItems: 'center', justifyContent: 'center' },
  addBtn: { marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }
});
