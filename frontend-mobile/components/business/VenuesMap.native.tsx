import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";

import { useColors } from "@/hooks/useColors";

import type { Venue } from "@/data/types";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1522" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8298" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0e0b14" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#241f30" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f1a2a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e0b14" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1f1a2a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1a2520" }],
  },
];

function MapPin({ active, color }: { active: boolean; color: string }) {
  return (
    <View style={[styles.pinWrap, active && styles.pinWrapActive]}>
      <View
        style={[
          styles.pin,
          {
            backgroundColor: color,
            borderColor: "#FFFFFF",
            transform: [{ scale: active ? 1.15 : 1 }],
          },
        ]}
      >
        <Feather name="map-pin" size={14} color="#FFFFFF" />
      </View>
    </View>
  );
}

export function VenuesMap({
  venues,
  onSelectVenue,
}: {
  venues: Venue[];
  onSelectVenue?: (v: Venue) => void;
}) {
  const colors = useColors();
  const scheme = useColorScheme();
  const mapRef = useRef<MapView | null>(null);
  const [activeId, setActiveId] = useState<string>(venues[0]?.id ?? "");

  const initialRegion: Region = useMemo(() => {
    if (venues.length === 0) {
      return {
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    const lats = venues.map((v) => v.latitude);
    const lngs = venues.map((v) => v.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
      longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
    };
  }, [venues]);

  const activeVenue = venues.find((v) => v.id === activeId) ?? venues[0];

  const handleSelect = (v: Venue) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setActiveId(v.id);
    mapRef.current?.animateToRegion(
      {
        latitude: v.latitude,
        longitude: v.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      450,
    );
    onSelectVenue?.(v);
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(initialRegion, 600);
  };

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
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        loadingEnabled
        loadingBackgroundColor={colors.card}
        loadingIndicatorColor={colors.primary}
        customMapStyle={scheme === "dark" ? DARK_MAP_STYLE : []}
      >
        {venues.map((v) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: v.latitude, longitude: v.longitude }}
            onPress={() => handleSelect(v)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapPin active={v.id === activeId} color={colors.primary} />
          </Marker>
        ))}
      </MapView>

      {/* Recenter button */}
      <Pressable
        onPress={handleRecenter}
        style={[
          styles.recenter,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="navigation" size={16} color={colors.foreground} />
      </Pressable>

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
  map: {
    flex: 1,
  },
  pinWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  pinWrapActive: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  recenter: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
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
