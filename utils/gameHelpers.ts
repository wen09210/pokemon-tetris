import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';
import { PlayerState, BoardShape } from '../types';

export const createStage = (): BoardShape =>
  Array.from(Array(BOARD_HEIGHT), () =>
    new Array(BOARD_WIDTH).fill([0, 'clear'])
  );

export const checkCollision = (
  player: PlayerState,
  stage: BoardShape,
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  for (let y = 0; y < player.tetromino.shape.length; y += 1) {
    for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (player.tetromino.shape[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game areas height (y)
          // We shouldn't go through the bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game areas width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell we're moving to isn't set to clear AND is not a ghost piece
          (stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            'clear' &&
           stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            'ghost')
        ) {
          return true;
        }
      }
    }
  }
  return false;
};