import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { WinCoinIcon } from "@/components/common/WinCoinIcon/WinCoinIcon";
import { useColors } from "@/hooks/useColors";
import { styles } from "./StatCard.styles";

type IconKind = "wincoins" | "missions" | "reputation";

interface StatCardProps {
  kind: IconKind;
  label: string;
  value: string;
  hint?: string;
}

/**
 * StatCard Component
 * 
 * A generic card to display metrics and stats with an associated icon.
 */
export function StatCard({
  kind,
  label,
  value,
  hint,
}: StatCardProps) {
  const colors = useColors();
  
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
        {kind === "wincoins" ? (
          <WinCoinIcon size="md" />
        ) : (
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor:
                  kind === "missions" ? colors.secondary : colors.goldSoft,
              },
            ]}
          >
            <Feather
              name={kind === "missions" ? "check-circle" : "star"}
              size={16}
              color={kind === "missions" ? colors.primary : colors.gold}
            />
          </View>
        )}
        <Text
          style={[styles.label, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      {hint ? (
        <Text style={[styles.hint, { color: colors.mutedForeground }]} numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
