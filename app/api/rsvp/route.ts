import { NextResponse } from "next/server";
import { upsertRsvp } from "@/lib/sheets";
import type { GuestRsvp } from "@/lib/types";

// googleapis relies on Node.js APIs, so this route must run on the Node runtime.
export const runtime = "nodejs";

function isValidGuest(value: unknown): value is GuestRsvp {
  if (typeof value !== "object" || value === null) return false;
  const guest = value as Record<string, unknown>;
  return (
    typeof guest.firstName === "string" &&
    guest.firstName.trim().length > 0 &&
    typeof guest.lastName === "string" &&
    typeof guest.welcomeParty === "boolean" &&
    typeof guest.afterParty === "boolean" &&
    typeof guest.farewellBrunch === "boolean"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const guests = (body as { guests?: unknown })?.guests;
  if (!Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json(
      { error: "At least one guest is required." },
      { status: 400 }
    );
  }

  if (!guests.every(isValidGuest)) {
    return NextResponse.json(
      { error: "One or more guests are missing required fields." },
      { status: 400 }
    );
  }

  const cleaned: GuestRsvp[] = guests.map((guest) => ({
    firstName: guest.firstName.trim(),
    lastName: guest.lastName.trim(),
    welcomeParty: guest.welcomeParty,
    afterParty: guest.afterParty,
    farewellBrunch: guest.farewellBrunch,
  }));

  try {
    await upsertRsvp(cleaned);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save RSVP to Google Sheet:", error);
    return NextResponse.json(
      { error: "Could not save your RSVP. Please try again." },
      { status: 500 }
    );
  }
}
