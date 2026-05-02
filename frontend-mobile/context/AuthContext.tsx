import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "pub2win:auth:v25";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: "google" | "email";
  avatarInitials: string;
};

type PersistedAuth = {
  hasSeenOnboarding: boolean;
  hasSelectedLanguage: boolean;
  language: "fr" | "en" | "ar";
  user: AuthUser | null;
};

type AuthValue = {
  hydrated: boolean;
  language: "fr" | "en" | "ar";
  hasSelectedLanguage: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  setLanguage: (lang: "fr" | "en" | "ar") => void;
  confirmLanguage: () => void;
  completeOnboarding: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, name?: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

const DEFAULT_STATE: PersistedAuth = {
  hasSeenOnboarding: false,
  hasSelectedLanguage: false,
  language: "fr",
  user: null,
};

function deriveInitials(first: string, last: string) {
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || "U";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<PersistedAuth>(DEFAULT_STATE);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedAuth;
          setState({ ...DEFAULT_STATE, ...parsed });
        } else {
          setState(DEFAULT_STATE);
        }
      } catch {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => { });
  }, [state, hydrated]);

  const setLanguage = useCallback((language: "fr" | "en" | "ar") => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const confirmLanguage = useCallback(() => {
    setState((prev) => ({ ...prev, hasSelectedLanguage: true }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, hasSeenOnboarding: true }));
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Demo Google sign-in — creates a local session.
    // In production this should be replaced with expo-auth-session/providers/google
    // or a managed auth provider (Clerk, Firebase, etc.).
    await new Promise((r) => setTimeout(r, 600));
    const user: AuthUser = {
      id: `g_${Date.now()}`,
      firstName: "Léa",
      lastName: "Martin",
      email: "lea.martin@gmail.com",
      provider: "google",
      avatarInitials: deriveInitials("Léa", "Martin"),
    };
    setState((prev) => ({
      ...prev,
      user,
      hasSeenOnboarding: true,
      hasSelectedLanguage: true,
    }));
  }, []);

  const signInWithEmail = useCallback(async (email: string, name?: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const trimmed = email.trim();
    const localPart = trimmed.split("@")[0] ?? "user";
    const guessedFirst = name?.split(" ")[0] ?? localPart;
    const guessedLast = name?.split(" ").slice(1).join(" ") || "";
    const user: AuthUser = {
      id: `e_${Date.now()}`,
      firstName: guessedFirst.charAt(0).toUpperCase() + guessedFirst.slice(1),
      lastName: guessedLast,
      email: trimmed,
      provider: "email",
      avatarInitials: deriveInitials(guessedFirst, guessedLast || "U"),
    };
    setState((prev) => ({
      ...prev,
      user,
      hasSeenOnboarding: true,
      hasSelectedLanguage: true,
    }));
  }, []);

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }));
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      hydrated,
      language: state.language,
      hasSelectedLanguage: state.hasSelectedLanguage,
      hasSeenOnboarding: state.hasSeenOnboarding,
      isAuthenticated: state.user !== null,
      user: state.user,
      setLanguage,
      confirmLanguage,
      completeOnboarding,
      signInWithGoogle,
      signInWithEmail,
      signOut,
    }),
    [
      hydrated,
      state,
      setLanguage,
      confirmLanguage,
      completeOnboarding,
      signInWithGoogle,
      signInWithEmail,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
