import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const ADMIN_PIN = "2026"; // change this if you want a different admin PIN

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    if (body.pin !== ADMIN_PIN) return json({ error: "Not authorized" }, 403);

    const id = (body.id || "").trim();
    const day = (body.day || "").trim();
    const paidBy = (body.paidBy || "").trim();
    const desc = (body.desc || "").trim();
    const amount = Number(body.amount);
    const split = Array.isArray(body.split) ? body.split.map(s => String(s).trim()).filter(Boolean) : [];

    if (!id || !day || !paidBy || !desc || !split.length || !(amount >= 0)) {
      return json({ error: "Missing or invalid fields" }, 400);
    }

    const store = getStore("expenses");
    const existing = await store.get(id, { type: "json" });
    if (!existing) return json({ error: "Expense not found" }, 404);

    await store.setJSON(id, { day, paidBy, desc, amount, split, ts: existing.ts });
    return json({ ok: true });
  } catch (err) {
    return json({ error: "Could not update expense: " + err.message }, 500);
  }
};
