import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { ThemePreference, useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./ThemePicker.styles";

const OPTIONS: {
  id: ThemePreference;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { id: "light", label: "Clair", icon: "sun" },
  { id: "dark", label: "Sombre", icon: "moon" },
  { id: "system", label: "Système", icon: "smartphone" },
];

/**
 * ThemePicker Component
 * 
 * Allows the user to toggle between Light, Dark, and System theme preferences.
 */
export function ThemePicker() {
  const colors = useColors();
  const { preference, setPreference } = useTheme();

  const handlePress = (id: ThemePreference) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setPreference(id);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.iconBox, { backgroundColor: colors.secondary }]}
        >
          <Feather name="droplet" size={16} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Apparence
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Choisis ton thème préféré.
          </Text>
        </View>
      </View>

      <View style={[styles.segment, { backgroundColor: colors.muted }]}>
        {OPTIONS.map((opt) => {
          const active = preference === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => handlePress(opt.id)}
              style={[
                styles.segmentItem,
                active && {
                  backgroundColor: colors.card,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                },
              ]}
            >
              <Feather
                name={opt.icon}
                size={15}
                color={active ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: active ? colors.foreground : colors.mutedForeground,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
