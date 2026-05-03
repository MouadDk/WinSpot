import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  navigationHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  skipLinkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    padding: 8,
  },
  onboardingSlide: {
    width: SCREEN_W,
    flex: 1,
  },
  illustrationWrapper: {
    flex: 0.55,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  textDetailsContainer: {
    flex: 0.45,
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  slideTitleText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
  },
  slideDescriptionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  onboardingFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },
  paginationIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  continueActionButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
