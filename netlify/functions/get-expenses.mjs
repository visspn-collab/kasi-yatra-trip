import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async () => {
  try {
    const store = getStore("expenses");
    const { blobs } = await store.list();
    const entries = [];

    for (const b of blobs) {
      const data = await store.get(b.key, { type: "json" });
      if (data) entries.push({ id: b.key, ...data });
    }

    entries.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    return json({ entries });
  } catch (err) {
    return json({ error: "Could not load expenses: " + err.message }, 500);
  }
};
