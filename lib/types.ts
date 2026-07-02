export interface GuestName {
  firstName: string;
  lastName: string;
}

export interface GuestRsvp extends GuestName {
  welcomeParty: boolean;
  afterParty: boolean;
  farewellBrunch: boolean;
}

export interface RsvpSubmission {
  guests: GuestRsvp[];
}

export const EVENTS = [
  {
    key: "welcomeParty",
    label: "Welcome Party",
    title: "Friday Welcome Party",
    date: "Friday, September 25, 2026",
    time: "7:00 PM – 10:00 PM",
    venue: "Junkyard Social Club",
    address: "2525 Frontier Avenue, STE A, Boulder, Colorado 80301",
    description:
      "Come as you are to meet and connect with our friends and family to kick off the weekend. Food and non-alcoholic drinks will be provided. Beer, wine and canned cocktails available at the cafe bar. Toast the bride and groom and enjoy one of our favorite creative social spaces!",
    waiverUrl:
      "https://app.waiverfile.com/b/JunkyardSocialClub1/ChooseWaiver.aspx",
  },
  {
    key: "afterParty",
    label: "After Party",
    title: "After Party",
    date: "Saturday, September 26, 2026",
    time: "10:30 PM – 2:00 AM",
    venue: "License No 1",
    address: "2115 13th Street, Boulder, Colorado 80302",
    description:
      "Keep the party rolling! Join us at this speakeasy bar in the historic Boulderado for a celebratory nightcap. The last shuttle from the wedding venue will drop off at License No 1 and then the hotels.",
  },
  {
    key: "farewellBrunch",
    label: "Farewell Brunch",
    title: "Farewell Brunch",
    date: "Sunday, September 27, 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Embassy Suites Canyon Blvd",
    address: "2601 Canyon Boulevard, Boulder, Colorado 80302",
    description:
      "One last chance to gather before it's see you next time! Join us for a low key brunch to wrap the weekend.",
  },
] as const;

export type EventKey = (typeof EVENTS)[number]["key"];

/** The main wedding event — informational only, no RSVP collected. */
export const WEDDING = {
  title: "The Wedding",
  date: "Saturday, September 26, 2026",
  venue: "The Lyons Farmette",
  time: "Ceremony begins at 3:30 PM",
  description: "Dinner, reception, and dancing to follow.",
  mapsQuery: "The Lyons Farmette, Lyons, Colorado",
  shuttle: {
    intro: "Shuttle service will be provided to and from the wedding venue.",
    items: [
      {
        label: "Pickup from Embassy Suites and Hilton Garden Inn",
        detail: "1:15 and 2:15 PM",
      },
      {
        label: "Depart venue to Embassy Suites and Hilton Garden Inn",
        detail: "8:30 and 9:30 PM",
      },
      {
        label: "Depart venue to the After Party",
        detail: "10:30 PM",
      },
    ],
  },
} as const;
