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
        <h2 className="text-xl font-semibold text-stone-800">
          Which events will you attend?
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Select Yes or No for each guest and event.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {guests.map((guest, guestIndex) => (
          <div
            key={guestIndex}
            className="rounded-xl border border-stone-200 bg-stone-50/60 p-5"
          >
            <h3 className="mb-4 font-medium text-stone-800">{guest.name}</h3>
            <div className="flex flex-col gap-3">
              {EVENTS.map((event) => {
                const value = guest[event.key];
                return (
                  <div
                    key={event.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-stone-700">
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
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-stone-500 bg-stone-700 text-white"
                                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
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
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-stone-300 px-5 py-3 font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-stone-800 px-5 py-3 font-medium text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit RSVP"}
        </button>
      </div>
    </div>
  );
}
