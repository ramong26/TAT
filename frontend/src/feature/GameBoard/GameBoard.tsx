export default function GameBoard() {
  const rows = 20;
  const cols = 10;
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );

  return (
    <div className="relative bg-transparent border-3 border-green-400 rounded-xl shadow-[0_0_24px_#00ff00bb] p-2 flex flex-col items-center transition-all duration-300 w-full h-full">
      <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-10 pointer-events-none blur-[1px] z-0" />
      <div
        className="relative grid gap-0.5 z-10"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {board.flat().map((cell, idx) => (
          <div
            key={idx}
            className="w-7 h-7 border border-green-700 rounded-xs bg-transparent"
            style={{
              background: cell ? cell : "rgba(16,28,18,0.7)",
              boxShadow: cell
                ? "0 0 8px #00ff00, 0 0 2px #00ff00"
                : "0 0 2px #00ff0044",
            }}
          />
        ))}
      </div>
    </div>
  );
}
