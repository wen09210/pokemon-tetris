import * as React from 'react';
import { GameStatus } from '../types';

interface GameOverlayProps {
  gameStatus: GameStatus;
  score: number;
  collectedPokemon: number[];
  onStartGame: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
  gameStatus,
  score,
  collectedPokemon,
  onStartGame
}) => {
  if (gameStatus === GameStatus.PLAYING) return null;

  return (
    <div className="absolute inset-0 bg-black/75 z-20 flex flex-col items-center justify-center p-4 text-center">
        
        {gameStatus === GameStatus.GAMEOVER ? (
            <div className="flex flex-col items-center w-full h-full pt-4">
                <div className="mb-2 animate-pulse shrink-0">
                    <h2 className="text-lg md:text-xl text-[#0f380f] bg-[#9bbc0f] px-4 py-2 font-bold border-4 border-[#0f380f] shadow-lg">GAME OVER</h2>
                </div>
                
                <div className="text-white text-xs mb-2 shrink-0">
                    SCORE: {score}
                </div>

                {/* Pokedex Grid */}
                <div className="w-full flex-grow bg-[#D8D0C0] border-4 border-slate-700 rounded p-2 mb-4 overflow-y-auto min-h-0">
                    {collectedPokemon.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[10px] text-slate-600">
                            NO POKEMON CAUGHT
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-1">
                            {collectedPokemon.map((id, idx) => (
                                <div key={idx} className="bg-white/50 rounded border border-slate-400 aspect-square flex items-center justify-center">
                                    <img 
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                                        alt={`pkmn-${id}`}
                                        className="w-full h-full object-contain pixelated"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white text-sm py-3 px-6 rounded border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all font-bold tracking-widest mb-2"
                    onClick={onStartGame}
                >
                    RETRY
                </button>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="mb-6 animate-bounce">
                    <h1 className="text-2xl text-yellow-400 font-bold tracking-tighter drop-shadow-md">TETRIS<br/>MON</h1>
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-400 text-white text-sm py-4 px-8 rounded border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all font-bold tracking-widest"
                    onClick={onStartGame}
                >
                    START GAME
                </button>
                <p className="text-[10px] text-white/50 mt-4 max-w-[80%]">
                    Catch 'em all by clearing lines!
                </p>
            </div>
        )}
    </div>
  );
};

export default GameOverlay;