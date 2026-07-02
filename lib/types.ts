export interface GuestRsvp {
  name: string;
  welcomeParty: boolean;
  afterParty: boolean;
  farewellBrunch: boolean;
}

export interface RsvpSubmission {
  guests: GuestRsvp[];
}

export const EVENTS = [
  { key: "welcomeParty", label: "Welcome Party" },
  { key: "afterParty", label: "After Party" },
  { key: "farewellBrunch", label: "Farewell Brunch" },
] as const;

export type EventKey = (typeof EVENTS)[number]["key"];
