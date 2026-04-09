import type { CollectibleInstance } from "@/game/systems/SpawnSystem";

export function syncCollectibleSprite(instance: CollectibleInstance): void {
  instance.sprite.position.set(instance.x, instance.y);
}
