import { useCallback, useEffect, useState } from "react";
import { getRandomTetromino } from "./tetromino";

export default function GameBoard() {
  const rows = 20;
  const cols = 10;
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  );

  const [currentTetromino, setCurrentTetromino] =
    useState(getRandomTetromino());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Is collision detection
  const isCollision = useCallback(
    (x: number, y: number, rot: number) => {
      const shape = currentTetromino.shape[rot];
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const boardX = x + c;
            const boardY = y + r;
            if (
              boardX < 0 ||
              boardX >= cols ||
              boardY >= rows ||
              (boardY >= 0 && board[boardY][boardX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [currentTetromino, board],
  );

  // Fix tetromino to the board
  const fixTetromino = useCallback(() => {
    setBoard((prev) => {
      const newBoard = prev.map((row) => [...row]);
      const shape = currentTetromino.shape[rotation];
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const boardY = position.y + r;
            const boardX = position.x + c;
            if (boardY >= 0 && boardY < rows && boardX >= 0 && boardX < cols) {
              newBoard[boardY][boardX] = currentTetromino.color;
            }
          }
        }
      }
      return newBoard;
    });
  }, [currentTetromino, position, rotation]);

  // Automatic block descent and fixation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCollision(position.x, position.y + 1, rotation)) {
        fixTetromino();
        setCurrentTetromino(getRandomTetromino());
        setPosition({ x: 3, y: 0 });
        setRotation(0);
      } else {
        setPosition((prev) => ({ x: prev.x, y: prev.y + 1 }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [position, rotation, isCollision, fixTetromino]);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (!isCollision(position.x - 1, position.y, rotation)) {
          setPosition((prev) => ({ x: prev.x - 1, y: prev.y }));
        }
      } else if (e.key === "ArrowRight") {
        if (!isCollision(position.x + 1, position.y, rotation)) {
          setPosition((prev) => ({ x: prev.x + 1, y: prev.y }));
        }
      } else if (e.key === "ArrowDown" || e.key === " ") {
        if (!isCollision(position.x, position.y + 1, rotation)) {
          setPosition((prev) => ({ x: prev.x, y: prev.y + 1 }));
        }
      } else if (e.key === "ArrowUp") {
        const nextRotation = (rotation + 1) % currentTetromino.shape.length;
        if (!isCollision(position.x, position.y, nextRotation)) {
          setRotation(nextRotation);
        }
      }
    },
    [position, rotation, isCollision, currentTetromino.shape.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Merge current tetromino with the board for display
  const displayBoard = board.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      const shape = currentTetromino.shape[rotation];
      const tRow = rowIdx - position.y;
      const tCol = colIdx - position.x;
      if (
        tRow >= 0 &&
        tCol >= 0 &&
        tRow < shape.length &&
        tCol < shape[0].length &&
        shape[tRow][tCol]
      ) {
        return currentTetromino.color;
      }
      return cell;
    }),
  );

  return (
    <div className="relative bg-transparent border-2 border-green-400 rounded-xl shadow-[0_0_24px_#00ff00bb] p-2 flex flex-col items-center transition-all duration-300 w-full h-full">
      <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-10 pointer-events-none blur-[1px] z-0" />
      <div
        className="relative grid gap-0.5 z-10"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {displayBoard.flat().map((cell, idx) => (
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
