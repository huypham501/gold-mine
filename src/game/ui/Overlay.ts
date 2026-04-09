import { Container, Graphics, Text } from "pixi.js";

export class Overlay {
  readonly container = new Container();
  private readonly message = new Text({
    text: "",
    style: { fill: 0xffffff, fontSize: 28, fontWeight: "700", align: "center" },
  });

  constructor(width: number, height: number) {
    const dim = new Graphics();
    dim.rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.3 });
    this.container.addChild(dim);
    this.message.anchor.set(0.5);
    this.message.position.set(width / 2, height / 2);
    this.container.addChild(this.message);
    this.container.visible = false;
  }

  show(text: string): void {
    this.message.text = text;
    this.container.visible = true;
  }

  hide(): void {
    this.container.visible = false;
  }
}
