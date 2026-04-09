import { Container, Graphics, Text } from "pixi.js";
import type { Scene } from "@/game/core/SceneManager";
import type { ActiveBuff } from "@/game/types/shop";
import { getShopOffers, buyShopItem } from "@/game/systems/ShopSystem";
import { createButton } from "@/game/scenes/helpers";

export class ShopScene implements Scene {
  readonly container = new Container();
  private gold: number;
  private buffs: ActiveBuff[] = [];
  private readonly goldText: Text;

  constructor(
    width: number,
    height: number,
    initialGold: number,
    onContinue: (remainingGold: number, buffs: ActiveBuff[]) => void,
  ) {
    this.gold = initialGold;

    const bg = new Graphics();
    bg.rect(0, 0, width, height).fill(0x2f3f00);
    this.container.addChild(bg);

    const title = new Text({
      text: "SHOP (1 lượt giữa màn)",
      style: { fontSize: 46, fontWeight: "900", fill: 0xe8f3b7 },
    });
    title.anchor.set(0.5, 0);
    title.position.set(width / 2, 30);
    this.container.addChild(title);

    this.goldText = new Text({
      text: `Gold: ${initialGold}`,
      style: { fontSize: 28, fontWeight: "700", fill: 0xffde7a },
    });
    this.goldText.position.set(40, 95);
    this.container.addChild(this.goldText);

    const offers = getShopOffers();
    offers.forEach((offer, index) => {
      const y = 160 + index * 150;
      const card = new Graphics();
      card.roundRect(40, y, width - 80, 120, 12).fill({ color: 0x6f8b28, alpha: 0.9 });
      this.container.addChild(card);

      const name = new Text({
        text: `${offer.name} - ${offer.cost}G`,
        style: { fontSize: 30, fontWeight: "700", fill: 0xfff6d8 },
      });
      name.position.set(60, y + 14);
      this.container.addChild(name);

      const desc = new Text({
        text: offer.description,
        style: { fontSize: 21, fill: 0xf0f5cc },
      });
      desc.position.set(60, y + 56);
      this.container.addChild(desc);

      const buyButton = createButton("Mua", width - 170, y + 32, 110, 52, () => {
        const result = buyShopItem(offer, this.gold);
        if (!result.success || !result.buff) {
          return;
        }
        this.gold = result.remainingGold;
        this.goldText.text = `Gold: ${this.gold}`;
        this.buffs.push(result.buff);
      });
      this.container.addChild(buyButton);
    });

    const continueBtn = createButton("Vào Màn Kế", width / 2 - 130, height - 90, 260, 60, () => {
      onContinue(this.gold, [...this.buffs]);
    });
    this.container.addChild(continueBtn);
  }

  onEnter(): void {}

  onExit(): void {}

  update(): void {}
}
