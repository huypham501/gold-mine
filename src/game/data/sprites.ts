import type { ItemKind } from "@/game/types/item";

export const ITEM_SPRITES: Record<ItemKind, string[]> = {
  gold_small: [
    "/assets/game/gold_small_01.png",
    "/assets/game/gold_small_02.png",
    "/assets/game/gold_small_03.png",
  ],
  gold_large: [
    "/assets/game/gold_large_01.png",
    "/assets/game/gold_large_02.png",
  ],
  rock: [
    "/assets/game/rock_01.png",
    "/assets/game/rock_02.png",
  ],
  bag: ["/assets/game/bag_01.png"],
};

export const PRELOAD_TEXTURES = Array.from(new Set(Object.values(ITEM_SPRITES).flat()));
