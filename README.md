# Kasi Yatra 2026 — Trip Site

This folder is the whole site: itinerary, route map, a live expense tracker, and a
photos link. It needs no Google Forms, no Firebase, no Netlify token from you —
just GitHub (which you already have) connected to Netlify.

## One-time setup

### 1. Create a GitHub repository
1. Go to https://github.com and sign in.
2. Click the **+** (top right) → **New repository**.
3. Name it something like `kasi-yatra-trip`. Leave it public or private, either
   works. Don't add a README/gitignore — just click **Create repository**.

### 2. Upload these files into it
1. On the new (empty) repo's page, click **uploading an existing file** (or
   **Add file → Upload files**).
2. Drag this entire `app` folder's **contents** in — that means the `index.html`,
   `netlify.toml`, `package.json`, `README.md`, and the whole `netlify` folder
   (with `functions` inside it). Most browsers let you drag the folder itself and
   GitHub keeps the structure; if it doesn't, drag each file/folder in one at a time.
3. Scroll down, add a commit message like "Initial site", and click
   **Commit changes**.

### 3. Connect the repo to Netlify
1. Go to https://app.netlify.com and log in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify if asked (a one-time "Continue with
   GitHub" click), then pick the `kasi-yatra-trip` repo.
4. Netlify should auto-detect the settings from `netlify.toml` (build command
   `npm install`, publish directory `.`). Just click **Deploy**.
5. Wait a minute or two for the first build. Netlify gives you a live link like
   `https://random-name-123.netlify.app` — that's what you share with the family
   (and put into a QR code).
6. Optional: **Site settings → Change site name** for a nicer link.

That's it — no Google Forms, no Firebase console, no token to hand anyone.

## Updating things later

- **Itinerary changes:** tell me what changed. I'll edit `index.html` and send you
  the updated file — upload it into the GitHub repo again (same "Upload files"
  screen, it detects it's replacing the existing `index.html`) and commit. Netlify
  redeploys automatically within a minute or two.
- **Hotel location for the map:** same as above — once you know the hotel, tell me
  and I'll update the map's pin and hand you a refreshed `index.html`.
- **Expenses and registrations:** these need no manual updates — they're stored
  automatically and show up live for everyone. If someone logs a mistake, open the
  repo... actually no — there's no spreadsheet to edit this time. Tell me the
  correction and I'll add a small "fix" tool, or for now just ask them to note the
  correct figure to you directly (the running total in the note field can call it
  out) until we add an edit feature if you'd like one.

## How people access it

- Once the site is live, I'll generate a QR code image pointing to its URL —
  print that and put it wherever the family will see it (a WhatsApp message works
  too, of course).
- First time anyone opens the link, they're asked for their name (stored on their
  phone, not asked again) before they can add expenses or see the photos link.
- Adding an expense lets them pick who it should split among from everyone who's
  registered so far, or tap "All registered" as a shortcut.
- The photos button opens your shared Google Drive folder for both viewing and
  uploading.

## What's still pending from your side

- [ ] Create the GitHub repo and upload these files (steps above)
- [ ] Connect it to Netlify and get the live URL
- [ ] Send me the live URL so I can generate the QR code
- [ ] Send me the real hotel location when you have it, so I can update the map
