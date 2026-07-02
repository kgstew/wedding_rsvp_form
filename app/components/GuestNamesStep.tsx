"use client";

import type { GuestName } from "@/lib/types";

interface GuestNamesStepProps {
  names: GuestName[];
  onChange: (names: GuestName[]) => void;
  onContinue: () => void;
}

export default function GuestNamesStep({
  names,
  onChange,
  onContinue,
}: GuestNamesStepProps) {
  const updateName = (index: number, field: keyof GuestName, value: string) => {
    const next = names.map((name, i) =>
      i === index ? { ...name, [field]: value } : name
    );
    onChange(next);
  };

  const addName = () => onChange([...names, { firstName: "", lastName: "" }]);

  const removeName = (index: number) => {
    onChange(names.filter((_, i) => i !== index));
  };

  const validCount = names.filter(
    (name) => name.firstName.trim().length > 0
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-burgundy">
          Who&apos;s in your party?
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          Add the name of everyone you&apos;re RSVPing for.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={name.firstName}
              onChange={(e) => updateName(index, "firstName", e.target.value)}
              placeholder="First name"
              className="min-w-0 flex-1 rounded-lg border border-burgundy/20 bg-white px-4 py-2.5 text-foreground shadow-sm outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/25"
            />
            <input
              type="text"
              value={name.lastName}
              onChange={(e) => updateName(index, "lastName", e.target.value)}
              placeholder="Last name"
              className="min-w-0 flex-1 rounded-lg border border-burgundy/20 bg-white px-4 py-2.5 text-foreground shadow-sm outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/25"
            />
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => removeName(index)}
                aria-label={`Remove guest ${index + 1}`}
                className="shrink-0 rounded-lg px-3 py-2.5 text-rose/50 transition hover:bg-cream hover:text-rose"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addName}
        className="self-start text-sm font-medium text-sage underline-offset-4 hover:underline"
      >
        + Add another guest
      </button>

      <button
        type="button"
        onClick={onContinue}
        disabled={validCount === 0}
        className="mt-2 rounded-lg bg-burgundy px-5 py-3 font-medium tracking-wide text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
      >
        {validCount === 0
          ? "RSVP"
          : `RSVP for ${validCount} ${validCount === 1 ? "guest" : "guests"}`}
      </button>
    </div>
  );
}
