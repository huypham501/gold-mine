export interface PlayerEntity {
  x: number;
  y: number;
}

export function createPlayer(x: number, y: number): PlayerEntity {
  return { x, y };
}
