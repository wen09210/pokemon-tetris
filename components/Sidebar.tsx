import * as React from 'react';
import NextPiece from './NextPiece';
import Display from './Display';
import { Tetromino } from '../types';

interface SidebarProps {
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  nextTetromino: Tetromino;
  pokemonId: number;
  score: number;
  collectedCount: number;
  level: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMuted,
  toggleMute,
  nextTetromino,
  pokemonId,
  score,
  collectedCount,
  level
}) => {
  return (
    <div className="flex flex-col gap-2 w-[85px] md:w-[100px] shrink-0 justify-start pt-1">
         {/* Mute Button */}
         <button 
            onClick={toggleMute}
            className="w-full py-2 bg-slate-800 border-2 border-slate-600 rounded text-white shadow-sm flex items-center justify-center hover:bg-slate-700 active:translate-y-1 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
         >
            {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2.586l3.707-4.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2.586l3.707-4.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
         </button>

         {/* Next Piece */}
         <NextPiece tetromino={nextTetromino} />
         
         {/* Pokemon Display (Decor/Wild) */}
         <div className="flex items-center justify-center bg-[#9bbc0f] w-full aspect-square border-4 border-slate-700 rounded-sm shadow-inner relative overflow-hidden mb-2">
            <div className="absolute inset-0 screen-scanline opacity-20"></div>
            <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`}
                alt="pokemon"
                className="h-[80%] w-[80%] object-contain pixelated relative z-10"
            />
         </div>

         {/* Stats */}
         <div className="flex flex-col gap-1 w-full mt-auto mb-auto">
            <Display label="Score" text={score.toString()} />
            {/* Shows collected count with Pokeball Icon */}
            <Display 
                label={
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline-block">
                        <circle cx="10" cy="10" r="8" stroke="#0f380f" strokeWidth="2.5" />
                        <path d="M2 10H18" stroke="#0f380f" strokeWidth="2.5" />
                        <circle cx="10" cy="10" r="2.5" fill="#9bbc0f" stroke="#0f380f" strokeWidth="2.5" />
                    </svg>
                }
                text={collectedCount.toString()} 
            /> 
            <Display label="Level" text={level.toString()} />
         </div>
    </div>
  );
};

export default Sidebar;