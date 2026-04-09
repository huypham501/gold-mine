"use client";

import { useEffect, useRef } from "react";
import { GameApp } from "@/game/core/GameApp";

export function GameCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    const gameApp = new GameApp();
    void gameApp.mount(host);

    return () => {
      gameApp.destroy();
    };
  }, []);

  return <div ref={hostRef} className="game-canvas-host" />;
}
