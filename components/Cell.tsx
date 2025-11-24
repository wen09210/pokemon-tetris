import React from 'react';
import { TETROMINOS } from '../constants';
import { TetrominoType } from '../types';

interface CellProps {
  type: TetrominoType | 0;
  isGhost?: boolean;
}

const Cell: React.FC<CellProps> = ({ type, isGhost }) => {
  const color = type ? TETROMINOS[type].color : 'bg-transparent';
  
  // Pixel Art Styling
  let cellClass = "";
  
  if (type === 0) {
      cellClass = "border border-black/10 bg-transparent"; // Faint grid line
  } else if (isGhost) {
      cellClass = "ghost-block"; 
  } else {
      // Solid color with pixel inset shadow defined in global CSS
      cellClass = `pixel-block ${color}`;
  }

  return (
    <div className={`w-full h-full relative box-border ${type === 0 ? '' : ''}`}>
        <div className={`w-full h-full ${cellClass}`}></div>
    </div>
  );
};

export default React.memo(Cell);