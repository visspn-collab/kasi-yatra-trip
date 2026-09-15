import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async () => {
  try {
    const store = getStore("photos");
    const { blobs } = await store.list();
    const entries = [];

    for (const b of blobs) {
      const { metadata } = await store.getMetadata(b.key);
      if (!metadata) continue;
      entries.push({
        id: b.key,
        uploadedBy: metadata.uploadedBy || "",
        place: metadata.place || "",
        note: metadata.note || "",
        ts: metadata.ts || 0,
      });
    }

    entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return json({ entries });
  } catch (err) {
    return json({ error: "Could not load photos: " + err.message }, 500);
  }
};
