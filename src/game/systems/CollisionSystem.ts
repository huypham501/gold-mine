import type { CollectibleInstance } from "@/game/systems/SpawnSystem";

export function findAttachedTarget(
  hookX: number,
  hookY: number,
  collectibles: CollectibleInstance[],
): CollectibleInstance | null {
  let winner: CollectibleInstance | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const item of collectibles) {
    const dx = item.x - hookX;
    const dy = item.y - hookY;
    const distSq = dx * dx + dy * dy;
    const hitDistance = item.radius + 8;
    if (distSq <= hitDistance * hitDistance && distSq < bestDistance) {
      winner = item;
      bestDistance = distSq;
    }
  }
  return winner;
}
