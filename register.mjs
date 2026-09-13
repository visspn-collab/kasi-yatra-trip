import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const arrivalDate = (body.arrivalDate || "").trim();
    if (!name) return json({ error: "Name is required" }, 400);
    if (name.length > 60) return json({ error: "Name is too long" }, 400);

    const store = getStore("registrations");
    const key = `reg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, { name, arrivalDate, ts: Date.now() });

    return json({ ok: true });
  } catch (err) {
    return json({ error: "Could not register: " + err.message }, 500);
  }
};
