import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { styles } from "./LandingScreen.styles";

interface FloatingIcon {
  icon: keyof typeof Feather.glyphMap;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useColors();
  const { language, setLanguage, confirmLanguage } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const onConfirm = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    }
    confirmLanguage();
    router.replace("/(auth)/onboarding");
  };

  const handleSelect = () => {
    setLanguage(selectedLang);
    setIsModalVisible(false);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    }
  };

  const languages = [
    { id: "en", label: "Anglais" },
    { id: "fr", label: "Français" },
  ] as const;

  const floatingIcons: FloatingIcon[] = [
    { icon: "wifi", top: "5%", left: "45%" },
    { icon: "shopping-bag", top: "15%", right: "25%" },
    { icon: "gift", top: "25%", left: "10%" },
    { icon: "percent", top: "35%", right: "5%" },
    { icon: "truck", bottom: "35%", left: "5%" },
    { icon: "award", bottom: "25%", right: "10%" },
    { icon: "coffee", bottom: "15%", left: "25%" },
    { icon: "map-pin", bottom: "5%", right: "45%" },
  ];

  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.appTitle, { color: colors.foreground }]}>Pub2Win</Text>

          <View style={styles.heroVisualContainer}>
            <View style={[styles.ambientBackgroundCircle, styles.circleLarge, { borderColor: colors.border, opacity: 0.2 }]} />
            <View style={[styles.ambientBackgroundCircle, styles.circleMedium, { borderColor: colors.muted, opacity: 0.3 }]} />
            <View style={[styles.ambientBackgroundCircle, styles.circleSmall, { borderColor: colors.secondary, opacity: 0.4 }]} />

            <View style={styles.brandLogoWrapper}>
              <Image
                source={require("@/assets/images/logo_p2win.png")}
                style={styles.brandLogo}
                onError={() => { }}
              />
            </View>

            {floatingIcons.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.decorationIcon,
                  { top: item.top, bottom: item.bottom, left: item.left, right: item.right } as ViewStyle
                ]}
              >
                <Feather name={item.icon} size={24} color={colors.mutedForeground} />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.actionSheetContainer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.card }]}>
          <Text style={[styles.fieldLabel, { color: colors.primary }]}>
            {language === "fr" ? "Langue" : "Language"}
          </Text>

          <Pressable
            onPress={() => {
              setSelectedLang(language);
              setIsModalVisible(true);
            }}
            style={[styles.languageDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.dropdownText, { color: colors.foreground }]}>
              {languages.find(l => l.id === language)?.label || "Français"}
            </Text>
            <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
          </Pressable>

          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.primaryActionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
              {language === "fr" ? "Suivant" : "Next"}
            </Text>
            <Feather name="arrow-right" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </View>

      {/* Language Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable style={[styles.modalSheetContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalHeaderTitle, { color: colors.foreground }]}>Langue</Text>

            <View style={styles.optionsGroup}>
              {languages.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedLang(item.id)}
                  style={styles.optionRow}
                >
                  <View style={[
                    styles.selectionRadioOuter,
                    { borderColor: colors.border },
                    selectedLang === item.id && { borderColor: colors.primary }
                  ]}>
                    {selectedLang === item.id && <View style={[styles.selectionRadioInner, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={[styles.optionLabel, { color: colors.foreground }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleSelect}
              style={({ pressed }) => [
                styles.confirmSelectionButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <Text style={[styles.confirmButtonText, { color: colors.primaryForeground }]}>Sélectionner</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
