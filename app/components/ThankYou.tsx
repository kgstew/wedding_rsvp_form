"use client";

interface ThankYouProps {
  onReset: () => void;
}

export default function ThankYou({ onReset }: ThankYouProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="text-5xl">💐</div>
      <div>
        <h2 className="font-display text-4xl font-semibold text-burgundy">
          Thank you!
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-8 bg-gold/50" />
          <span className="text-sm">❀</span>
          <span className="h-px w-8 bg-gold/50" />
        </div>
        <p className="mt-3 text-foreground/60">
          Your RSVP has been received. We can&apos;t wait to celebrate with you.
        </p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-foreground/60">
          For all the details, visit our wedding website:
        </p>
        <a
          href="https://kyeanne.minted.us/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-burgundy px-5 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-plum"
        >
          Visit our wedding website →
        </a>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-sage underline-offset-4 hover:underline"
      >
        Submit another RSVP
      </button>
    </div>
  );
}
