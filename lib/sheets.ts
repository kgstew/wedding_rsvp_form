import { google } from "googleapis";
import type { GuestRsvp } from "./types";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/** Header row that should exist in the target sheet (row 1). */
export const SHEET_HEADERS = [
  "First Name",
  "Last Name",
  "Welcome Party",
  "After Party",
  "Farewell Brunch",
  "Submitted At",
];

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSheetsClient() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  // Private keys are stored with literal "\n" sequences in env vars; restore them.
  const privateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
}

const yesNo = (value: boolean): string => (value ? "Yes" : "No");

/**
 * Appends one row per guest to the configured Google Sheet.
 */
export async function appendRsvp(guests: GuestRsvp[]): Promise<void> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();
  const submittedAt = new Date().toISOString();

  const rows = guests.map((guest) => [
    guest.firstName,
    guest.lastName,
    yesNo(guest.welcomeParty),
    yesNo(guest.afterParty),
    yesNo(guest.farewellBrunch),
    submittedAt,
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "A1",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
}
