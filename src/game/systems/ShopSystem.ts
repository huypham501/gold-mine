import { SHOP_POOL } from "@/game/data/shop";
import type { ActiveBuff, ShopItemConfig } from "@/game/types/shop";
import { pickRandomDistinct } from "@/game/utils/random";

export function getShopOffers(): ShopItemConfig[] {
  return pickRandomDistinct(SHOP_POOL, 3);
}

export function buyShopItem(
  item: ShopItemConfig,
  availableGold: number,
): { success: boolean; remainingGold: number; buff: ActiveBuff | null } {
  if (availableGold < item.cost) {
    return {
      success: false,
      remainingGold: availableGold,
      buff: null,
    };
  }
  return {
    success: true,
    remainingGold: availableGold - item.cost,
    buff: {
      sourceId: item.id,
      effectType: item.effectType,
      effectValue: item.effectValue,
    },
  };
}
