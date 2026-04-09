import { Container, Graphics, Text } from "pixi.js";

export function createButton(
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  onTap: () => void,
): Container {
  const holder = new Container();
  holder.position.set(x, y);
  holder.eventMode = "static";
  holder.cursor = "pointer";

  const bg = new Graphics();
  bg.roundRect(0, 0, width, height, 10).fill(0x5b3d00);
  holder.addChild(bg);

  const text = new Text({
    text: label,
    style: {
      fill: 0xfff8da,
      fontSize: 22,
      fontWeight: "700",
      align: "center",
    },
  });
  text.anchor.set(0.5);
  text.position.set(width / 2, height / 2);
  holder.addChild(text);

  holder.on("pointertap", onTap);
  return holder;
}
