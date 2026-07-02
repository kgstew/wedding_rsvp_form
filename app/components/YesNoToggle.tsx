"use client";

interface YesNoToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function YesNoToggle({ value, onChange }: YesNoToggleProps) {
  return (
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
            onClick={() => onChange(option.val)}
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
  );
}
