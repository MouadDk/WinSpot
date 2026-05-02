import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TransactionItem } from "@/components/business/TransactionItem";
import { WinCoinIcon } from "@/components/common/WinCoinIcon/WinCoinIcon";
import { useAppData } from "@/context/AppDataContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./WalletScreen.styles";

/**
 * WalletScreen
 * 
 * Manages user balance, redemption of WinCoins, and transaction history.
 */
export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, transactions, redeem, transfer } = useAppData();

  const haptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  };

  const onRedeem = () => {
    haptic();
    if (balance < 10) {
      Alert.alert("Solde insuffisant", "Il te faut au moins 10 WC pour échanger.");
      return;
    }
    redeem(10);
  };

  const onTransfer = () => {
    haptic();
    if (balance < 5) {
      Alert.alert("Solde insuffisant", "Il te faut au moins 5 WC pour transférer.");
      return;
    }
    transfer(5);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={[styles.brand, { color: colors.foreground }]}>Pub2Win</Text>
          <View style={styles.topRight}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="settings" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="bell" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.foreground }]}>Wallet</Text>
        </View>

        {/* Balance card */}
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={colors.walletGradient as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.balanceCard,
              { borderRadius: colors.radius, borderColor: colors.border },
            ]}
          >
            <View style={styles.balanceHeader}>
              <Text style={[styles.balanceLabel, { color: colors.mutedForeground }]}>
                WinCoins Wallet
              </Text>
              <View style={styles.coinsCluster}>
                <WinCoinIcon size="md" />
                <View style={[styles.coinShadow, { backgroundColor: colors.gold }]} />
                <View style={[styles.coinShadowSm, { backgroundColor: colors.accent }]} />
              </View>
            </View>

            <View style={styles.balanceRow}>
              <WinCoinIcon size="xl" />
              <View>
                <Text style={[styles.balanceValue, { color: colors.foreground }]}>{balance}</Text>
                <Text style={[styles.balanceUnit, { color: colors.mutedForeground }]}>
                  WinCoins
                </Text>
              </View>
            </View>

            <Text style={[styles.balanceEur, { color: colors.success }]}>
              ≈ {(balance * 0.65).toFixed(2)} €
            </Text>

            <View style={styles.actionRow}>
              <Pressable
                onPress={onRedeem}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name="gift" size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.foreground }]}>Échanger</Text>
              </Pressable>
              <Pressable
                onPress={onTransfer}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name="send" size={16} color="#FFFFFF" />
                <Text style={[styles.actionText, { color: "#FFFFFF" }]}>Transférer</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Transactions */}
        <View style={styles.txHeader}>
          <Text style={[styles.txHeaderTitle, { color: colors.foreground }]}>
            Historique
          </Text>
          <Pressable>
            <Text style={[styles.txHeaderAction, { color: colors.primary }]}>Voir tout</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.txCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {transactions.map((tx, i) => (
            <View key={tx.id}>
              <TransactionItem tx={tx} />
              {i < transactions.length - 1 ? (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
