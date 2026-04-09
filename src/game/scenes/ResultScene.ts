import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "@/game/core/SceneManager";
import { createButton } from "@/game/scenes/helpers";

export class ResultScene implements Scene {
  readonly container = new Container();

  constructor(
    width: number,
    height: number,
    message: string,
    totalGold: number,
    onGoHome: () => void,
  ) {
    const bg = new Graphics();
    bg.rect(0, 0, width, height).fill(0x704200);
    this.container.addChild(bg);

    const title = new Text({
      text: "KẾT THÚC RUN",
      style: { fontSize: 60, fontWeight: "900", fill: 0xfff2cc },
    });
    title.anchor.set(0.5);
    title.position.set(width / 2, height / 2 - 120);
    this.container.addChild(title);

    const msg = new Text({
      text: message,
      style: { fontSize: 28, fill: 0xfff2cc, align: "center" },
    });
    msg.anchor.set(0.5);
    msg.position.set(width / 2, height / 2 - 40);
    this.container.addChild(msg);

    const gold = new Text({
      text: `Tổng vàng: ${totalGold}`,
      style: { fontSize: 36, fontWeight: "700", fill: 0xffe066 },
    });
    gold.anchor.set(0.5);
    gold.position.set(width / 2, height / 2 + 20);
    this.container.addChild(gold);

    this.container.addChild(createButton("Về Home", width / 2 - 120, height / 2 + 90, 240, 62, onGoHome));
  }

  onEnter(): void {}

  onExit(): void {}

  update(): void {}
}
