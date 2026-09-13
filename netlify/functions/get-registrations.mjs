import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async () => {
  try {
    const store = getStore("registrations");
    const { blobs } = await store.list();
    const entries = [];
    const namesSet = new Set();

    for (const b of blobs) {
      const data = await store.get(b.key, { type: "json" });
      if (data && data.name) {
        entries.push(data);
        namesSet.add(data.name);
      }
    }

    const names = Array.from(namesSet).sort((a, b) => a.localeCompare(b));
    entries.sort((a, b) => (a.ts || 0) - (b.ts || 0));

    return json({ names, entries });
  } catch (err) {
    return json({ error: "Could not load registrations: " + err.message }, 500);
  }
};
