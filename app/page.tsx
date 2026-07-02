"use client";

import { useState } from "react";
import Image from "next/image";
import GuestNamesStep from "./components/GuestNamesStep";
import ThankYou from "./components/ThankYou";
import EventDetails from "./components/EventDetails";
import type { EventKey, GuestName, GuestRsvp } from "@/lib/types";

type Step = "names" | "events" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("names");
  const [names, setNames] = useState<GuestName[]>([
    { firstName: "", lastName: "" },
  ]);
  const [guests, setGuests] = useState<GuestRsvp[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToEvents = () => {
    setGuests(
      names
        .filter((name) => name.firstName.trim().length > 0)
        .map((name) => ({
          firstName: name.firstName.trim(),
          lastName: name.lastName.trim(),
          welcomeParty: false,
          afterParty: false,
          farewellBrunch: false,
        }))
    );
    setError(null);
    setStep("events");
  };

  const setAnswer = (guestIndex: number, key: EventKey, value: boolean) => {
    setGuests((prev) =>
      prev.map((guest, i) =>
        i === guestIndex ? { ...guest, [key]: value } : guest
      )
    );
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong.");
      }
      setStep("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setNames([{ firstName: "", lastName: "" }]);
    setGuests([]);
    setError(null);
    setStep("names");
  };

  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-12">
      {/* Botanical illustration as a soft background accent (large screens only) */}
      <div className="pointer-events-none absolute -bottom-24 -left-28 hidden w-[28rem] opacity-20 lg:block">
        <Image
          src="/images/IMG_6850.jpeg"
          alt=""
          width={750}
          height={1000}
          className="w-full mix-blend-multiply"
        />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl bg-ivory shadow-xl ring-1 ring-burgundy/10">
          {/* Hero — dahlia bouquet */}
          <div className="relative h-44 w-full sm:h-52">
            <Image
              src="/images/IMG_7610.jpeg"
              alt="A bouquet of dahlias"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/50 via-plum/5 to-transparent" />
          </div>

          <div className="p-6 sm:p-9">
            <header className="mb-8 text-center">
              <p className="font-display text-xl italic text-rose">
                You&apos;re invited
              </p>
              <h1 className="mt-1 font-display text-5xl font-semibold tracking-wide text-burgundy">
                RSVP
              </h1>
              <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold">
                <span className="h-px w-8 bg-gold/50" />
                <span className="text-sm">❀</span>
                <span className="h-px w-8 bg-gold/50" />
              </div>
              <p className="mt-3 text-sm tracking-wide text-foreground/60">
                Welcome Party · After Party · Farewell Brunch
              </p>
            </header>

            {step === "names" && (
              <GuestNamesStep
                names={names}
                onChange={setNames}
                onContinue={goToEvents}
              />
            )}
            {step === "events" && (
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold text-burgundy">
                  RSVPing for
                </h2>
                <p className="mt-1 text-foreground/70">
                  {guests
                    .map((g) => `${g.firstName} ${g.lastName}`.trim())
                    .join(", ")}
                </p>
                <p className="mt-4 text-sm text-foreground/60">
                  Let us know which events each guest will attend below, then
                  send your RSVP.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("names")}
                  className="mt-4 text-sm font-medium text-sage underline-offset-4 hover:underline"
                >
                  Edit names
                </button>
              </div>
            )}
            {step === "done" && <ThankYou onReset={reset} />}
          </div>
        </div>

        {step !== "names" && (
          <EventDetails
            guests={step === "events" ? guests : undefined}
            onAnswer={step === "events" ? setAnswer : undefined}
          />
        )}

        {step === "events" && (
          <div className="mt-8">
            {error && (
              <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-center text-sm text-coral">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="w-full rounded-lg bg-burgundy px-5 py-3.5 font-medium tracking-wide text-white shadow-sm transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Submit RSVP"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
