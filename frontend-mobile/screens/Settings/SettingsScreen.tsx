import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemePicker } from "@/components/business/ThemePicker/ThemePicker";
import { APP_CONFIG } from "@/constants/AppData";
import { useColors } from "@/hooks/useColors";
import { styles } from "./SettingsScreen.styles";

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subLabel?: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
  type?: "link" | "toggle";
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
}

function SettingsRow({
  icon,
  label,
  subLabel,
  value,
  isLast,
  onPress,
  type = "link",
  toggleValue,
  onToggle,
}: SettingsRowProps) {
  const colors = useColors();
  const isActionableLink = type === "link" && typeof onPress === "function";

  return (
    <Pressable
      onPress={isActionableLink ? onPress : undefined}
      disabled={type === "link" && !isActionableLink}
      style={[styles.row, !isLast && styles.rowBorder, { borderBottomColor: colors.border }]}
    >
      <View style={[styles.rowIconContainer, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        {subLabel ? (
          <Text style={[styles.rowSubLabel, { color: colors.mutedForeground }]}>{subLabel}</Text>
        ) : null}
      </View>
      {type === "link" ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {value ? <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text> : null}
          {isActionableLink ? (
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          ) : null}
        </View>
      ) : (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.card}
        />
      )}
    </Pressable>
  );
}

/**
 * SettingsScreen
 * 
 * Provides dynamic control over user preferences including theme selection,
 * notification settings, and account management.
 */
export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Feather name="x" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Réglages</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Compte</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingsRow icon="user" label="Modifier le profil" />
            <SettingsRow icon="lock" label="Mot de passe & Sécurité" />
            <SettingsRow icon="credit-card" label="Moyens de paiement" isLast />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Préférences</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingsRow
              icon="bell"
              label="Notifications Push"
              type="toggle"
              toggleValue={pushEnabled}
              onToggle={setPushEnabled}
            />
            <SettingsRow
              icon="map-pin"
              label="Service de localisation"
              subLabel="Nécessaire pour trouver des missions"
              type="toggle"
              toggleValue={locationEnabled}
              onToggle={setLocationEnabled}
            />
            <SettingsRow icon="globe" label="Langue" value="Français" isLast />
          </View>
        </View>

        {/* Theme Picker Component */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Apparence</Text>
          <ThemePicker />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Assistance</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingsRow icon="help-circle" label="Centre d'aide" />
            <SettingsRow icon="file-text" label="Conditions d'utilisation" />
            <SettingsRow icon="shield" label="Politique de confidentialité" isLast />
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 40 }}>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
            Pub2Win v{APP_CONFIG.version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
