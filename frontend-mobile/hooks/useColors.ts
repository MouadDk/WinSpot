import colors from "@/theme/colors";
import { useTheme } from "@/context/ThemeContext";

/**
 * Returns the design tokens for the active color scheme.
 *
 * The scheme is resolved by ThemeProvider:
 * - "light" or "dark" forces that palette
 * - "system" follows the device's appearance setting
 */
export function useColors() {
  const { scheme } = useTheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
