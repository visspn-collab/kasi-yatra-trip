import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response("Missing id", { status: 400 });

    const store = getStore("photos");
    const result = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!result || !result.data) return new Response("Not found", { status: 404 });

    const mime = (result.metadata && result.metadata.mime) || "image/jpeg";
    const headers = {
      "content-type": mime,
      "cache-control": "public, max-age=31536000, immutable",
    };
    if (url.searchParams.get("dl") === "1") {
      const rawName = (url.searchParams.get("name") || "kasi-photo").slice(0, 80);
      const safeName = rawName.replace(/[^a-zA-Z0-9 _.-]/g, "").trim() || "kasi-photo";
      headers["content-disposition"] = `attachment; filename="${safeName}.jpg"`;
    }
    return new Response(result.data, { status: 200, headers });
  } catch (err) {
    return new Response("Could not load photo: " + err.message, { status: 500 });
  }
};
