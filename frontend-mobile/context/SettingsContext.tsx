import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SETTINGS_STORAGE_KEY = "winspot:settings:v1";

export type Settings = {
  language: "fr" | "en";
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  onboardingCompleted: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  language: "fr",
  notificationsEnabled: true,
  locationEnabled: false,
  onboardingCompleted: false,
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        }
      } catch (error) {
        console.error("Erreur chargement paramètres:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Demander la permission de localisation
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const isGranted = status === "granted";
      
      await updateSettings({ locationEnabled: isGranted });
      return isGranted;
    } catch (error) {
      console.error("Erreur permission localisation:", error);
      return false;
    }
  };

  // Mettre à jour et sauvegarder les paramètres
  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erreur sauvegarde paramètres:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, requestLocationPermission, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
