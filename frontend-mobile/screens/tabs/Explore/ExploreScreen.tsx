import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MissionCard } from "@/components/business/MissionCard/MissionCard";
import { useAppData } from "@/context/AppDataContext";
import { CATEGORIES } from "@/constants/AppData";
import type { MissionCategory } from "@/data/types";
import { useColors } from "@/hooks/useColors";
import { styles } from "./ExploreScreen.styles";

/**
 * ExploreScreen
 * 
 * Allows users to browse and search for missions.
 * Features category filtering and keyword search.
 */
export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    missions,
    venueById,
    acceptedMissionIds,
    completedMissionIds,
    acceptMission,
    completeMission,
  } = useAppData();
  
  const [activeCat, setActiveCat] = useState<MissionCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const v = venueById(m.venueId);
      const matchesCat = activeCat === "all" || m.category === activeCat;
      const matchesQuery =
        query.trim().length === 0 ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        v?.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [missions, activeCat, query, venueById]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={[styles.brand, { color: colors.foreground }]}>Pub2Win</Text>
          <View style={styles.topRight}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="sliders" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="bell" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Title */}
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.foreground }]}>Explorer</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Missions disponibles autour de toi.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Restaurant, bar, mission..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 18 }}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCat(cat.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Missions */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="map" size={28} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Aucune mission ici
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                Essaie une autre catégorie ou un autre terme.
              </Text>
            </View>
          ) : (
            filtered.map((m) => {
              const v = venueById(m.venueId);
              if (!v) return null;
              return (
                <MissionCard
                  key={m.id}
                  mission={m}
                  venue={v}
                  accepted={acceptedMissionIds.includes(m.id)}
                  completed={completedMissionIds.includes(m.id)}
                  onAccept={() => acceptMission(m.id)}
                  onComplete={() => completeMission(m.id)}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
