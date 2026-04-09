import { Container, Graphics } from "pixi.js";

export class HookEntity {
  readonly container = new Container();
  readonly rope = new Graphics();
  readonly claw = new Graphics();

  constructor() {
    this.container.addChild(this.rope);
    this.container.addChild(this.claw);
    this.drawClaw(0x3b2b0a);
  }

  setPose(originX: number, originY: number, endX: number, endY: number): void {
    this.rope.clear();
    this.rope.moveTo(originX, originY).lineTo(endX, endY).stroke({
      color: 0x2f2f2f,
      width: 3,
      cap: "round",
    });
    this.claw.position.set(endX, endY);
  }

  drawClaw(color: number): void {
    this.claw.clear();
    this.claw.circle(0, 0, 8).fill(color);
  }
}
