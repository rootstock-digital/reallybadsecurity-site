import { createEditorialConfig } from "../modules/editorial/editorial.config";

export const rbsEditorialConfig = createEditorialConfig({
  segment: "security-signals",
  label: "Security Signals",
  accessibility: {
    linkTextSeverity: "warning",
    requireMediaCaptions: false,
    requireMediaCredits: false,
  },
});

export const rbsEditorialSite = {
  origin: "https://reallybadsecurity.com",
  publisher: { name: "Really Bad Security", url: "https://reallybadsecurity.com" },
  author: { id: "really-bad-security", name: "Really Bad Security" },
  factualFormats: ["explainer", "security-analysis"] as const,
  lenses: ["security", "internet", "goods"] as const,
};

export const rbsEditorialSchemaOptions = {
  factualFormats: rbsEditorialSite.factualFormats,
};
