import { useCallback, useRef, useState, useEffect } from "react";
import useMatrixRain from "@/shared/hooks/useMatrixRain";
import PlayerPanel from "@/feature/PlayerPanel";

const COUNTDOWN_SECONDS = 5;

export default function MultiPlay() {
  // Matrix rain effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain({ canvasRef, speed: 0.05 });

  // Game Play
  const [players, setPlayers] = useState([
    { ready: false, score: 0, name: "Player 1" },
    { ready: false, score: 0, name: "Player 2" },
  ]);

  // Update ready state
  const setPlayerReady = useCallback((index: number, ready: boolean) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ready } : p)),
    );
  }, []);

  const allReady = players.every((player) => player.ready);

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (allReady) {
      let timeLeft = COUNTDOWN_SECONDS;
      setCountdown(timeLeft);

      interval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft <= 0 && interval) {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [allReady]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-black via-[#0c1610] to-[#1a2e1d] flex items-center justify-center overflow-hidden">
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
              mode="MULTI"
              title="MULTI PLAY MODE"
              ready={ready}
              score={score}
              name={name}
              onReadyChange={(newReady) => setPlayerReady(index, newReady)}
              countdown={countdown}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
