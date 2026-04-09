import type { ItemConfig, ItemKind } from "@/game/types/item";

export const ITEM_CONFIGS: Record<ItemKind, ItemConfig> = {
  gold_small: {
    kind: "gold_small",
    value: 120,
    weight: 1,
    radius: 14,
    color: 0xffdc00,
    rarity: 0.35,
  },
  gold_large: {
    kind: "gold_large",
    value: 360,
    weight: 4,
    radius: 28,
    color: 0xffb000,
    rarity: 0.12,
  },
  rock: {
    kind: "rock",
    value: 40,
    weight: 3,
    radius: 24,
    color: 0x7a7a7a,
    rarity: 0.45,
  },
  bag: {
    kind: "bag",
    value: 0,
    weight: 2,
    radius: 16,
    color: 0x8b5a2b,
    rarity: 0.08,
  },
};
