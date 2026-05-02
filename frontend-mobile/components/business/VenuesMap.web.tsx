import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

import type { Venue } from "@/data/types";

export function VenuesMap({
  venues,
  onSelectVenue,
}: {
  venues: Venue[];
  onSelectVenue?: (v: Venue) => void;
}) {
  const colors = useColors();
  const [activeId, setActiveId] = useState<string>(venues[0]?.id ?? "");
  const activeVenue = venues.find((v) => v.id === activeId) ?? venues[0];

  const bbox = useMemo(() => {
    if (venues.length === 0) {
      return "2.30,48.84,2.40,48.88";
    }
    const lats = venues.map((v) => v.latitude);
    const lngs = venues.map((v) => v.longitude);
    const padLat = 0.008;
    const padLng = 0.012;
    const minLat = Math.min(...lats) - padLat;
    const maxLat = Math.max(...lats) + padLat;
    const minLng = Math.min(...lngs) - padLng;
    const maxLng = Math.max(...lngs) + padLng;
    return `${minLng},${minLat},${maxLng},${maxLat}`;
  }, [venues]);

  const markerParam = activeVenue
    ? `&marker=${activeVenue.latitude},${activeVenue.longitude}`
    : "";

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markerParam}`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      {/* OpenStreetMap iframe */}
      <iframe
        src={mapUrl}
        style={{ border: 0, width: "100%", height: "100%" }}
        loading="lazy"
        title="Venues map"
      />

      {/* Pin selector overlay */}
      <View style={styles.pinList}>
        {venues.slice(0, 5).map((v) => {
          const active = v.id === activeId;
          return (
            <Pressable
              key={v.id}
              onPress={() => {
                setActiveId(v.id);
                onSelectVenue?.(v);
              }}
              style={[
                styles.pinChip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Feather
                name="map-pin"
                size={11}
                color={active ? colors.primaryForeground : colors.primary}
              />
              <Text
                style={[
                  styles.pinChipText,
                  {
                    color: active ? colors.primaryForeground : colors.foreground,
                  },
                ]}
                numberOfLines={1}
              >
                {v.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Active venue info card */}
      {activeVenue ? (
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="map-pin" size={14} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.infoName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {activeVenue.name}
            </Text>
            <Text
              style={[styles.infoMeta, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {activeVenue.type} · {activeVenue.distance}
            </Text>
          </View>
          <View style={styles.infoRating}>
            <Feather name="star" size={11} color={colors.gold} />
            <Text style={[styles.infoRatingText, { color: colors.foreground }]}>
              {activeVenue.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  pinList: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pinChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pinChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    maxWidth: 100,
  },
  infoCard: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  infoName: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  infoMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 1,
  },
  infoRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  infoRatingText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
});
