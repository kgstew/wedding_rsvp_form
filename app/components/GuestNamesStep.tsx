"use client";

interface GuestNamesStepProps {
  names: string[];
  onChange: (names: string[]) => void;
  onContinue: () => void;
}

export default function GuestNamesStep({
  names,
  onChange,
  onContinue,
}: GuestNamesStepProps) {
  const updateName = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    onChange(next);
  };

  const addName = () => onChange([...names, ""]);

  const removeName = (index: number) => {
    onChange(names.filter((_, i) => i !== index));
  };

  const hasValidName = names.some((name) => name.trim().length > 0);

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
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              placeholder={`Guest ${index + 1}`}
              className="flex-1 rounded-lg border border-burgundy/20 bg-white px-4 py-2.5 text-foreground shadow-sm outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/25"
            />
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => removeName(index)}
                aria-label={`Remove guest ${index + 1}`}
                className="rounded-lg px-3 py-2.5 text-rose/50 transition hover:bg-cream hover:text-rose"
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
        disabled={!hasValidName}
        className="mt-2 rounded-lg bg-burgundy px-5 py-3 font-medium tracking-wide text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
