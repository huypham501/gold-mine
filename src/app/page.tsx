import { GameCanvas } from "@/components/GameCanvas";

export default function Home() {
  return (
    <main>
      <div className="game-shell">
        <GameCanvas />
      </div>
    </main>
  );
}
