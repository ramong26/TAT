import { useRef, useState } from "react";
import useMatrixRain from "@/shared/hooks/useMatrixRain";
import PlayerPanel from "@/feature/MultiPlay/PlayerPanel";

export default function MultiPlay() {
  // Matrix rain effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain({ canvasRef, speed: 0.05 });

  // Game Play
  const [players, setPlayers] = useState([
    { ready: false, score: 0, name: "Player 1" },
    { ready: false, score: 0, name: "Player 2" },
  ]);

  const setPlayerReady = (index: number, ready: boolean) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].ready = ready;
    setPlayers(updatedPlayers);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0c1610] to-[#1a2e1d] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <main className="flex flex-col md:flex-row gap-12 md:gap-24 z-10">
        {players.map(({ ready, score, name }, index) => (
          <div
            key={index}
            className={`transition-transform duration-300 border-2 border-green-400 rounded-2xl ${
              ready
                ? "scale-105 shadow-[0_0_32px_#00ff00cc]"
                : "scale-100 shadow-[0_0_16px_#00ff0033]"
            }`}
          >
            <PlayerPanel
              title="MULTI PLAY MODE"
              ready={ready}
              score={score}
              name={name}
              onReadyChange={(newReady) => setPlayerReady(index, newReady)}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
