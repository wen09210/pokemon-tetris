import * as React from 'react';
import Cell from './Cell';
import { BoardShape } from '../types';

interface BoardProps {
  stage: BoardShape;
  children?: React.ReactNode;
}

const Board: React.FC<BoardProps> = ({ stage, children }) => {
  return (
    // The screen container
    <div className="relative p-1 bg-slate-800 rounded-md border-4 border-slate-600 shadow-xl h-full w-auto aspect-[10/20]">
        {/* The internal screen content */}
        <div className="grid grid-rows-[repeat(20,minmax(0,1fr))] grid-cols-[repeat(10,minmax(0,1fr))] bg-[#f0f8ff] border-2 border-slate-900 h-full w-full relative overflow-hidden">
            <div className="absolute inset-0 screen-scanline z-10 pointer-events-none"></div>
            {stage.map((row, y) =>
                row.map((cell, x) => (
                    <Cell key={`${y}-${x}`} type={cell[0]} isGhost={cell[1] === 'ghost'} />
                ))
            )}
            {/* Overlay UI (Start Screen / Game Over) */}
            {children}
        </div>
    </div>
  );
};

export default Board;