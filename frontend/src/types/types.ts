export type TetrominoShape = number[][];

export interface Tetromino {
  shape: TetrominoShape[];
  color: string;
}

export interface FallingTetromino {
  tetromino: Tetromino;
  position: {
    x: number;
    y: number;
  };
  rotationIndex: number;
}
