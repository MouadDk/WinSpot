export type MissionCategory = "all" | "food" | "drink" | "fun" | "other";

export interface Venue {
  id: string;
  name: string;
  category: string;
  type: string;
  area: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  latitude: number;
  longitude: number;
}

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  handle: string;
  followers: number;
  totalEarned: number;
  reputation: number;
  reputationCount: number;
  missionsCompleted: number;
  avatar: string;
}

export interface Mission {
  id: string;
  venueId: string;
  title: string;
  reward: number;
  category: MissionCategory;
  description: string;
  participantsCount?: number;
  endsAt?: string;
  points?: number;
}

export interface Transaction {
  id: string;
  kind: "earn" | "spend" | "bonus" | "review";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
}

export interface CategoryItem {
  id: MissionCategory;
  label: string;
}
