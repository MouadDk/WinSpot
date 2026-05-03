const light = {
  text: "#1F1B2E",
  tint: "#6E3DB8",

  background: "#FAF9FC",
  foreground: "#1F1B2E",

  card: "#FFFFFF",
  cardForeground: "#1F1B2E",

  primary: "#6E3DB8",
  primaryForeground: "#FFFFFF",

  secondary: "#F1ECF8",
  secondaryForeground: "#3A2D58",

  muted: "#F4F2F7",
  mutedForeground: "#8B8696",

  accent: "#2A9DA0",
  accentForeground: "#FFFFFF",

  gold: "#D4A93A",
  goldSoft: "#F8EFCC",

  surface: "#F4F2F7",
  surfaceElevated: "#FFFFFF",

  destructive: "#E5484D",
  destructiveForeground: "#FFFFFF",

  success: "#2A9D5C",
  successSoft: "#E0F2E5",

  border: "#ECE9F2",
  input: "#ECE9F2",

  overlay: "rgba(31, 27, 46, 0.55)",

  walletGradient: ["#F4F2F7", "#FFFFFF"] as const,
};

const dark = {
  text: "#F4F1FA",
  tint: "#9B6BE0",

  background: "#0E0B14",
  foreground: "#F4F1FA",

  card: "#1A1522",
  cardForeground: "#F4F1FA",

  primary: "#8B5CF0",
  primaryForeground: "#FFFFFF",

  secondary: "#241D33",
  secondaryForeground: "#D9CCEF",

  muted: "#1F1A2A",
  mutedForeground: "#8A8298",

  accent: "#3FB5B8",
  accentForeground: "#0E0B14",

  gold: "#E0B84A",
  goldSoft: "#3A2F18",

  surface: "#16121E",
  surfaceElevated: "#221C2E",

  destructive: "#FF6369",
  destructiveForeground: "#FFFFFF",

  success: "#4DC97E",
  successSoft: "#1A2F22",

  border: "#241F30",
  input: "#241F30",

  overlay: "rgba(0, 0, 0, 0.7)",

  walletGradient: ["#221C2E", "#16121E"] as const,
};

const colors = {
  light,
  dark,
  radius: 18,
};

export default colors;
