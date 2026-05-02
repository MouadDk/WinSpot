import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./OnboardingScreen.styles";

const { width: SCREEN_W } = Dimensions.get("window");

type Slide = {
  key: string;
  image: any;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
};

const SLIDES: Slide[] = [
  {
    key: "discover",
    image: require("@/assets/images/onboarding/discover_min.png"),
    title: { fr: "Découvre", en: "Discover" },
    description: { 
      fr: "Trouve les meilleurs lieux autour de toi. Bistrots, bars, cafés et clubs sélectionnés.",
      en: "Find the best spots around you. Curated bistros, bars, cafes and clubs."
    },
  },
  {
    key: "earn",
    image: require("@/assets/images/onboarding/earn_min.png"),
    title: { fr: "Gagne", en: "Earn" },
    description: {
      fr: "Accepte des missions, partage tes coups de cœur et gagne des WinCoins à chaque visite.",
      en: "Accept missions, share your favorites and earn WinCoins on every visit."
    },
  },
  {
    key: "redeem",
    image: require("@/assets/images/onboarding/redeem_min.png"),
    title: { fr: "Échange", en: "Redeem" },
    description: {
      fr: "Convertis tes WinCoins en réductions, expériences exclusives ou cashback réel.",
      en: "Convert your WinCoins into discounts, exclusive experiences or real cashback."
    },
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useColors();
  const { completeOnboarding, language } = useAuth();
  const scrollRef = useRef<ScrollView | null>(null);
  const [page, setPage] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / SCREEN_W);
    if (next !== page) setPage(next);
  };

  const haptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    }
  };

  const goNext = () => {
    haptic();
    if (page < SLIDES.length - 1) {
      const target = (page + 1) * SCREEN_W;
      scrollRef.current?.scrollTo({ x: target, animated: true });
    } else {
      completeOnboarding();
      router.replace("/(auth)/sign-in");
    }
  };

  const isLast = page === SLIDES.length - 1;

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.navigationHeader, { paddingTop: insets.top + 10 }]}>
        <View />
        <Pressable onPress={() => { completeOnboarding(); router.replace("/(auth)/sign-in"); }}>
          <Text style={[styles.skipLinkText, { color: colors.mutedForeground }]}>
            {language === "fr" ? "Passer" : "Skip"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s) => (
          <View key={s.key} style={styles.onboardingSlide}>
            <View style={styles.illustrationWrapper}>
              <Image source={s.image} style={styles.slideImage} />
            </View>
            <View style={styles.textDetailsContainer}>
              <Text style={[styles.slideTitleText, { color: colors.foreground }]}>
                {s.title[language as keyof typeof s.title] || s.title.fr}
              </Text>
              <Text style={[styles.slideDescriptionText, { color: colors.mutedForeground }]}>
                {s.description[language as keyof typeof s.description] || s.description.fr}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.onboardingFooter, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.paginationIndicator,
                { backgroundColor: i === page ? colors.primary : colors.muted }
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.continueActionButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
          ]}
        >
          <Text style={[styles.continueButtonText, { color: colors.primaryForeground }]}>
            {isLast
              ? (language === "fr" ? "Commencer" : "Get Started")
              : (language === "fr" ? "Suivant" : "Next")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

