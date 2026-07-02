"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GuestNamesStep from "./components/GuestNamesStep";
import ThankYou from "./components/ThankYou";
import EventDetails from "./components/EventDetails";
import type { EventKey, GuestName, GuestRsvp } from "@/lib/types";

type Step = "names" | "events" | "done";

const STORAGE_KEY = "wedding-rsvp-v1";

// Case- and whitespace-insensitive match key: "Kyle  Stewart" === "kyle stewart".
const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");
const guestKey = (firstName: string, lastName: string) =>
  `${normalize(firstName)} ${normalize(lastName)}`;

export default function Home() {
  const [step, setStep] = useState<Step>("names");
  const [names, setNames] = useState<GuestName[]>([
    { firstName: "", lastName: "" },
  ]);
  const [guests, setGuests] = useState<GuestRsvp[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Gate rendering until we've restored any saved progress, to avoid a flash
  // of the empty form for returning visitors.
  const [loaded, setLoaded] = useState(false);

  // Restore in-progress RSVP from localStorage on first load. Setting state in
  // this effect is intentional: reading localStorage must happen after mount to
  // avoid an SSR hydration mismatch, and it runs exactly once.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          names?: GuestName[];
          guests?: GuestRsvp[];
        };
        if (Array.isArray(saved.names) && saved.names.length > 0) {
          setNames(saved.names);
        }
        if (Array.isArray(saved.guests) && saved.guests.length > 0) {
          setGuests(saved.guests);
          // Drop returning visitors onto their answers so they can edit/resubmit.
          setStep("events");
        }
      }
    } catch {
      // Ignore malformed/unavailable storage.
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist progress whenever names or guests change (after the initial load).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ names, guests }));
    } catch {
      // Ignore storage write failures (e.g. private mode quota).
    }
  }, [loaded, names, guests]);

  const goToEvents = () => {
    // Preserve any prior answers when returning to edit names.
    const priorByKey = new Map(
      guests.map((g) => [guestKey(g.firstName, g.lastName), g])
    );
    setGuests(
      names
        .filter((name) => name.firstName.trim().length > 0)
        .map((name) => {
          const prior = priorByKey.get(
            guestKey(name.firstName, name.lastName)
          );
          return {
            firstName: name.firstName.trim(),
            lastName: name.lastName.trim(),
            welcomeParty: prior?.welcomeParty ?? false,
            afterParty: prior?.afterParty ?? false,
            farewellBrunch: prior?.farewellBrunch ?? false,
          };
        })
    );
    setError(null);
    setStep("events");
    window.scrollTo({ top: 0 });
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    setNames([{ firstName: "", lastName: "" }]);
    setGuests([]);
    setError(null);
    setStep("names");
  };

  if (!loaded) return null;

  return (
    <main className="relative flex min-h-full flex-1 flex-col items-center overflow-hidden px-4 py-12">
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

      <div className="relative my-auto w-full max-w-lg">
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
