import { useCallback, useRef, useState, useEffect } from "react";

import PlayerPanel from "@/feature/PlayerPanel/PlayerPanel";

import useMatrixRain from "@/shared/hooks/useMatrixRain";

export default function SinglePlay() {
  // Matrix rain effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain({ canvasRef, speed: 0.05 });

  // Game Play
  const [players, setPlayers] = useState({
    ready: false,
    score: 0,
    name: "Player 1",
  });

  // Update ready state
  const setPlayerReady = useCallback((ready: boolean) => {
    setPlayers((prev) => ({ ...prev, ready }));
  }, []);

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (players.ready) {
      let timeLeft = 5;
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
  }, [players.ready]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <PlayerPanel
        mode="SINGLE"
        title="SINGLE PLAY MODE"
        ready={players.ready}
        score={players.score}
        name={players.name}
        onReadyChange={(newReady) => setPlayerReady(newReady)}
        countdown={countdown}
      />
    </div>
  );
}
