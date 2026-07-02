"use client";

import { useState } from "react";
import GuestNamesStep from "./components/GuestNamesStep";
import EventRsvpStep from "./components/EventRsvpStep";
import ThankYou from "./components/ThankYou";
import type { GuestRsvp } from "@/lib/types";

type Step = "names" | "events" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("names");
  const [names, setNames] = useState<string[]>([""]);
  const [guests, setGuests] = useState<GuestRsvp[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToEvents = () => {
    const cleanedNames = names
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    setGuests(
      cleanedNames.map((name) => ({
        name,
        welcomeParty: false,
        afterParty: false,
        farewellBrunch: false,
      }))
    );
    setError(null);
    setStep("events");
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
    setNames([""]);
    setGuests([]);
    setError(null);
    setStep("names");
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-stone-100 px-4 py-12">
      <div className="w-full max-w-lg">
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            You&apos;re invited
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-800">RSVP</h1>
          <p className="mt-2 text-sm text-stone-500">
            Welcome Party · After Party · Farewell Brunch
          </p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
          {step === "names" && (
            <GuestNamesStep
              names={names}
              onChange={setNames}
              onContinue={goToEvents}
            />
          )}
          {step === "events" && (
            <EventRsvpStep
              guests={guests}
              onChange={setGuests}
              onBack={() => setStep("names")}
              onSubmit={submit}
              submitting={submitting}
              error={error}
            />
          )}
          {step === "done" && <ThankYou onReset={reset} />}
        </div>
      </div>
    </main>
  );
}
