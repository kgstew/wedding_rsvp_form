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
        <h2 className="text-xl font-semibold text-stone-800">
          Who&apos;s in your party?
        </h2>
        <p className="mt-1 text-sm text-stone-500">
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
              className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-stone-800 shadow-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
            />
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => removeName(index)}
                aria-label={`Remove guest ${index + 1}`}
                className="rounded-lg px-3 py-2.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
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
        className="self-start text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
      >
        + Add another guest
      </button>

      <button
        type="button"
        onClick={onContinue}
        disabled={!hasValidName}
        className="mt-2 rounded-lg bg-stone-800 px-5 py-3 font-medium text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
