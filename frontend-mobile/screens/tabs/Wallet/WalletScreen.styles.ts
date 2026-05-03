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
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    letterSpacing: -0.4,
  },
  cardWrap: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  balanceCard: {
    padding: 20,
    borderWidth: 1,
    gap: 14,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  coinsCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: -8,
  },
  coinShadow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -6,
    opacity: 0.85,
  },
  coinShadowSm: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -4,
    opacity: 0.85,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  balanceValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 44,
    letterSpacing: -1.2,
    lineHeight: 48,
  },
  balanceUnit: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginTop: 2,
  },
  balanceEur: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  actionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  txHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  txHeaderTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    letterSpacing: -0.2,
  },
  txHeaderAction: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  txCard: {
    marginHorizontal: 20,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    opacity: 0.6,
  },
});
