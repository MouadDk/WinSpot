import { CategoryItem } from "@/data/types";

export const CATEGORIES: CategoryItem[] = [
  { id: "all", label: "Toutes" },
  { id: "food", label: "Restauration" },
  { id: "drink", label: "Bars & Drinks" },
  { id: "fun", label: "Loisirs" },
  { id: "other", label: "Autres" },
];

export const APP_CONFIG = {
  version: "1.0.0",
  termsUrl: "https://pub2win.app/terms",
  privacyUrl: "https://pub2win.app/privacy",
};
