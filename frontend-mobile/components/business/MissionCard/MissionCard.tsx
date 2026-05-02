import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Mission, Venue } from "@/data/types";
import { WinCoinIcon } from "@/components/common/WinCoinIcon/WinCoinIcon";
import { styles } from "./MissionCard.styles";

type Props = {
  mission: Mission;
  venue: Venue;
  accepted: boolean;
  completed: boolean;
  onAccept: () => void;
  onComplete: () => void;
};

/**
 * MissionCard Component
 * 
 * Renders a card for a specific mission at a venue.
 * Includes venue details, reward info, and actionable CTA.
 */
export function MissionCard({
  mission,
  venue,
  accepted,
  completed,
  onAccept,
  onComplete,
}: Props) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (completed) return;
    if (!accepted) onAccept();
    else onComplete();
  };

  const cta = completed ? "Validée" : accepted ? "Marquer terminée" : "Accepter";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.row}>
        <Image source={venue.image} style={styles.thumb} contentFit="cover" />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.venueName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {venue.name}
            </Text>
            <View
              style={[
                styles.rewardPill,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Text style={[styles.rewardText, { color: colors.primary }]}>
                +{mission.reward}
              </Text>
              <WinCoinIcon size="sm" style={{ marginLeft: 6 }} />
            </View>
          </View>

          <View style={styles.metaRow}>
            <Feather name="map-pin" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {venue.type} · {venue.area}
            </Text>
          </View>

          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {mission.title}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.footerMeta}>
              <Feather name="users" size={12} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {mission.participantsCount} ce soir · {mission.endsAt}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handlePress}
        disabled={completed}
        style={({ pressed }) => [
          styles.cta,
          {
            backgroundColor: completed
              ? colors.successSoft
              : accepted
                ? colors.primary
                : colors.secondary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        {completed ? (
          <Feather name="check" size={16} color={colors.success} />
        ) : null}
        <Text
          style={[
            styles.ctaText,
            {
              color: completed
                ? colors.success
                : accepted
                  ? colors.primaryForeground
                  : colors.primary,
            },
          ]}
        >
          {cta}
        </Text>
      </Pressable>
    </View>
  );
}
