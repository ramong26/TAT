import { useCallback, useEffect, useState } from "react";
import { getRandomTetromino } from "./tetromino";
import type { FallingTetromino } from "@/types/types";

export default function GameBoard() {
  const rows = 20;
  const cols = 10;
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  );

  // Collision detection
  const isCollision = useCallback(
    (
      tetromino: FallingTetromino,
      newPosition: { x: number; y: number },
      rotationIndex: number,
      board: (string | null)[][],
      rows: number,
      cols: number,
    ): boolean => {
      const shape = tetromino.tetromino.shape[rotationIndex];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = newPosition.y + y;
            const boardX = newPosition.x + x;
            if (
              boardY >= rows ||
              boardX < 0 ||
              boardX >= cols ||
              (boardY >= 0 && board[boardY][boardX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [],
  );

  // Initialize falling tetromino
  const fallingTetrominoInitial = useCallback(
    (): FallingTetromino => ({
      tetromino: getRandomTetromino(),
      position: { x: Math.floor(cols / 2) - 1, y: 0 },
      rotationIndex: 0,
    }),
    [cols],
  );

  const [fallingTetromino, setFallingTetromino] =
    useState<FallingTetromino | null>(fallingTetrominoInitial());
  const [gameover, setGameover] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingTetromino((prev) => {
        if (!prev) {
          return fallingTetrominoInitial();
        }
        const { tetromino, position, rotationIndex } = prev;
        const shape = tetromino.shape[rotationIndex];
        const newY = position.y + 1;

        const collision = isCollision(
          prev,
          { x: position.x, y: newY },
          rotationIndex,
          board,
          rows,
          cols,
        );

        // If collision, lock the tetromino and spawn a new one
        if (collision) {
          const newBoard = board.map((row) => [...row]);
          shape.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell) {
                const boardY = position.y + y;
                const boardX = position.x + x;
                if (
                  boardY >= 0 &&
                  boardY < rows &&
                  boardX >= 0 &&
                  boardX < cols
                ) {
                  newBoard[boardY][boardX] = tetromino.color;
                }
              }
            });
          });
          setBoard(newBoard);
          const nextTetromino = fallingTetrominoInitial();
          const nextShape = nextTetromino.tetromino.shape[0];
          let gameOverCollision = false;
          nextShape.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell) {
                const boardY = nextTetromino.position.y + y;
                const boardX = nextTetromino.position.x + x;
                if (
                  boardY >= 0 &&
                  boardY < rows &&
                  boardX >= 0 &&
                  boardX < cols &&
                  newBoard[boardY][boardX]
                ) {
                  gameOverCollision = true;
                }
              }
            });
          });
          if (gameOverCollision) {
            setGameover(true);
            return null;
          }
          return nextTetromino;
        }

        return {
          ...prev,
          position: { x: position.x, y: newY },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fallingTetromino, board, isCollision, fallingTetrominoInitial]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (!fallingTetromino) return;
      const { tetromino, position, rotationIndex } = fallingTetromino;
      const newPosition = { ...position };
      let newRotationIndex = rotationIndex;

      if (e.key === "ArrowLeft") {
        newPosition.x -= 1;
      } else if (e.key === "ArrowRight") {
        newPosition.x += 1;
      } else if (e.key === "ArrowDown") {
        newPosition.y += 1;
      } else if (e.key === "ArrowUp") {
        newRotationIndex = (rotationIndex + 1) % tetromino.shape.length;
      }

      if (
        !isCollision(
          fallingTetromino,
          newPosition,
          newRotationIndex,
          board,
          rows,
          cols,
        )
      ) {
        setFallingTetromino({
          tetromino: fallingTetromino.tetromino,
          position: newPosition,
          rotationIndex: newRotationIndex,
        });
      }
    },
    [fallingTetromino, board, isCollision],
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Render the board with the falling tetromino
  const displayBoard = board.map((row) => [...row]);

  if (fallingTetromino) {
    const { tetromino, position, rotationIndex } = fallingTetromino;
    const shape = tetromino.shape[rotationIndex];
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = position.y + y;
          const boardX = position.x + x;

          if (boardY >= 0 && boardY < rows && boardX >= 0 && boardX < cols) {
            displayBoard[boardY][boardX] = tetromino.color;
          }
        }
      });
    });
  }

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
