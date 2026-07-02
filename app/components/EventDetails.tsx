import { Fragment } from "react";
import { EVENTS, type EventKey, type GuestRsvp } from "@/lib/types";
import YesNoToggle from "./YesNoToggle";
import WeddingCard from "./WeddingCard";

interface EventDetailsProps {
  /** When provided, each event card shows per-guest Yes/No toggles. */
  guests?: GuestRsvp[];
  onAnswer?: (guestIndex: number, key: EventKey, value: boolean) => void;
}

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

export default function EventDetails({ guests, onAnswer }: EventDetailsProps) {
  const interactive = Boolean(guests && guests.length > 0 && onAnswer);

  return (
    <section className="mt-10">
      <header className="mb-6 text-center">
        <h2 className="font-display text-4xl font-semibold text-burgundy">
          The Weekend
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-8 bg-gold/50" />
          <span className="text-sm">❀</span>
          <span className="h-px w-8 bg-gold/50" />
        </div>
      </header>

      <div className="flex flex-col gap-5">
        {EVENTS.map((event) => (
          <Fragment key={event.key}>
          <article
            className="rounded-3xl bg-ivory p-6 shadow-sm ring-1 ring-burgundy/10 sm:p-8"
          >
            <h3 className="font-display text-2xl font-semibold text-burgundy">
              {event.title}
            </h3>
            <p className="mt-1 text-sm font-medium tracking-wide text-rose">
              {event.date}
            </p>
            <p className="text-sm text-foreground/60">{event.time}</p>

            <p className="mt-3 text-sm font-medium text-foreground/80">
              {event.venue}
            </p>
            <p className="text-sm text-foreground/70">{event.address}</p>

            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {event.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={mapsUrl(event.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-sage underline-offset-4 hover:underline"
              >
                Get Directions →
              </a>
              {"waiverUrl" in event && event.waiverUrl && (
                <a
                  href={event.waiverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-burgundy underline-offset-4 hover:underline"
                >
                  Sign the Waiver →
                </a>
              )}
            </div>

            {interactive && (
              <div className="mt-6 border-t border-burgundy/10 pt-5">
                <p className="mb-3 font-display text-lg font-semibold text-burgundy">
                  Will you attend?
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
                        value={guest[event.key]}
                        onChange={(val) =>
                          onAnswer!(guestIndex, event.key, val)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
          {/* The wedding falls chronologically after the Friday welcome party */}
          {event.key === "welcomeParty" && <WeddingCard />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
