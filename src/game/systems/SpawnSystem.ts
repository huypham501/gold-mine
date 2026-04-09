import { Graphics } from "pixi.js";
import { ITEM_CONFIGS } from "@/game/data/items";
import type { LevelConfig } from "@/game/types/level";
import type { ItemKind } from "@/game/types/item";
import { randomInRange } from "@/game/utils/random";

export interface CollectibleInstance {
  id: string;
  kind: ItemKind;
  value: number;
  weight: number;
  radius: number;
  sprite: Graphics;
  x: number;
  y: number;
  moveSpeed: number;
  moveDir: 1 | -1;
}

let idCounter = 0;

export function spawnCollectibles(level: LevelConfig, width: number, height: number): CollectibleInstance[] {
  const result: CollectibleInstance[] = [];
  let moversPlaced = 0;
  for (const entry of level.spawnTable) {
    const config = ITEM_CONFIGS[entry.kind];
    for (let i = 0; i < entry.count; i += 1) {
      const sprite = new Graphics();
      sprite.circle(0, 0, config.radius).fill(config.color);
      const x = randomInRange(config.radius + 30, width - config.radius - 30);
      const y = randomInRange(height * 0.42, height - 42);
      sprite.position.set(x, y);
      const isMover = moversPlaced < level.movingTargets && (entry.kind === "gold_small" || entry.kind === "bag");
      if (isMover) {
        moversPlaced += 1;
      }
      result.push({
        id: `${entry.kind}-${idCounter}`,
        kind: entry.kind,
        value: config.value,
        weight: config.weight,
        radius: config.radius,
        sprite,
        x,
        y,
        moveSpeed: isMover ? randomInRange(50, 100) : 0,
        moveDir: Math.random() > 0.5 ? 1 : -1,
      });
      idCounter += 1;
    }
  }
  return result;
}
