import type { ItemKind } from "@/game/types/item";
import type { ActiveBuff } from "@/game/types/shop";

export function resolveItemValue(kind: ItemKind, bagLuckBonus: number): number {
  if (kind !== "bag") {
    return 0;
  }
  const roll = Math.random();
  if (roll < 0.25 + bagLuckBonus) {
    return 260;
  }
  if (roll < 0.7 + bagLuckBonus * 0.5) {
    return 140;
  }
  return 60;
}

export function getPullSpeedMultiplier(buffs: ActiveBuff[]): number {
  return buffs
    .filter((buff) => buff.effectType === "pull_speed_mult")
    .reduce((acc, buff) => acc * buff.effectValue, 1);
}

export function getBagLuckBonus(buffs: ActiveBuff[]): number {
  return buffs
    .filter((buff) => buff.effectType === "extra_bag_luck")
    .reduce((acc, buff) => acc + buff.effectValue, 0);
}

export function getBombStock(buffs: ActiveBuff[]): number {
  return buffs
    .filter((buff) => buff.effectType === "bomb_stock")
    .reduce((acc, buff) => acc + Math.floor(buff.effectValue), 0);
}
