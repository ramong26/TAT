export default function GameBoard() {
  const rows = 20;
  const cols = 10;
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );

  return (
    <div className="relative bg-[#0c1610] border-2 border-green-400 rounded-2xl shadow-[0_0_32px_#00ff00bb] p-4 flex flex-col items-center transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl border-4 border-green-400 opacity-20 pointer-events-none blur-[2px] z-0" />
      <div
        className={`relative grid gap-0.5 z-10`}
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {board.flat().map((cell, idx) => (
          <div
            key={idx}
            className={`w-5 h-5 border border-green-900 rounded-xs transition-colors duration-200`}
            style={{
              background: cell ? cell : "#111",
            }}
          />
        ))}
      </div>
    </div>
  );
}
