const routeSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const knownApplicationRouteSegments = [
  "about",
  "api",
  "contact",
  "privacy",
  "services",
  "terms",
] as const;

export type EditorialConfig = Readonly<{
  segment: string;
  label: string;
  pageSize: number;
  accessibility: EditorialAccessibilityConfig;
}>;

export type EditorialAccessibilityConfig = Readonly<{
  linkTextSeverity: "off" | "warning" | "error";
  requireMediaCaptions: boolean;
  requireMediaCredits: boolean;
}>;

export type EditorialConfigInput = Readonly<{
  segment?: string;
  label?: string;
  pageSize?: number;
  accessibility?: Partial<EditorialAccessibilityConfig>;
}>;

export function createEditorialConfig(
  config: EditorialConfigInput = {},
): EditorialConfig {
  const segment = (config.segment ?? "security-signals").trim();
  const label = (config.label ?? "Security Signals").trim();
  const pageSize = config.pageSize ?? 12;
  const accessibility = {
    linkTextSeverity: config.accessibility?.linkTextSeverity ?? "warning",
    requireMediaCaptions: config.accessibility?.requireMediaCaptions ?? false,
    requireMediaCredits: config.accessibility?.requireMediaCredits ?? false,
  };

  if (!routeSegmentPattern.test(segment)) {
    throw new Error("Editorial route segment must be lower-case kebab-case.");
  }
  if (knownApplicationRouteSegments.includes(segment as never)) {
    throw new Error(
      `Editorial route segment \"${segment}\" collides with an application route.`,
    );
  }
  if (!label) {
    throw new Error("Editorial label must be a non-empty string.");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("Editorial page size must be an integer from 1 through 100.");
  }
  if (!(["off", "warning", "error"] as const).includes(accessibility.linkTextSeverity)) {
    throw new Error("Editorial link-text severity must be off, warning, or error.");
  }

  return Object.freeze({ segment, label, pageSize, accessibility });
}
