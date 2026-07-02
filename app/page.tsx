"use client";

import { useState } from "react";
import Image from "next/image";
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
      </div>
    </main>
  );
}
