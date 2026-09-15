import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    const day = (body.day || "").trim();
    const paidBy = (body.paidBy || "").trim();
    const desc = (body.desc || "").trim();
    const amount = Number(body.amount);
    const split = Array.isArray(body.split) ? body.split.map(s => String(s).trim()).filter(Boolean) : [];

    if (!day || !paidBy || !desc || !split.length || !(amount >= 0)) {
      return json({ error: "Missing or invalid fields" }, 400);
    }
    if (day.length > 40 || paidBy.length > 60 || desc.length > 200) {
      return json({ error: "One of the fields is too long" }, 400);
    }

    const store = getStore("expenses");

    // Duplicate guard: if the same person just added an identical-looking
    // expense in the last 15 seconds (e.g. a double-tap on a slow connection),
    // treat this as a repeat rather than creating a second entry.
    const DUPLICATE_WINDOW_MS = 15000;
    const now = Date.now();
    const { blobs } = await store.list();
    for (const b of blobs) {
      if (!b.key.startsWith("exp-")) continue;
      const keyTs = Number(b.key.split("-")[1]);
      if (!keyTs || now - keyTs > DUPLICATE_WINDOW_MS) continue;
      const existing = await store.get(b.key, { type: "json" });
      if (
        existing &&
        existing.paidBy === paidBy &&
        existing.desc === desc &&
        Number(existing.amount) === amount &&
        existing.day === day
      ) {
        return json({ ok: true, duplicate: true });
      }
    }

    const key = `exp-${now}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, { day, paidBy, desc, amount, split, ts: now });

    return json({ ok: true });
  } catch (err) {
    return json({ error: "Could not save expense: " + err.message }, 500);
  }
};
