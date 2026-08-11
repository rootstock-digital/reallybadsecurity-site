import type { GoodsAssetStatus } from "./goods.types";

const maxArtworkBytes = 10 * 1024 * 1024;
const acceptedArtworkTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export type GoodsAssetBucket = Readonly<{
  put(key: string, value: ArrayBuffer | ArrayBufferView | Blob | ReadableStream, options?: Readonly<Record<string, unknown>>): Promise<unknown>;
  delete(key: string): Promise<void>;
}>;

export type GoodsUploadedAsset = Readonly<{
  sourceRef: string;
  altText: string;
  status: GoodsAssetStatus;
}>;

export async function storeGoodsArtwork(bucket: GoodsAssetBucket, workflowId: string, file: File): Promise<GoodsUploadedAsset> {
  if (!acceptedArtworkTypes.has(file.type)) throw new Error("Upload a PNG, JPG, WEBP, or SVG artwork file.");
  if (file.size < 1 || file.size > maxArtworkBytes) throw new Error("Artwork must be smaller than 10 MB.");
  const extension = file.name.toLowerCase().split(".").pop() || "bin";
  const key = `goods/${workflowId}/source/${crypto.randomUUID()}.${extension}`;
  await bucket.put(key, file, { httpMetadata: { contentType: file.type, cacheControl: "private, max-age=31536000, immutable" } });
  return { sourceRef: `/api/workspace/goods/assets/${encodeURIComponent(key)}`, altText: file.name.replace(/\.[^.]+$/, "") || "Uploaded product artwork", status: "ready" };
}
