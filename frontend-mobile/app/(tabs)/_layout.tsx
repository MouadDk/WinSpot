import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";

/**
 * CustomTabBar
 * 
 * Recreates the premium floating pill design from the reference image.
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.tabBarWrapper}>
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        style={styles.tabBarContainer}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }
              navigation.navigate(route.name);
            }
          };

          const iconName = options.tabBarIconName as keyof typeof Feather.glyphMap;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && { backgroundColor: "rgba(0, 163, 255, 0.15)" },
                isFocused && styles.activePill,
              ]}
            >
              <Feather
                name={iconName}
                size={22}
                color={isFocused ? "#00A3FF" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? "#00A3FF" : colors.mutedForeground },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00A3FF",
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIconName: "home",
        } as any}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorer",
          tabBarIconName: "map",
        } as any}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIconName: "credit-card",
        } as any}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIconName: "user",
        } as any}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 24,
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      }
    }),
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    gap: 2,
  },
  activePill: {
    // This creates the highlighted pill background from your image
    borderWidth: 1,
    borderColor: "rgba(0, 163, 255, 0.2)",
  },
  tabLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
});
