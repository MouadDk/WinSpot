import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/common/Avatar";
import { ThemePicker } from "@/components/business/ThemePicker/ThemePicker";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./ProfileScreen.styles";

/**
 * StatTile Component
 * 
 * A small tile for profile statistics.
 */
function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: keyof typeof Feather.glyphMap;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View
        style={[
          styles.tileIcon,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.tileLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.tileValue, { color: colors.foreground }]}>{value}</Text>
      {hint ? (
        <Text style={[styles.tileHint, { color: colors.mutedForeground }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

/**
 * ProfileScreen
 * 
 * Displays user profile information, statistics, and application settings.
 */
export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, balance, missions, completedMissionIds, venues } = useAppData();
  const { user: authUser, signOut } = useAuth();

  const completedCount = completedMissionIds.length + user.missionsCompleted;
  const recent = venues.slice(0, 3);

  const displayFirstName = authUser?.firstName ?? user.firstName;
  const displayLastName = authUser?.lastName ?? user.lastName;
  const displayHandle = authUser
    ? authUser.email
    : user.handle;
  const displayInitials = authUser?.avatarInitials ?? "LM";

  const handleSignOut = () => {
    Alert.alert(
      "Se déconnecter",
      "Tu pourras te reconnecter à tout moment.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => signOut(),
        },
      ],
    );
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
          <Text style={[styles.brand, { color: colors.foreground }]}>Profil</Text>
          <View style={styles.topRight}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="settings" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Profile card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.profileTop}>
            <Avatar initials={displayInitials} size="xl" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: colors.foreground }]}>
                {displayFirstName} {displayLastName}
              </Text>
              <Text
                style={[styles.profileHandle, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {displayHandle}
              </Text>
              <View style={styles.profileMetaRow}>
                <View
                  style={[
                    styles.followerPill,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Feather name="users" size={11} color={colors.primary} />
                  <Text style={[styles.followerText, { color: colors.primary }]}>
                    {user.followers.toLocaleString("fr-FR")} fidèles
                  </Text>
                </View>
                {authUser?.provider === "google" ? (
                  <View
                    style={[
                      styles.followerPill,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <Feather name="check-circle" size={11} color={colors.success} />
                    <Text style={[styles.followerText, { color: colors.foreground }]}>
                      Google
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatTile
            label="Total gagné"
            value={`${user.totalEarned} €`}
            hint="WinCoins"
            icon="trending-up"
          />
          <StatTile
            label="Missions"
            value={String(completedCount)}
            hint="terminées"
            icon="check-circle"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatTile
            label="Réputation"
            value={user.reputation.toFixed(1)}
            hint="★★★★★"
            icon="star"
          />
          <StatTile
            label="Solde actuel"
            value={String(balance)}
            hint="WinCoins"
            icon="credit-card"
          />
        </View>

        {/* Theme picker */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <ThemePicker />
        </View>

        {/* Mission history */}
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.foreground }]}>
            Historique des missions
          </Text>
          <Pressable>
            <Text style={[styles.historyAction, { color: colors.primary }]}>Voir tout</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {recent.map((v, i) => {
            const m = missions.find((x) => x.venueId === v.id);
            return (
              <View
                key={v.id}
                style={[
                  styles.historyCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Image source={v.image} style={styles.historyImg} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.historyVenue, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {v.name}
                  </Text>
                  <Text
                    style={[styles.historySub, { color: colors.mutedForeground }]}
                    numberOfLines={1}
                  >
                    {v.area} · il y a {(i + 1) * 2}j
                  </Text>
                </View>
                <View
                  style={[
                    styles.rewardPill,
                    { backgroundColor: colors.successSoft },
                  ]}
                >
                  <Text style={[styles.rewardText, { color: colors.success }]}>
                    +{m?.reward ?? 3}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Sign out */}
        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOut,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="log-out" size={16} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>
              Se déconnecter
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
