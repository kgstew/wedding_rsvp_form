import { WEDDING, type GuestRsvp, type RsvpFieldKey } from "@/lib/types";
import YesNoToggle from "./YesNoToggle";

interface WeddingCardProps {
  guests?: GuestRsvp[];
  onAnswer?: (guestIndex: number, key: RsvpFieldKey, value: boolean) => void;
}

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;

export default function WeddingCard({ guests, onAnswer }: WeddingCardProps) {
  const interactive = Boolean(guests && guests.length > 0 && onAnswer);

  return (
    <article className="rounded-3xl bg-ivory p-6 shadow-sm ring-1 ring-burgundy/20 sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage">
        ✓ You are confirmed
      </span>

      <h3 className="mt-3 font-display text-2xl font-semibold text-burgundy">
        {WEDDING.title}
      </h3>
      <p className="mt-1 text-sm font-medium tracking-wide text-rose">
        {WEDDING.date}
      </p>

      <p className="mt-3 text-sm font-medium text-foreground/80">
        {WEDDING.venue}
      </p>
      <p className="text-sm text-foreground/70">{WEDDING.time}</p>

      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        {WEDDING.description}
      </p>

      <a
        href={mapsUrl(WEDDING.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-medium text-sage underline-offset-4 hover:underline"
      >
        Get Directions →
      </a>

      <div className="mt-6 border-t border-burgundy/10 pt-5">
        <p className="mb-3 font-display text-lg font-semibold text-burgundy">
          Shuttle Service
        </p>
        <p className="text-sm text-foreground/70">{WEDDING.shuttle.intro}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {WEDDING.shuttle.items.map((item) => (
            <li key={item.label}>
              <p className="text-sm text-foreground/80">{item.label}</p>
              <p className="text-sm font-medium text-rose">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      {interactive && (
        <div className="mt-6 border-t border-burgundy/10 pt-5">
          <p className="mb-3 font-display text-lg font-semibold text-burgundy">
            Please reconfirm if you would like a seat on the shuttle
          </p>
          <div className="flex flex-col gap-3">
            {guests!.map((guest, guestIndex) => (
              <div
                key={guestIndex}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-sm text-foreground/80">
                  {`${guest.firstName} ${guest.lastName}`.trim()}
                </span>
                <YesNoToggle
                  value={guest.shuttle}
                  onChange={(val) => onAnswer!(guestIndex, "shuttle", val)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
