export type ItemKind = "gold_small" | "gold_large" | "rock" | "bag";

export interface ItemConfig {
  kind: ItemKind;
  value: number;
  weight: number;
  radius: number;
  color: number;
  rarity?: number;
}

export interface SpawnEntry {
  kind: ItemKind;
  count: number;
}
