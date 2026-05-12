import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useAuth, NotificationSettings } from "@/context/AuthContext";

/**
 * Screen to manage detailed notification preferences.
 */
export default function NotificationsSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, updateNotifications } = useAuth();

  const toggleNotif = (key: keyof NotificationSettings) => {
    updateNotifications({ [key]: !notifications[key] });
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title}</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const Row = ({ label, subLabel, value, onToggle, isLast = false }: any) => (
    <View style={[styles.row, !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        {subLabel && <Text style={[styles.rowSubLabel, { color: colors.mutedForeground }]}>{subLabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={"#FFF"}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="ACTIVITÉ">
          <Row 
            label="Nouvelles missions" 
            subLabel="Soyez alerté quand une mission correspond à votre profil."
            value={notifications.offers}
            onToggle={() => toggleNotif('offers')}
          />
          <Row 
            label="Messages" 
            subLabel="Notifications pour les nouveaux messages des recruteurs."
            value={notifications.messages}
            onToggle={() => toggleNotif('messages')}
          />
          <Row 
            label="Wallet & Paiements" 
            subLabel="Mises à jour sur vos transactions et solde WinCoin."
            value={notifications.wallet}
            onToggle={() => toggleNotif('wallet')}
            isLast
          />
        </Section>

        <Section title="SÉCURITÉ">
          <Row 
            label="Alertes de sécurité" 
            subLabel="Connexions suspectes ou tentatives de changement de MDP."
            value={notifications.security}
            onToggle={() => toggleNotif('security')}
            isLast
          />
        </Section>

        <Section title="PROMOTIONS">
          <Row 
            label="Offres marketing" 
            subLabel="Nouveautés, réductions et annonces partenaires."
            value={notifications.marketing}
            onToggle={() => toggleNotif('marketing')}
            isLast
          />
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  content: { paddingVertical: 20 },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 12, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 2 },
  rowSubLabel: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
});
