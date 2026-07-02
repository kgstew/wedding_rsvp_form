"use client";

import { EVENTS, type EventKey, type GuestRsvp } from "@/lib/types";

interface EventRsvpStepProps {
  guests: GuestRsvp[];
  onChange: (guests: GuestRsvp[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

export default function EventRsvpStep({
  guests,
  onChange,
  onBack,
  onSubmit,
  submitting,
  error,
}: EventRsvpStepProps) {
  const setAnswer = (
    guestIndex: number,
    eventKey: EventKey,
    value: boolean
  ) => {
    const next = guests.map((guest, i) =>
      i === guestIndex ? { ...guest, [eventKey]: value } : guest
    );
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-burgundy">
          Which events will you attend?
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          Select Yes or No for each guest and event.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {guests.map((guest, guestIndex) => (
          <div
            key={guestIndex}
            className="rounded-xl border border-burgundy/15 bg-cream/60 p-5"
          >
            <h3 className="mb-4 font-display text-xl font-semibold text-burgundy">
              {guest.name}
            </h3>
            <div className="flex flex-col gap-3">
              {EVENTS.map((event) => {
                const value = guest[event.key];
                return (
                  <div
                    key={event.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-foreground/80">
                      {event.label}
                    </span>
                    <div className="flex gap-2">
                      {[
                        { label: "Yes", val: true },
                        { label: "No", val: false },
                      ].map((option) => {
                        const selected = value === option.val;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() =>
                              setAnswer(guestIndex, event.key, option.val)
                            }
                            className={`w-16 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                              selected
                                ? option.val
                                  ? "border-sage bg-sage text-white"
                                  : "border-rose bg-rose text-white"
                                : "border-burgundy/20 bg-white text-foreground/70 hover:border-rose/50"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-burgundy/25 px-5 py-3 font-medium text-burgundy transition hover:bg-cream disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-burgundy px-5 py-3 font-medium tracking-wide text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit RSVP"}
        </button>
      </div>
    </div>
  );
}
