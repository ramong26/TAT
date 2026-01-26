import type { PlayerPanelProps } from "./type";

import GameBoard from "@/feature/GameBoard";

export default function PlayerPanel({
  mode,
  title,
  ready,
  score,
  name,
  onReadyChange,
  countdown,
}: PlayerPanelProps) {
  // Countdown display logic
  const countdownDisplay = () => {
    if (countdown === null && mode === "MULTI") return "waiting...";
    else if (countdown !== null && countdown > 0)
      return `Game starts in ${countdown}...`;
    else if (countdown === 0) return <GameBoard />;
  };

  // Display based on mode
  const modeDisplay = () => {
    if (mode === "SINGLE")
      return (
        <>
          <button
            className="text-[#00ff00] font-extrabold text-5xl md:text-6xl opacity-80 hover:opacity-100 transition-opacity duration-300 border-2 border-green-500 rounded-lg px-10 py-4 hover:shadow-[0_0_16px_#00ff00] bg-black/60 mb-4"
            onClick={() => onReadyChange(true)}
          >
            [ START ]
          </button>
          <span className="text-green-300 font-mono text-xl md:text-2xl">
            Click to Start
          </span>
        </>
      );
    else
      return (
        <button
          className="text-[#00ff00] font-extrabold text-5xl md:text-6xl opacity-80 hover:opacity-100 transition-opacity duration-300 border-2 border-green-500 rounded-lg px-10 py-4 hover:shadow-[0_0_16px_#00ff00] bg-black/60"
          onClick={() => onReadyChange(true)}
        >
          [ READY! ]
        </button>
      );
  };

  return (
    <div
      className={`relative bg-[#0c1610] border-2 border-green-400 rounded-2xl shadow-[0_0_32px_#00ff00bb] px-10 py-8 flex flex-col items-center transition-all duration-300`}
    >
      <div className="absolute inset-0 rounded-2xl border-4 border-green-400 opacity-20 pointer-events-none blur-[2px] z-0" />
      <h1 className="relative z-10 text-3xl md:text-4xl font-bold font-mono text-[#00ff00] drop-shadow-[0_0_10px_#00ff00] mb-4 text-center tracking-widest">
        {title}
        <span className="block text-lg md:text-xl text-green-300 mt-1">
          {name}
        </span>
      </h1>
      <div
        className={`relative h-full  bg-black  border-green-700 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-[0_0_16px_#00ff0033] ${countdown === 0 ? "w-fit border-2" : "w-full h-120 md:h-150"}`}
      >
        {!ready ? (
          modeDisplay()
        ) : (
          <span className="text-[#00ff00] font-mono text-2xl ">
            {countdownDisplay()}
          </span>
        )}
      </div>
      <div className="flex gap-8 w-full justify-between">
        <div className="flex flex-col items-start">
          <span className="text-green-400 font-mono text-base md:text-lg mb-1">
            SCORE
          </span>
          <span className="text-[#00ff00] font-mono text-xl md:text-2xl tracking-widest">
            {score.toString().padStart(6, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
