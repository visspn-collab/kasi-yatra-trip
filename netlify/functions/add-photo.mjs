import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const MAX_BYTES = 6 * 1024 * 1024; // stay safely under Netlify's ~6MB function body limit

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "Missing file" }, 400);

    const uploadedBy = (form.get("uploadedBy") || "").toString().trim().slice(0, 60);
    const place = (form.get("place") || "").toString().trim().slice(0, 100);
    const note = (form.get("note") || "").toString().trim().slice(0, 200);
    if (!uploadedBy) return json({ error: "Missing uploadedBy" }, 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength === 0) return json({ error: "Empty file" }, 400);
    if (bytes.byteLength > MAX_BYTES) return json({ error: "Photo is too large after compression" }, 400);

    const mime = file.type || "image/jpeg";
    const ts = Date.now();
    const id = `photo-${ts}-${Math.random().toString(36).slice(2, 8)}`;

    const store = getStore("photos");
    await store.set(id, bytes, {
      metadata: { uploadedBy, place, note, ts, mime },
    });

    return json({ ok: true, id });
  } catch (err) {
    return json({ error: "Could not upload photo: " + err.message }, 500);
  }
};
