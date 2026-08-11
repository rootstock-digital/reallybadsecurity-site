import { describe, expect, it } from "vitest";

import { assertGoodsReadyForShopifyDraft, assertGoodsReadyToPublish, assertGoodsTransition, assertGoodsWritePermission, getAllowedGoodsTransitions } from "./goods.policy";

const actor = (roles: readonly ("writer" | "reviewer" | "publisher" | "admin")[]) => ({ subject: "test-subject", roles });

describe("Goods authorization policy", () => {
  it("allows only publisher and admin roles to write", () => {
    expect(() => assertGoodsWritePermission(actor(["publisher"]))).not.toThrow();
    expect(() => assertGoodsWritePermission(actor(["admin"]))).not.toThrow();
    expect(() => assertGoodsWritePermission(actor(["writer"]))).toThrow("permission");
  });

  it("allows only the defined workflow transitions", () => {
    expect(getAllowedGoodsTransitions("draft")).toEqual(["in_review"]);
    expect(() => assertGoodsTransition("draft", "approved")).toThrow("cannot move");
    expect(() => assertGoodsTransition("approved", "published")).not.toThrow();
    expect(() => assertGoodsTransition("published", "draft")).toThrow("cannot move");
  });

  it("requires every required gate before publication", () => {
    const gates = [{ id: "design", label: "Design", required: true, status: "passed" as const }, { id: "sample", label: "Sample", required: true, status: "not_started" as const }];
    expect(() => assertGoodsReadyToPublish({ approvalGates: gates })).toThrow("Every required approval gate");
    expect(() => assertGoodsReadyToPublish({ approvalGates: gates.map((gate) => ({ ...gate, status: "passed" as const })) })).not.toThrow();
  });

  it("does not require the Shopify verification or publication gates before draft creation", () => {
    const gates = [
      { id: "design", label: "Design", required: true, status: "passed" as const },
      { id: "mockup", label: "Mockup", required: true, status: "passed" as const },
      { id: "sample", label: "Sample", required: true, status: "passed" as const },
      { id: "shopify", label: "Shopify", required: true, status: "not_started" as const },
      { id: "publish", label: "Publish", required: true, status: "not_started" as const },
    ];
    expect(() => assertGoodsReadyForShopifyDraft({ approvalGates: gates })).not.toThrow();
  });
});
