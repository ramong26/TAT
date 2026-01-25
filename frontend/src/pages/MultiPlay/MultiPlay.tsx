import { useRef, useState } from "react";
import useMatrixRain from "@/shared/hooks/useMatrixRain";

export default function MultiPlay() {
  // Matrix rain effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain({ canvasRef, speed: 0.05 });

  // Game Play
  const [firstPlayer, setFirstPlayer] = useState(false);
  const [secondPlayer, setSecondPlayer] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <main className="flex flex-col md:flex-row gap-40 z-10">
        <div className="bg-[#0c1610] z-10 border-2 border-green-500 rounded-lg shadow-[0_0_24px_#00ff00] px-12 py-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-[#00ff00] drop-shadow-[0_0_8px_#00ff00] mb-6 text-center">
            MULTI PLAY MODE
          </h1>
          <div className="w-full h-96 bg-black border border-green-700 rounded-md flex items-center justify-center mb-6">
            {!firstPlayer ? (
              <button
                className="text-[#00ff00] font-extrabold text-6xl opacity-60 hover:opacity-100 transition-opacity duration-300 border-2 border-green-500 rounded-md px-6 py-3 hover:shadow-[0_0_12px_#00ff00]"
                onClick={() => setFirstPlayer(true)}
              >
                [ READY! ]
              </button>
            ) : (
              <span className="text-[#00ff00] font-mono text-2xl">
                waiting...
              </span>
            )}
          </div>
          <div className="flex gap-8 w-full justify-between">
            <div className="flex flex-col items-start">
              <span className="text-green-400 font-mono text-lg mb-2">
                SCORE
              </span>
              <span className="text-[#00ff00] font-mono text-2xl">000000</span>
            </div>
          </div>
        </div>
        <div className="bg-[#0c1610] z-10 border-2 border-green-500 rounded-lg shadow-[0_0_24px_#00ff00] px-12 py-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-[#00ff00] drop-shadow-[0_0_8px_#00ff00] mb-6 text-center">
            MULTI PLAY MODE
          </h1>
          <div className="w-full h-96 bg-black border border-green-700 rounded-md flex items-center justify-center mb-6">
            {!secondPlayer ? (
              <button
                className="text-[#00ff00] font-extrabold text-6xl opacity-60 hover:opacity-100 transition-opacity duration-300 border-2 border-green-500 rounded-md px-6 py-3 hover:shadow-[0_0_12px_#00ff00]"
                onClick={() => setSecondPlayer(true)}
              >
                [ READY! ]
              </button>
            ) : (
              <span className="text-[#00ff00] font-mono text-2xl">
                waiting...
              </span>
            )}
          </div>
          <div className="flex gap-8 w-full justify-between">
            <div className="flex flex-col items-start">
              <span className="text-green-400 font-mono text-lg mb-2">
                SCORE
              </span>
              <span className="text-[#00ff00] font-mono text-2xl">000000</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
