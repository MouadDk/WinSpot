import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AppDataProvider } from "@/context/AppDataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ThemedStatusBar() {
  const { scheme } = useTheme();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

function useAuthRedirect() {
  const { hydrated, hasSelectedLanguage, hasSeenOnboarding, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const inAuthGroup = segments[0] === "(auth)";
    const currentAuthScreen = inAuthGroup ? segments[1] : null;

    if (!isAuthenticated) {
      if (!hasSelectedLanguage) {
        if (currentAuthScreen !== "landing") {
          router.replace("/(auth)/landing");
        }
      } else if (!hasSeenOnboarding) {
        if (currentAuthScreen !== "onboarding") {
          router.replace("/(auth)/onboarding");
        }
      } else if (currentAuthScreen !== "sign-in") {
        router.replace("/(auth)/sign-in");
      }
    } else if (inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [hydrated, hasSelectedLanguage, hasSeenOnboarding, isAuthenticated, segments, router]);
}

function RootLayoutNav() {
  const { hydrated } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useAuthRedirect();

  useEffect(() => {
    if (hydrated && (fontsLoaded || fontError)) {
      // Guaranteed delay for professional branding display
      const timer = setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hydrated, fontsLoaded, fontError]);

  if (!hydrated || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <AppDataProvider>
                <GestureHandlerRootView>
                  <KeyboardProvider>
                    <RootLayoutNav />
                    <ThemedStatusBar />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </AppDataProvider>
            </QueryClientProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
