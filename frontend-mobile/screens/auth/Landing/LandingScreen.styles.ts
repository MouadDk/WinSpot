import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  appTitle: {
    position: "absolute",
    top: 60,
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  heroVisualContainer: {
    width: SCREEN_W * 0.85,
    height: SCREEN_W * 0.85,
    alignItems: "center",
    justifyContent: "center",
  },
  ambientBackgroundCircle: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 999,
  },
  circleLarge: { width: SCREEN_W * 0.85, height: SCREEN_W * 0.85 },
  circleMedium: { width: SCREEN_W * 0.65, height: SCREEN_W * 0.65 },
  circleSmall: { width: SCREEN_W * 0.45, height: SCREEN_W * 0.45 },

  brandLogoWrapper: {
    width: SCREEN_W * 0.85,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  decorationIcon: {
    position: "absolute",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  actionSheetContainer: {
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  fieldLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    marginBottom: -4,
  },
  languageDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  dropdownText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  primaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalSheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: SCREEN_H * 0.4,
  },
  modalHeaderTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  optionsGroup: {
    marginBottom: 32,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  optionLabel: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    marginLeft: 16,
  },
  selectionRadioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  confirmSelectionButton: {
    paddingVertical: 18,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
