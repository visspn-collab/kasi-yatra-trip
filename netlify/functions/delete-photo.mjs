import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const ADMIN_PIN = "2026"; // keep in sync with the other admin functions

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    if (body.pin !== ADMIN_PIN) return json({ error: "Not authorized" }, 403);

    const id = (body.id || "").trim();
    if (!id) return json({ error: "Missing id" }, 400);

    const store = getStore("photos");
    await store.delete(id);
    return json({ ok: true });
  } catch (err) {
    return json({ error: "Could not delete photo: " + err.message }, 500);
  }
};
