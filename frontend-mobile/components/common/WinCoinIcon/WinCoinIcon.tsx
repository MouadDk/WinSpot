import React from "react";
import { Image, View, ViewStyle } from "react-native";

type Size = "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, number> = {
  sm: 30,
  md: 50,
  lg: 82,
  xl: 142,
};

interface WinCoinIconProps {
  size?: Size;
  style?: ViewStyle;
}

/**
 * WinCoinIcon Component
 * 
 * Now uses the premium 3D 1-Coin Achievement image.
 */
export function WinCoinIcon({
  size = "md",
  style,
}: WinCoinIconProps) {
  const box = SIZES[size];

  return (
    <View style={[{ width: box, height: box }, style]}>
      <Image
        source={require("@/assets/images/wincoin.png")}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        }}
        onError={() => {
          // Fallback UI or empty
        }}
      />
    </View>
  );
}
