import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "@/game/core/SceneManager";
import { createButton } from "@/game/scenes/helpers";

export class HomeScene implements Scene {
  readonly container = new Container();

  constructor(
    width: number,
    height: number,
    onStart: () => void,
  ) {
    const bg = new Graphics();
    bg.rect(0, 0, width, height).fill(0xffd773);
    this.container.addChild(bg);

    const title = new Text({
      text: "ĐÀO VÀNG MVP",
      style: { fontSize: 64, fontWeight: "900", fill: 0x4a2f00 },
    });
    title.anchor.set(0.5);
    title.position.set(width / 2, height / 2 - 110);
    this.container.addChild(title);

    const guide = new Text({
      text: "Tap/Click/Space để thả móc\nB để phá vật phẩm đang kéo (nếu có thuốc nổ)",
      style: { fontSize: 24, fill: 0x5a3c00, align: "center" },
    });
    guide.anchor.set(0.5);
    guide.position.set(width / 2, height / 2 - 10);
    this.container.addChild(guide);

    const button = createButton("Bắt Đầu Run", width / 2 - 120, height / 2 + 90, 240, 64, onStart);
    this.container.addChild(button);
  }

  onEnter(): void {}

  onExit(): void {}

  update(): void {}
}
