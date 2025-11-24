import React from 'react';
import Cell from './Cell';
import { Tetromino } from '../types';

interface NextPieceProps {
  tetromino: Tetromino;
}

const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  // Create a 4x4 grid to render the piece safely without layout shift
  const grid = Array.from({ length: 4 }, () => Array(4).fill(0));

  // Determine offsets to center the piece roughly in the 4x4 grid
  // I pieces (4x4) start at 0, others usually start at 0 or 1.
  // We just map the shape directly for simplicity, but ensure we don't overflow.
  
  return (
    <div className="flex flex-col items-center justify-center p-1 bg-[#9bbc0f] border-4 border-slate-700 rounded-sm shadow-inner">
      <span className="text-[8px] md:text-[10px] font-bold text-[#0f380f] mb-1">NEXT</span>
      <div className="grid grid-rows-4 grid-cols-4 gap-0 w-12 h-12 md:w-16 md:h-16">
          {grid.map((row, y) =>
            row.map((_, x) => {
               // Check if the cell exists in the tetromino shape
               // Tetromino shapes are rarely 4x4 (except I), usually 2x2 or 3x3.
               // We render the shape starting from (0,0) of this grid for simplicity,
               // or center it if we wanted to be fancy.
               let type = 0;
               if (tetromino.shape[y] && tetromino.shape[y][x]) {
                   type = tetromino.shape[y][x] ? tetromino.type : 0;
               }

               return (
                   <div key={`${y}-${x}`} className="w-full h-full">
                       {type !== 0 ? <Cell type={type} /> : null}
                   </div>
               );
            })
          )}
      </div>
    </div>
  );
};

export default React.memo(NextPiece);