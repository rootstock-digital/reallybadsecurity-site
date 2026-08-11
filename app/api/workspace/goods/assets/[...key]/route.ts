import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as { GOODS_ASSETS?: { get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null> } }).GOODS_ASSETS;
  if (!bucket) return new NextResponse("Asset storage is not configured.", { status: 503 });
  const { key } = await context.params;
  const object = await bucket.get(key.join("/"));
  if (!object) return new NextResponse("Not found.", { status: 404 });
  return new NextResponse(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream", "Cache-Control": "private, max-age=31536000, immutable" } });
}
