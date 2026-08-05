import type { EditorialD1Database } from "./editorial-admin.d1";
import type { EditorialActor, EditorialIdentity, EditorialRole } from "./editorial-admin.types";

type AccessConfig = Readonly<{ teamDomain: string; audience: string }>;
type AccessEnvironment = Readonly<{
  EDITORIAL_ACCESS_TEAM_DOMAIN?: string;
  EDITORIAL_ACCESS_AUDIENCE?: string;
}>;
type AccessJwtHeader = Readonly<{ alg?: string; kid?: string }>;
type AccessJwtPayload = Readonly<{
  sub?: string;
  email?: string;
  name?: string;
  iss?: string;
  aud?: string | readonly string[];
  exp?: number;
}>;
type AccessJwk = JsonWebKey & Readonly<{ kid?: string; alg?: string; use?: string }>;

let cachedKeys: Readonly<{ expiresAt: number; keys: readonly AccessJwk[] }> | undefined;

export async function getVerifiedEditorialActor(
  requestHeaders: Headers,
  database: EditorialD1Database,
  config = getAccessConfig(),
): Promise<EditorialActor | null> {
  const identity = await getVerifiedEditorialIdentity(requestHeaders, config);
  if (!identity) return null;
  const membership = await database.prepare(`
    SELECT role FROM editorial_members WHERE subject = ?
  `).bind(identity.subject).first<Readonly<{ role: EditorialRole }>>();
  if (!membership || !isEditorialRole(membership.role)) return null;

  return {
    subject: identity.subject,
    email: identity.email,
    displayName: identity.displayName,
    roles: [membership.role],
  };
}

export async function getVerifiedEditorialIdentity(
  requestHeaders: Headers,
  config = getAccessConfig(),
): Promise<EditorialIdentity | null> {
  if (!config) return null;
  const token = requestHeaders.get("cf-access-jwt-assertion");
  if (!token) return null;
  return verifyCloudflareAccessJwt(token, config);
}

export function getAccessConfig(environment: AccessEnvironment = process.env as AccessEnvironment): AccessConfig | null {
  const teamDomain = environment.EDITORIAL_ACCESS_TEAM_DOMAIN?.replace(/\/$/u, "");
  const audience = environment.EDITORIAL_ACCESS_AUDIENCE?.trim();
  if (!teamDomain || !audience || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/iu.test(teamDomain)) {
    return null;
  }
  return { teamDomain, audience };
}

async function verifyCloudflareAccessJwt(
  token: string,
  config: AccessConfig,
): Promise<EditorialIdentity | null> {
  const [encodedHeader, encodedPayload, encodedSignature, ...extra] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature || extra.length > 0) return null;
  const header = decodeJson<AccessJwtHeader>(encodedHeader);
  const payload = decodeJson<AccessJwtPayload>(encodedPayload);
  if (!header || !payload || header.alg !== "RS256" || !header.kid) return null;
  if (payload.iss !== config.teamDomain || !matchesAudience(payload.aud, config.audience) || !isUnexpired(payload.exp)) return null;
  if (typeof payload.sub !== "string" || !payload.sub.trim()) return null;

  const key = (await getAccessKeys(config.teamDomain)).find((candidate) => candidate.kid === header.kid);
  if (!key || key.alg && key.alg !== "RS256") return null;
  try {
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      toArrayBuffer(base64UrlBytes(encodedSignature)),
      toArrayBuffer(new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)),
    );
    if (!valid) return null;
  } catch {
    return null;
  }

  return {
    subject: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    displayName: typeof payload.name === "string" ? payload.name : undefined,
  };
}

async function getAccessKeys(teamDomain: string): Promise<readonly AccessJwk[]> {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  const response = await fetch(`${teamDomain}/cdn-cgi/access/certs`, { cache: "no-store" });
  if (!response.ok) throw new Error("Cloudflare Access signing keys are unavailable.");
  const value = await response.json() as Readonly<{ keys?: readonly AccessJwk[] }>;
  if (!Array.isArray(value.keys)) throw new Error("Cloudflare Access signing keys are malformed.");
  cachedKeys = { keys: value.keys, expiresAt: Date.now() + 60 * 60 * 1000 };
  return value.keys;
}

function decodeJson<T>(value: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlBytes(value))) as T;
  } catch {
    return null;
  }
}

function base64UrlBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(value.byteLength);
  copy.set(value);
  return copy.buffer;
}

function matchesAudience(value: AccessJwtPayload["aud"], expected: string): boolean {
  return Array.isArray(value) ? value.includes(expected) : value === expected;
}

function isUnexpired(value: number | undefined): boolean {
  return typeof value === "number" && value > Math.floor(Date.now() / 1000);
}

function isEditorialRole(value: string): value is EditorialRole {
  return value === "writer" || value === "reviewer" || value === "publisher" || value === "admin";
}
