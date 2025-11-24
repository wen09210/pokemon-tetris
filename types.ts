export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
}

export interface PlayerState {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
}

export type CellValue = [TetrominoType | 0, string]; // [type, clearState]
export type BoardShape = CellValue[][];

export enum GameStatus {
  MENU,
  PLAYING,
  PAUSED,
  GAMEOVER
}
