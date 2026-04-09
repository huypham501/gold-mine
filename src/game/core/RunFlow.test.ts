import { describe, expect, it } from "vitest";
import { RunFlow } from "@/game/core/RunFlow";

describe("RunFlow", () => {
  it("supports gameplay -> shop -> gameplay progression", () => {
    const flow = new RunFlow();
    flow.resetRun();
    let stats = flow.enterShopAfterClear(700);
    expect(stats.screen).toBe("shop");
    expect(stats.totalGold).toBe(700);

    stats = flow.checkoutShop(520, [{ sourceId: "energy_drink", effectType: "pull_speed_mult", effectValue: 1.35 }]);
    expect(stats.pendingBuffs).toHaveLength(1);
    expect(stats.totalGold).toBe(520);

    stats = flow.startNextLevel();
    expect(stats.screen).toBe("gameplay");
    expect(stats.levelIndex).toBe(1);
    expect(stats.activeBuffs).toHaveLength(1);
  });

  it("ends run immediately when level fails", () => {
    const flow = new RunFlow();
    flow.resetRun();
    const stats = flow.failRun(300);
    expect(stats.screen).toBe("result");
    expect(stats.success).toBe(false);
    expect(stats.totalGold).toBe(300);
  });
});
