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
    time: "7:00 PM – 11:55 PM",
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
    time: "11:00 PM – 2:00 AM",
    address: "2115 13th Street, Boulder, Colorado 80302",
    description:
      "Keep the party rolling! Join us at this speakeasy bar in downtown Boulder for a celebratory nightcap. The last shuttle from the wedding venue will drop off at License No 1 and then the hotels.",
  },
  {
    key: "farewellBrunch",
    label: "Farewell Brunch",
    title: "Farewell Brunch",
    date: "Sunday, September 27, 2026",
    time: "10:00 AM – 1:00 PM",
    address: "2601 Canyon Boulevard, Boulder, Colorado 80302",
    description:
      "One last chance to gather before it's see you next time! Join us for a low key brunch to wrap the weekend.",
  },
] as const;

export type EventKey = (typeof EVENTS)[number]["key"];
