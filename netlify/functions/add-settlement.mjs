import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const ADMIN_PIN = "2026"; // keep in sync with update-expense.mjs / delete-expense.mjs

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    if (body.pin !== ADMIN_PIN) return json({ error: "Not authorized" }, 403);

    const from = (body.from || "").trim();
    const to = (body.to || "").trim();
    const amount = Number(body.amount);
    const note = (body.note || "").trim().slice(0, 200);

    if (!from || !to || from === to || !(amount > 0)) {
      return json({ error: "Missing or invalid fields" }, 400);
    }

    const store = getStore("settlements");
    const id = `set-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(id, { from, to, amount, note, ts: Date.now() });
    return json({ ok: true, id });
  } catch (err) {
    return json({ error: "Could not record settlement: " + err.message }, 500);
  }
};
