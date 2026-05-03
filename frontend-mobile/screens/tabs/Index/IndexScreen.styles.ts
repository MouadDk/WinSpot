import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  brand: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: -0.2,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 9,
    right: 11,
  },
  greetingBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  greeting: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    letterSpacing: -0.6,
  },
  greetingSub: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 28,
  },
  featureCard: {
    width: 200,
    borderWidth: 1,
    overflow: "hidden",
  },
  featureImg: {
    width: "100%",
    height: 110,
  },
  featureBody: {
    padding: 12,
    gap: 4,
  },
  featureName: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  featureMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  featureFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  featureRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureRatingText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  challenge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 24,
  },
  challengeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  challengeSub: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  challengeProgress: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  todayCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
    borderWidth: 1,
  },
  todayImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  todayBody: {
    flex: 1,
    gap: 2,
  },
  todayTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  todayMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rewardText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
});
