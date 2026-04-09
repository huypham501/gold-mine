export type ShopEffectType = "pull_speed_mult" | "extra_bag_luck" | "bomb_stock";

export interface ShopItemConfig {
  id: string;
  name: string;
  cost: number;
  effectType: ShopEffectType;
  effectValue: number;
  duration: "next_level";
  description: string;
}

export interface ActiveBuff {
  sourceId: string;
  effectType: ShopEffectType;
  effectValue: number;
}
