import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MISSIONS,
  TRANSACTIONS,
  USER,
  VENUES,
} from "@/data/mockData";
import { Mission, Transaction, Venue } from "@/data/types";

const STORAGE_KEY = "pub2win:state:v1";

type PersistedState = {
  balance: number;
  acceptedMissionIds: string[];
  completedMissionIds: string[];
  transactions: Transaction[];
  challengeProgress: number;
};

type AppDataValue = {
  hydrated: boolean;
  user: typeof USER;
  venues: Venue[];
  missions: Mission[];
  balance: number;
  acceptedMissionIds: string[];
  completedMissionIds: string[];
  transactions: Transaction[];
  challengeProgress: number;
  challengeGoal: number;
  acceptMission: (id: string) => void;
  completeMission: (id: string) => void;
  redeem: (amount: number) => void;
  transfer: (amount: number) => void;
  venueById: (id: string) => Venue | undefined;
  missionById: (id: string) => Mission | undefined;
};

const AppDataContext = createContext<AppDataValue | undefined>(undefined);

const DEFAULT_STATE: PersistedState = {
  balance: 86,
  acceptedMissionIds: [],
  completedMissionIds: [],
  transactions: TRANSACTIONS,
  challengeProgress: 3,
};

const CHALLENGE_GOAL = 5;

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
}

function formatDateNow() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `Aujourd'hui · ${hh}:${mm}`;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedState;
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch {
        // ignore — fall back to defaults
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const acceptMission = useCallback((id: string) => {
    setState((prev) => {
      if (prev.acceptedMissionIds.includes(id)) return prev;
      return {
        ...prev,
        acceptedMissionIds: [...prev.acceptedMissionIds, id],
      };
    });
  }, []);

  const completeMission = useCallback((id: string) => {
    setState((prev) => {
      if (prev.completedMissionIds.includes(id)) return prev;
      const mission = MISSIONS.find((m) => m.id === id);
      const venue = mission ? VENUES.find((v) => v.id === mission.venueId) : undefined;
      const reward = mission?.reward ?? 0;
      const tx: Transaction = {
        id: makeId(),
        kind: "earn",
        title: "Mission terminée",
        subtitle: venue?.name ?? mission?.title ?? "Mission",
        amount: reward,
        date: formatDateNow(),
      };
      return {
        ...prev,
        balance: prev.balance + reward,
        completedMissionIds: [...prev.completedMissionIds, id],
        acceptedMissionIds: prev.acceptedMissionIds.filter((m) => m !== id),
        transactions: [tx, ...prev.transactions],
        challengeProgress: Math.min(prev.challengeProgress + 1, CHALLENGE_GOAL),
      };
    });
  }, []);

  const redeem = useCallback((amount: number) => {
    setState((prev) => {
      if (amount <= 0 || amount > prev.balance) return prev;
      const tx: Transaction = {
        id: makeId(),
        kind: "spend",
        title: "Récompense échangée",
        subtitle: `Crédit -${amount} WC`,
        amount: -amount,
        date: formatDateNow(),
      };
      return {
        ...prev,
        balance: prev.balance - amount,
        transactions: [tx, ...prev.transactions],
      };
    });
  }, []);

  const transfer = useCallback((amount: number) => {
    setState((prev) => {
      if (amount <= 0 || amount > prev.balance) return prev;
      const tx: Transaction = {
        id: makeId(),
        kind: "spend",
        title: "Transfert envoyé",
        subtitle: `Vers un ami · ${amount} WC`,
        amount: -amount,
        date: formatDateNow(),
      };
      return {
        ...prev,
        balance: prev.balance - amount,
        transactions: [tx, ...prev.transactions],
      };
    });
  }, []);

  const venueById = useCallback(
    (id: string) => VENUES.find((v) => v.id === id),
    [],
  );
  const missionById = useCallback(
    (id: string) => MISSIONS.find((m) => m.id === id),
    [],
  );

  const value = useMemo<AppDataValue>(
    () => ({
      hydrated,
      user: USER,
      venues: VENUES,
      missions: MISSIONS,
      balance: state.balance,
      acceptedMissionIds: state.acceptedMissionIds,
      completedMissionIds: state.completedMissionIds,
      transactions: state.transactions,
      challengeProgress: state.challengeProgress,
      challengeGoal: CHALLENGE_GOAL,
      acceptMission,
      completeMission,
      redeem,
      transfer,
      venueById,
      missionById,
    }),
    [
      hydrated,
      state,
      acceptMission,
      completeMission,
      redeem,
      transfer,
      venueById,
      missionById,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
