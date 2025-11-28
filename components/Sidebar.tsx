import * as React from 'react';
import NextPiece from './NextPiece';
import Display from './Display';
import { Tetromino, GameStatus } from '../types';

interface SidebarProps {
  gameStatus: GameStatus;
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  togglePause: (e: React.MouseEvent) => void;
  onHelp: (e: React.MouseEvent) => void;
  nextTetromino: Tetromino;
  pokemonId: number;
  score: number;
  collectedCount: number;
  isCatching?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  gameStatus,
  isMuted,
  toggleMute,
  togglePause,
  onHelp,
  nextTetromino,
  pokemonId,
  score,
  collectedCount,
  isCatching = false
}) => {
  // Common button style for uniform look
  const btnClass = "w-full aspect-square bg-slate-800 border-2 border-slate-600 rounded text-white shadow-sm flex items-center justify-center hover:bg-slate-700 active:translate-y-0.5 active:border-b-2 transition-all touch-none outline-none p-1";

  return (
    <div className="flex flex-col gap-2 w-[85px] md:w-[100px] shrink-0 justify-start pt-1 touch-none">
         {/* Custom Styles for Animations */}
         <style>{`
            @keyframes catch-sequence {
                0% { transform: scale(0) translateY(20px); opacity: 0; }
                15% { transform: scale(1.1) translateY(0); opacity: 1; }
                25% { transform: scale(1); }
                
                /* Shake phase */
                35% { transform: rotate(-15deg); }
                45% { transform: rotate(15deg); }
                55% { transform: rotate(-15deg); }
                65% { transform: rotate(15deg); }
                75% { transform: rotate(0deg); }

                /* Hold briefly */
                90% { transform: scale(1); opacity: 1; }
                
                /* Exit phase - Fade out just before the 2s mark */
                100% { transform: scale(0.8); opacity: 0; }
            }
            .pokeball-catch-anim {
                animation: catch-sequence 2s ease-in-out forwards;
            }
         `}</style>

         {/* Top Controls: Music, Start/Pause, Help */}
         <div className="grid grid-cols-3 gap-1 w-full">
             {/* Music Button */}
             <button 
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); toggleMute(e as any); }}
                className={btnClass}
                title={isMuted ? "Unmute" : "Mute"}
             >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2.586l3.707-4.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2.586l3.707-4.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
             </button>

             {/* Start/Pause Button (Black now) */}
             <button 
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); togglePause(e as any); }}
                className={btnClass}
                title={gameStatus === GameStatus.PLAYING ? "Pause" : "Play"}
             >
                {gameStatus === GameStatus.PLAYING ? (
                    // Pause Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    // Play Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                )}
             </button>

             {/* Help Button */}
             <button 
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onHelp(e as any); }}
                className={btnClass}
                title="Help"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
             </button>
         </div>

         {/* Next Piece */}
         <NextPiece tetromino={nextTetromino} />
         
         {/* Pokemon Display (Decor/Wild) */}
         <div className="flex items-center justify-center bg-[#9bbc0f] w-full aspect-square border-4 border-slate-700 rounded-sm shadow-inner relative overflow-hidden mb-2 pointer-events-none">
            <div className="absolute inset-0 screen-scanline opacity-20 z-0"></div>
            
            {/* Pokemon (Transition: shrinks when catching, grows when new) */}
            <img 
                key={pokemonId} /* Key forces remount on new pokemon, ensuring fresh animation */
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`}
                alt="pokemon"
                className={`h-[80%] w-[80%] object-contain pixelated relative z-10 transition-all duration-500 ease-out ${isCatching ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            />
            
            {/* PokeBall (Overlay: fly-in & shake when catching) */}
            {isCatching && (
                 <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                    alt="pokeball"
                    className="absolute inset-0 m-auto h-[60%] w-[60%] object-contain pixelated z-20 pokeball-catch-anim"
                 />
            )}
         </div>

         {/* Stats */}
         <div className="flex flex-col gap-1 w-full mt-auto mb-auto pointer-events-none">
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
         </div>
    </div>
  );
};

export default Sidebar;