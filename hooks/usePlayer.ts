import { useState, useCallback } from 'react';
import { TETROMINOS, RANDOM_TETROMINO, BOARD_WIDTH } from '../constants';
import { checkCollision } from '../utils/gameHelpers';
import { PlayerState, BoardShape, Tetromino } from '../types';

export const usePlayer = () => {
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0],
    collided: false,
  });
  
  // Initialize with a random piece
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(RANDOM_TETROMINO());

  const rotate = (matrix: number[][], dir: number) => {
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage: BoardShape, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        rotate(clonedPlayer.tetromino.shape, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: nextTetromino, // Use the "next" piece
      collided: false,
    });
    // Generate a NEW next piece
    setNextTetromino(RANDOM_TETROMINO());
  }, [nextTetromino]);

  return { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer, nextTetromino };
};