import type { Venue } from "@/data/types";

export declare function VenuesMap(props: {
  venues: Venue[];
  onSelectVenue?: (v: Venue) => void;
}): JSX.Element;
