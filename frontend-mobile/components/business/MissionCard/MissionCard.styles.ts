import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#eee",
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  venueName: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    flex: 1,
  },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rewardText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  miniCoin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  miniCoinText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
});
