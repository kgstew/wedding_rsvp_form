# Wedding RSVP Form

A simple RSVP website. Guests enter the names in their party, then choose Yes/No
for three events — **Welcome Party**, **After Party**, and **Farewell Brunch**.
Each guest's answers are appended as a row to a Google Sheet.

Built with Next.js (App Router) + TypeScript + Tailwind. Writes to Google Sheets
via a service account. Deploys to Vercel.

## How it works

1. **Step 1** — the guest adds the name of everyone they're RSVPing for.
2. **Step 2** — for each name, they pick Yes/No for each of the three events.
3. On submit, the browser POSTs to `/api/rsvp`, a Node serverless route that
   appends **one row per guest** to the sheet:

   `First Name | Last Name | Welcome Party | After Party | Farewell Brunch | Submitted At`

Google credentials never reach the browser — they live only in server-side
environment variables.

## Google Sheets setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create (or pick) a project.
2. Enable the **Google Sheets API** for that project
   (APIs & Services → Library → Google Sheets API → Enable).
3. Create a **service account** (APIs & Services → Credentials →
   Create Credentials → Service account). No roles are required.
4. Open the service account → **Keys** → Add Key → Create new key → **JSON**.
   Download the file. You'll use its `client_email` and `private_key`.
5. Create a Google Sheet. In **row 1**, add the header row:
   `First Name`, `Last Name`, `Welcome Party`, `After Party`,
   `Farewell Brunch`, `Submitted At`.
6. **Share the sheet** with the service account's `client_email` as an **Editor**.
7. Copy the sheet ID from its URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_IS_THE_ID`**`/edit`.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON key |
| `GOOGLE_PRIVATE_KEY` | `private_key` from the JSON key (keep quotes + `\n`) |
| `GOOGLE_SHEET_ID` | the sheet ID from step 7 |

> The `private_key` in the JSON file contains literal `\n` sequences — paste it
> verbatim, wrapped in double quotes. The app converts `\n` back to newlines.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and submit a test RSVP; confirm rows appear in the sheet.

## Deploy to Vercel

1. Push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new),
   or run `npx vercel`.
2. In **Project → Settings → Environment Variables**, add the same three
   variables as above (Production + Preview).
   - For `GOOGLE_PRIVATE_KEY`, paste the key with its `\n` sequences intact.
3. Deploy. Submit a live RSVP and verify the row in your sheet.
