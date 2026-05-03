import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

const SIZES = { sm: 32, md: 44, lg: 64, xl: 88 } as const;
type Size = keyof typeof SIZES;

const FONT_SIZES: Record<Size, number> = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
};

export function Avatar({
  initials,
  size = "md",
  ringColor,
  style,
}: {
  initials: string;
  size?: Size;
  ringColor?: string;
  style?: ViewStyle;
}) {
  const colors = useColors();
  const dim = SIZES[size];
  return (
    <View
      style={[
        styles.ring,
        {
          width: dim + 6,
          height: dim + 6,
          borderRadius: (dim + 6) / 2,
          borderColor: ringColor ?? colors.primary,
        },
        style,
      ]}
    >
      <View
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: colors.secondary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.primary,
            fontFamily: "Inter_700Bold",
            fontSize: FONT_SIZES[size],
          }}
        >
          {initials}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
