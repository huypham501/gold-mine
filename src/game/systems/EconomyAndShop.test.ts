import { describe, expect, it, vi } from "vitest";
import { getPullSpeedMultiplier, resolveItemValue } from "@/game/systems/EconomySystem";
import { buyShopItem } from "@/game/systems/ShopSystem";
import { SHOP_POOL } from "@/game/data/shop";

describe("Economy + Shop", () => {
  it("applies pull speed buff multiplier", () => {
    const multiplier = getPullSpeedMultiplier([
      { sourceId: "a", effectType: "pull_speed_mult", effectValue: 1.2 },
      { sourceId: "b", effectType: "pull_speed_mult", effectValue: 1.1 },
    ]);
    expect(multiplier).toBeCloseTo(1.32, 5);
  });

  it("resolves bag reward using luck bonus", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    const luckyValue = resolveItemValue("bag", 0.2);
    expect(luckyValue).toBe(260);
    vi.restoreAllMocks();
  });

  it("rejects purchase when gold is insufficient", () => {
    const result = buyShopItem(SHOP_POOL[0], 50);
    expect(result.success).toBe(false);
    expect(result.remainingGold).toBe(50);
    expect(result.buff).toBeNull();
  });

  it("deducts gold and returns buff on valid purchase", () => {
    const item = SHOP_POOL[0];
    const result = buyShopItem(item, 500);
    expect(result.success).toBe(true);
    expect(result.remainingGold).toBe(500 - item.cost);
    expect(result.buff?.effectType).toBe(item.effectType);
  });
});
