import { Graphics, Sprite } from "pixi.js";
import { ITEM_CONFIGS } from "@/game/data/items";
import { ITEM_SPRITES } from "@/game/data/sprites";
import type { LevelConfig } from "@/game/types/level";
import type { ItemKind } from "@/game/types/item";
import { randomInRange } from "@/game/utils/random";

export interface CollectibleInstance {
  id: string;
  kind: ItemKind;
  value: number;
  weight: number;
  radius: number;
  sprite: Graphics | Sprite;
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
      const sprite = createItemSprite(entry.kind, config.radius, config.color);
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

function createItemSprite(kind: ItemKind, radius: number, fallbackColor: number): Graphics | Sprite {
  const options = ITEM_SPRITES[kind] ?? [];
  const pick = options.length > 0 ? options[Math.floor(Math.random() * options.length)] : null;
  if (!pick) {
    const fallback = new Graphics();
    fallback.circle(0, 0, radius).fill(fallbackColor);
    return fallback;
  }

  const sprite = Sprite.from(pick);
  sprite.anchor.set(0.5);
  const size = radius * 2.2;
  const applySize = (): void => {
    const w = sprite.texture.width || 1;
    const h = sprite.texture.height || 1;
    const ratio = size / Math.max(w, h);
    sprite.scale.set(ratio);
  };
  if (sprite.texture.width > 0 && sprite.texture.height > 0) {
    applySize();
  } else {
    sprite.texture.once("update", applySize);
  }
  return sprite;
}
