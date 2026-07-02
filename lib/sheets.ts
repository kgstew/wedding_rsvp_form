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
 * Case- and whitespace-insensitive match key for a guest, used to find an
 * existing row. "Kyle  Stewart", "kyle stewart", and "kYle Stewart" all match.
 */
const normalize = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");
const guestKey = (firstName: string, lastName: string): string =>
  `${normalize(firstName)} ${normalize(lastName)}`;

/**
 * Saves guests to the configured Google Sheet, one row per guest.
 *
 * Upsert by name: if a guest with the same first + last name already has a row,
 * that row is updated in place; otherwise a new row is appended. This lets a
 * guest return and resubmit without creating duplicate rows.
 */
export async function upsertRsvp(guests: GuestRsvp[]): Promise<void> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();
  const submittedAt = new Date().toISOString();

  const toRow = (guest: GuestRsvp): string[] => [
    guest.firstName,
    guest.lastName,
    yesNo(guest.welcomeParty),
    yesNo(guest.afterParty),
    yesNo(guest.farewellBrunch),
    submittedAt,
  ];

  // Read existing data rows (below the header) to find matches by name.
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "A2:F",
  });
  const existingRows = existing.data.values ?? [];

  // Map each existing name to its 1-based sheet row number (data starts at row 2).
  const rowByKey = new Map<string, number>();
  existingRows.forEach((row, i) => {
    const key = guestKey(String(row[0] ?? ""), String(row[1] ?? ""));
    if (!rowByKey.has(key)) rowByKey.set(key, i + 2);
  });

  const updates: { range: string; values: string[][] }[] = [];
  const appends: string[][] = [];

  for (const guest of guests) {
    const rowNumber = rowByKey.get(guestKey(guest.firstName, guest.lastName));
    if (rowNumber) {
      updates.push({
        range: `A${rowNumber}:F${rowNumber}`,
        values: [toRow(guest)],
      });
    } else {
      appends.push(toRow(guest));
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: "USER_ENTERED", data: updates },
    });
  }

  if (appends.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }
}
