"use client";

interface ThankYouProps {
  onReset: () => void;
}

export default function ThankYou({ onReset }: ThankYouProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="text-5xl">🎉</div>
      <div>
        <h2 className="text-2xl font-semibold text-stone-800">Thank you!</h2>
        <p className="mt-2 text-stone-500">
          Your RSVP has been received. We can&apos;t wait to celebrate with you.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
      >
        Submit another RSVP
      </button>
    </div>
  );
}
