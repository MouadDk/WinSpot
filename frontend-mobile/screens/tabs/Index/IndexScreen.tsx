import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/common/Avatar";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatCard } from "@/components/common/StatCard/StatCard";
import { VenuesMap } from "@/components/business/VenuesMap.native";
import { WinCoinIcon } from "@/components/common/WinCoinIcon/WinCoinIcon";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./IndexScreen.styles";

/**
 * IndexScreen (Home)
 * 
 * The main dashboard for authenticated users.
 * Displays greeting, stats, featured venues, and daily missions.
 */
export default function IndexScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    user,
    balance,
    venues,
    missions,
    completedMissionIds,
    challengeProgress,
    challengeGoal,
  } = useAppData();
  const { user: authUser } = useAuth();
  
  const greetingName = authUser?.firstName ?? user.firstName;
  const avatarInitials = authUser?.avatarInitials ?? "LM";

  const completedCount = completedMissionIds.length + user.missionsCompleted;
  const featured = venues.slice(0, 3);
  const today = useMemo(() => missions.slice(0, 3), [missions]);

  const onShare = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
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
              onPress={() => {}}
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="bell" size={18} color={colors.foreground} />
              <View style={[styles.dot, { backgroundColor: colors.destructive }]} />
            </Pressable>
            <Avatar initials={avatarInitials} size="sm" />
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: colors.foreground }]}>
            Bonjour {greetingName}
          </Text>
          <Text style={[styles.greetingSub, { color: colors.mutedForeground }]}>
            Prête à explorer, manger et gagner ?
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            kind="wincoins"
            label="WinCoins"
            value={String(balance ?? 0)}
            hint={`${((balance ?? 0) * 0.65).toFixed(2)} €`}
          />
          <StatCard
            kind="missions"
            label="Missions"
            value={String(completedCount)}
            hint="terminées"
          />
          <StatCard
            kind="reputation"
            label="Réputation"
            value={(user?.reputation ?? 0).toFixed(1)}
            hint={`${user?.reputationCount ?? 0} avis`}
          />
        </View>

        {/* À la une — interactive map */}
        <SectionHeader
          title="À la une"
          actionLabel="Voir tout"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
        <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
          <VenuesMap venues={venues} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {featured.map((v) => (
            <View
              key={v.id}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Image source={v.image} style={styles.featureImg} contentFit="cover" />
              <View style={styles.featureBody}>
                <Text style={[styles.featureName, { color: colors.foreground }]} numberOfLines={1}>
                  {v.name}
                </Text>
                <Text style={[styles.featureMeta, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {v.type} · {v.area}
                </Text>
                <View style={styles.featureFooter}>
                  <View style={styles.featureRating}>
                    <Feather name="star" size={11} color={colors.gold} />
                    <Text style={[styles.featureRatingText, { color: colors.foreground }]}>
                      {(v.rating ?? 0).toFixed(1)}
                    </Text>
                  </View>
                  <Text style={[styles.featureMeta, { color: colors.mutedForeground }]}>
                    {v.distance}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Challenge banner */}
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [
            styles.challenge,
            {
              backgroundColor: colors.goldSoft,
              borderRadius: colors.radius,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={[styles.challengeIcon, { backgroundColor: colors.gold }]}>
            <Feather name="award" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.challengeTitle, { color: colors.foreground }]}>
              Challenge du mois
            </Text>
            <Text style={[styles.challengeSub, { color: colors.mutedForeground }]}>
              Réalise 5 missions ce mois-ci. Bonus : 50 WinCoins offerts.
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((challengeProgress ?? 0) / (challengeGoal ?? 1)) * 100}%`,
                    backgroundColor: colors.gold,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.challengeProgress, { color: colors.foreground }]}>
            {challengeProgress}/{challengeGoal}
          </Text>
        </Pressable>

        {/* Missions du jour */}
        <SectionHeader
          title="Missions du jour"
          actionLabel="Voir tout"
          onActionPress={() => router.push("/(tabs)/explore")}
        />
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {today.map((m) => {
            const v = venues.find((x) => x.id === m.venueId);
            if (!v) return null;
            return (
              <Pressable
                key={m.id}
                onPress={() => router.push("/(tabs)/explore")}
                style={({ pressed }) => [
                  styles.todayCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.95 : 1,
                  },
                ]}
              >
                <Image source={v.image} style={styles.todayImg} contentFit="cover" />
                <View style={styles.todayBody}>
                  <Text style={[styles.todayTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {m.title}
                  </Text>
                  <Text style={[styles.todayMeta, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {v.name} · {m.endsAt ?? "Aujourd'hui"}
                  </Text>
                </View>
                <View style={[styles.rewardPill, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.rewardText, { color: colors.primary }]}>+{m.reward}</Text>
                  <WinCoinIcon size="sm" />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
