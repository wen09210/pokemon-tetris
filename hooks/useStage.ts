import { useState, useEffect } from 'react';
import { createStage, checkCollision } from '../utils/gameHelpers';
import { PlayerState, BoardShape } from '../types';

export const useStage = (player: PlayerState, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: BoardShape) => {
      return newStage.reduce((ack, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as BoardShape);
    };

    const updateStage = (prevStage: BoardShape) => {
      // 1. Flush the stage from the previous render
      const newStage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === 'clear' || cell[1] === 'ghost' ? [0, 'clear'] : cell))
      ) as BoardShape;

      // 2. Calculate Ghost Position
      let ghostY = player.pos.y;
      
      // Only calculate ghost if the player exists and is active
      if (player.tetromino.type !== 'I' || player.tetromino.shape.length > 1) { // Basic check
         while (!checkCollision(
            { ...player, pos: { x: player.pos.x, y: ghostY } },
            newStage,
            { x: 0, y: 1 }
         )) {
            ghostY += 1;
         }
      }

      // 3. Draw Ghost (Before Player, so player draws on top if overlapping)
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
             const targetY = y + ghostY;
             const targetX = x + player.pos.x;
             if(newStage[targetY] && newStage[targetY][targetX]) {
                // Ensure we don't overwrite merged cells
                if(newStage[targetY][targetX][1] !== 'merged') {
                    newStage[targetY][targetX] = [
                        value === 1 ? player.tetromino.type : 0, 
                        'ghost'
                    ];
                }
             }
          }
        });
      });

      // 4. Draw Player
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const targetY = y + player.pos.y;
            const targetX = x + player.pos.x;
            if (
              newStage[targetY] &&
              newStage[targetY][targetX]
            ) {
              newStage[targetY][targetX] = [
                value === 1 ? player.tetromino.type : 0,
                player.collided ? 'merged' : 'clear',
              ];
            }
          }
        });
      });

      // 5. Check Collision
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return { stage, setStage, rowsCleared };
};