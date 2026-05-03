import { Mission, Transaction, User, Venue } from "./types";

export const VENUES: Venue[] = [
  {
    id: "v1",
    name: "Le Comptoir Gourmand",
    category: "Restaurant",
    type: "Bistronomie",
    area: "Le Marais",
    address: "12 Rue de la Paix, Paris",
    distance: "400m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=500&auto=format&fit=crop",
    latitude: 48.8698,
    longitude: 2.3323,
  },
  {
    id: "v2",
    name: "Skyline Rooftop Bar",
    category: "Bar",
    type: "Mixologie",
    area: "Bastille",
    address: "55 Avenue des Champs-Élysées, Paris",
    distance: "1.2km",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=500&auto=format&fit=crop",
    latitude: 48.8738,
    longitude: 2.295,
  },
  {
    id: "v3",
    name: "Urban Bowling",
    category: "Loisirs",
    type: "Divertissement",
    area: "Rivoli",
    address: "8 Rue de Rivoli, Paris",
    distance: "800m",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=500&auto=format&fit=crop",
    latitude: 48.8558,
    longitude: 2.3583,
  }
];

export const MISSIONS: Mission[] = [
  {
    id: "m1",
    venueId: "v1",
    title: "Partager ton plat signature",
    reward: 15,
    category: "food",
    description: "Prends une photo de ton plat et partage-la sur tes réseaux sociaux en taguant l'établissement.",
  },
  {
    id: "m2",
    venueId: "v1",
    title: "Laisser un avis constructif",
    reward: 10,
    category: "food",
    description: "Donne ton avis sur ton expérience pour aider l'équipe à s'améliorer.",
  },
  {
    id: "m3",
    venueId: "v2",
    title: "Commander un cocktail du mois",
    reward: 20,
    category: "drink",
    description: "Découvre notre création exclusive et gagne des WinCoins.",
  },
  {
    id: "m4",
    venueId: "v3",
    title: "Faire un Strike !",
    reward: 50,
    category: "fun",
    description: "Réalise un strike lors de ta partie et montre-le au personnel.",
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    kind: "earn",
    title: "Mission terminée",
    subtitle: "Le Comptoir Gourmand",
    amount: 15,
    date: "Hier · 19:30",
  },
  {
    id: "t2",
    kind: "spend",
    title: "Récompense échangée",
    subtitle: "Boisson offerte",
    amount: -10,
    date: "28 Avr · 14:15",
  }
];

export const USER: User = {
  name: "Léa Martin",
  firstName: "Léa",
  lastName: "Martin",
  handle: "@leamartin",
  followers: 1240,
  totalEarned: 8650,
  reputation: 4.9,
  reputationCount: 128,
  missionsCompleted: 42,
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
};
