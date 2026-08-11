import { describe, expect, it } from "vitest";

import { createGoodsWorkflowFromPilot } from "./goods.config";

describe("Goods workflow templates", () => {
  it("namespaces cloned asset IDs so a new workflow can be stored safely", () => {
    const workflow = createGoodsWorkflowFromPilot({ id: "goods-test-123", designName: "Test", designCode: "TEST", productTitle: "Test", format: "Tee" });
    expect(workflow.assets.every((asset) => asset.id.startsWith("asset-goods-test-123-"))).toBe(true);
    expect(new Set(workflow.assets.map((asset) => asset.id)).size).toBe(workflow.assets.length);
  });
});
