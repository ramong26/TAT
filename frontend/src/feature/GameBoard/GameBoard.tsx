import { useCallback, useEffect, useState } from "react";

import { getRandomTetromino } from "./tetromino";

import type { FallingTetromino } from "@/types/types";
import type { GameBoardProps } from "./type";

export default function GameBoard({
  mode,
  controlScheme = "ARROWS",
}: GameBoardProps) {
  const rows = 20;
  const cols = 10;
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  );

  // Game Score and Stats
  const [score, setScore] = useState(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [backToBack, setBackToBack] = useState(false);

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

          // Clear full rows
          const nonFullRows = newBoard.filter((row) =>
            row.some((cell) => cell === null),
          );
          const clearedRows = rows - nonFullRows.length;
          for (let i = 0; i < clearedRows; i++) {
            nonFullRows.unshift(Array.from({ length: cols }, () => null));
          }

          const clearedBoard = nonFullRows;
          setBoard(clearedBoard);

          if (clearedRows > 0) {
            const basePointsMap: Record<number, number> = {
              1: 40,
              2: 100,
              3: 300,
              4: 1200,
            };
            const basePoints = basePointsMap[clearedRows] ?? 0;
            let pointsEarned = basePoints;

            if (clearedRows === 4) {
              if (backToBack) {
                pointsEarned = Math.floor(basePoints * 1.5);
              }
              setBackToBack(true);
            } else {
              setBackToBack(false);
            }

            setComboCount((prevCombo) => {
              const newCombo = prevCombo + 1;
              const comboBonus = newCombo > 1 ? (newCombo - 1) * 50 : 0;
              pointsEarned += comboBonus;
              return newCombo;
            });

            setScore((prevScore) => prevScore + pointsEarned);
            setTotalLinesCleared((prev) => prev + clearedRows);
          } else {
            setComboCount(0);
          }

          // setBoard(newBoard);
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
  }, [board, isCollision, fallingTetrominoInitial, backToBack]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const pressed = String(e.key).toLowerCase();

      if (gameover) {
        if (mode === "SINGLE" && pressed === "r") {
          setBoard(
            Array.from({ length: rows }, () =>
              Array.from({ length: cols }, () => null),
            ),
          );
          setScore(0);
          setTotalLinesCleared(0);
          setComboCount(0);
          setBackToBack(false);
          setGameover(false);
          setFallingTetromino(fallingTetrominoInitial());
        }
        return;
      }

      if (!fallingTetromino) return;

      const keyMap =
        controlScheme === "WASD"
          ? { left: "a", right: "d", down: "s", rotate: "w" }
          : {
              left: "arrowleft",
              right: "arrowright",
              down: "arrowdown",
              rotate: "arrowup",
            };

      const { tetromino, position, rotationIndex } = fallingTetromino;
      const newPosition = { ...position };
      let newRotationIndex = rotationIndex;

      if (pressed === keyMap.left) {
        newPosition.x -= 1;
      } else if (pressed === keyMap.right) {
        newPosition.x += 1;
      } else if (pressed === keyMap.down) {
        newPosition.y += 1;
      } else if (pressed === keyMap.rotate) {
        newRotationIndex = (rotationIndex + 1) % tetromino.shape.length;
      } else {
        return;
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
    [
      fallingTetromino,
      board,
      isCollision,
      gameover,
      fallingTetrominoInitial,
      mode,
      controlScheme,
      rows,
      cols,
    ],
  );

  useEffect(() => {
    if (mode !== "SINGLE" && mode !== "MULTI") return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, mode]);

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

      {/* score / HUD */}
      <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-green-100 border border-green-600">
        <div className="font-semibold">SCORE</div>
        <div className="text-lg font-bold">{score}</div>
        <div className="mt-1 text-xs">LINES {totalLinesCleared}</div>
        <div className="text-xs">COMBO {comboCount}</div>
      </div>

      {gameover && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none rounded-xl border-2">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-50 text-center px-6">
            <div
              className="glitch text-4xl md:text-6xl font-extrabold"
              data-text="GAME OVER"
            >
              GAME OVER
            </div>
            <div className="mt-3 text-3xl text-green-200/90">
              <span className="font-extrabold">Score</span>: {score}
            </div>
            <div className="mt-3 text-sm text-green-200/90">
              Press <span className="font-bold">R</span> to restart
            </div>
          </div>

          {/* scanlines & crack shards */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="scanlines w-full h-full" />
            <div className="crack crack-1" />
            <div className="crack crack-2" />
            <div className="crack crack-3" />
          </div>
          <style>{`
            .glitch {
              color: #9aff7a;
              text-shadow: 0 0 8px #00ff66;
              position: relative;
              display: inline-block;
              letter-spacing: 2px;
              transform: translateZ(0);
            }
            .glitch::before, .glitch::after {
              content: attr(data-text);
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }
            .glitch::before {
              color: #ff66b2;
              z-index: -1;
              transform: translate(2px, -2px);
              mix-blend-mode: screen;
              opacity: 0.8;
              animation: glitchTop 1.8s infinite linear;
            }
            .glitch::after {
              color: #66fff0;
              z-index: -2;
              transform: translate(-2px, 2px);
              mix-blend-mode: screen;
              opacity: 0.8;
              animation: glitchBottom 1.6s infinite linear;
            }
            @keyframes glitchTop {
              0% { clip: rect(0, 9999px, 0, 0); }
              10% { clip: rect(2px, 9999px, 22px, 0); transform: translate(2px, -2px); }
              20% { clip: rect(10px, 9999px, 40px, 0); transform: translate(-1px, 1px); }
              30% { clip: rect(0, 9999px, 0, 0); }
              100% { clip: rect(0, 9999px, 0, 0); }
            }
            @keyframes glitchBottom {
              0% { clip: rect(0, 9999px, 0, 0); }
              15% { clip: rect(8px, 9999px, 34px, 0); transform: translate(-2px, 2px); }
              35% { clip: rect(4px, 9999px, 28px, 0); transform: translate(1px, -1px); }
              100% { clip: rect(0, 9999px, 0, 0); }
            }
            .scanlines { background-image: linear-gradient(rgba(255,255,255,0.02) 50%, transparent 50%); background-size: 100% 4px; mix-blend-mode: overlay; opacity: 0.6; }
            .crack { position: absolute; pointer-events: none; background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2)); filter: blur(0.6px); opacity: 0.9; }
            .crack-1 { width: 8px; height: 140%; left: 40%; top: -20%; transform: rotate(10deg); animation: crackShake 1.2s infinite ease-in-out; }
            .crack-2 { width: 6px; height: 120%; left: 58%; top: -10%; transform: rotate(-8deg); animation: crackShake 1.6s infinite ease-in-out; }
            .crack-3 { width: 10px; height: 160%; left: 50%; top: -30%; transform: rotate(2deg); animation: crackFlicker 2.2s infinite linear; opacity:0.5 }
            @keyframes crackShake { 0% { transform: translateX(0) rotate(2deg); } 50% { transform: translateX(1px) rotate(0deg); } 100% { transform: translateX(0) rotate(2deg); } }
            @keyframes crackFlicker { 0% { opacity: 0.5 } 50% { opacity: 0.9 } 100% { opacity: 0.5 } }
          `}</style>
        </div>
      )}
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
