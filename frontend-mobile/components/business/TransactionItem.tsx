import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

import type { Transaction } from "@/data/types";

const ICONS: Record<Transaction["kind"], keyof typeof Feather.glyphMap> = {
  earn: "check-circle",
  review: "edit-3",
  bonus: "gift",
  spend: "send",
};

export function TransactionItem({ tx }: { tx: Transaction }) {
  const colors = useColors();
  const positive = tx.amount >= 0;
  const tintBg =
    tx.kind === "spend"
      ? colors.muted
      : tx.kind === "bonus"
        ? colors.goldSoft
        : colors.secondary;
  const tintFg =
    tx.kind === "spend"
      ? colors.mutedForeground
      : tx.kind === "bonus"
        ? colors.gold
        : colors.primary;

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: tintBg }]}>
        <Feather name={ICONS[tx.kind]} size={16} color={tintFg} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
          {tx.subtitle}
        </Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            { color: positive ? colors.success : colors.foreground },
          ]}
        >
          {positive ? "+" : ""}
          {tx.amount}
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          {tx.date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  date: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
});
