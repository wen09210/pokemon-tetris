
import * as React from 'react';
import { createStage, checkCollision } from './utils/gameHelpers';
import { useStage } from './hooks/useStage';
import { usePlayer } from './hooks/usePlayer';
import { useGameStatus } from './hooks/useGameStatus';
import { useInterval } from './hooks/useInterval';
import Board from './components/Board';
import Display from './components/Display';
import NextPiece from './components/NextPiece';
import GeminiFeedback from './components/GeminiFeedback';
import { GameStatus } from './types';
import { audio } from './services/audioService';

const { useState, useRef, useEffect } = React;

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MENU);
  const [pokemonId, setPokemonId] = useState(25); // Start with Pikachu
  const [collectedPokemon, setCollectedPokemon] = useState<number[]>([]);

  const { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer, nextTetromino } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Randomize Sidebar Pokemon when nextTetromino changes (Visual only)
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    setPokemonId(randomId);
  }, [nextTetromino]);

  // Handle Pokemon Capture on Line Clear
  useEffect(() => {
    if (rowsCleared > 0) {
      // Capture the CURRENTLY displayed Pokemon (repeat for number of lines cleared)
      const newCaptures = Array(rowsCleared).fill(pokemonId);
      setCollectedPokemon(prev => [...prev, ...newCaptures]);
      audio.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsCleared]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
      audio.move();
    }
  };

  const startGame = () => {
    if(gameAreaRef.current) gameAreaRef.current.focus();
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setRows(0);
    setLevel(0);
    setCollectedPokemon([]); // Reset collection
    setGameStatus(GameStatus.PLAYING);
    audio.start();
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameStatus(GameStatus.GAMEOVER);
        setDropTime(null);
        audio.gameOver();
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const hardDrop = () => {
      let tmpY = 0;
      while (!checkCollision({ ...player, pos: { x: player.pos.x, y: player.pos.y + tmpY + 1 } }, stage, { x: 0, y: 0 })) {
          tmpY += 1;
      }
      updatePlayerPos({ x: 0, y: tmpY, collided: true });
      audio.drop();
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (gameStatus !== GameStatus.PLAYING) return;
    if (keyCode === 40) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const move = (e: React.KeyboardEvent) => {
    if (gameStatus !== GameStatus.PLAYING) return;
    const { keyCode } = e;

    if (keyCode === 37) { // Left
      e.preventDefault();
      movePlayer(-1);
    } else if (keyCode === 39) { // Right
      e.preventDefault();
      movePlayer(1);
    } else if (keyCode === 40) { // Down
      e.preventDefault();
      dropPlayer();
    } else if (keyCode === 38) { // Up (Rotate)
      e.preventDefault();
      playerRotate(stage, 1);
      audio.rotate();
    } else if (keyCode === 32) { // Space (Hard Drop)
      e.preventDefault();
      hardDrop();
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  // Mobile Controls
  const handleMobileControl = (action: 'L' | 'R' | 'D' | 'ROT' | 'HD') => {
      if (gameStatus !== GameStatus.PLAYING) return;
      if (action === 'L') movePlayer(-1);
      if (action === 'R') movePlayer(1);
      if (action === 'D') dropPlayer();
      if (action === 'ROT') {
        playerRotate(stage, 1);
        audio.rotate();
      }
      if (action === 'HD') hardDrop();
      
      if (action === 'D') {
        setTimeout(() => setDropTime(1000 / (level + 1) + 200), 100);
      }
  };

  return (
    <div 
        className="flex flex-col h-[100dvh] w-screen bg-[#D8D0C0] overflow-hidden outline-none touch-none p-4"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => move(e)}
        onKeyUp={(e) => keyUp({ keyCode: e.keyCode })} 
        ref={gameAreaRef}
        autoFocus
    >
        <GeminiFeedback rowsCleared={rowsCleared} />
        {/* Main Game Area: Split Left (Board) and Right (Sidebar) */}
        <div className="flex flex-row flex-grow w-full gap-4 overflow-hidden mb-2">
            
            {/* Left: Main Game Board (Maximized) */}
            <div className="flex-grow flex items-center justify-center relative h-full">
                 <Board stage={stage} />
                 
                 {/* Overlay */}
                 {gameStatus !== GameStatus.PLAYING && (
                    <div className="absolute inset-0 bg-black/85 z-20 flex flex-col items-center justify-center p-4 text-center rounded-md border-4 border-slate-600 h-full aspect-[10/20] overflow-hidden">
                        
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
                                    onClick={startGame}
                                >
                                    RETRY
                                </button>
                            </div>
                        ) : (
                             <button 
                                className="bg-blue-500 hover:bg-blue-400 text-white text-sm py-4 px-8 rounded border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all font-bold tracking-widest"
                                onClick={startGame}
                             >
                                START
                             </button>
                        )}
                    </div>
                 )}
            </div>

            {/* Right: Sidebar (Next Piece, Pokemon, Stats) */}
            <div className="flex flex-col gap-2 w-[85px] md:w-[100px] shrink-0 justify-start pt-1">
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
                        text={collectedPokemon.length.toString()} 
                    /> 
                    <Display label="Level" text={level.toString()} />
                 </div>
            </div>
        </div>

        {/* Controls Area (Bottom) */}
        <div className="w-full shrink-0 pt-1 pb-safe mx-auto max-w-lg">
            <div className="flex items-center justify-between gap-4">
                
                {/* D-Pad (Cross Key) */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
                    {/* Center Background Block for cohesion */}
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-slate-800 z-0"></div>

                    {/* Up (Rotate) */}
                    <button 
                        className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-slate-800 rounded-t border-t-4 border-l-4 border-r-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                        onClick={() => handleMobileControl('ROT')}
                        aria-label="Up / Rotate"
                    >▲</button>
                    {/* Left */}
                    <button 
                        className="absolute top-1/3 left-0 w-1/3 h-1/3 bg-slate-800 rounded-l border-l-4 border-t-4 border-b-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                        onClick={() => handleMobileControl('L')}
                        aria-label="Left"
                    >◀</button>
                    {/* Right */}
                    <button 
                        className="absolute top-1/3 right-0 w-1/3 h-1/3 bg-slate-800 rounded-r border-r-4 border-t-4 border-b-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                        onClick={() => handleMobileControl('R')}
                        aria-label="Right"
                    >▶</button>
                    {/* Down */}
                    <button 
                        className="absolute bottom-0 left-1/3 w-1/3 h-1/3 bg-slate-800 rounded-b border-b-4 border-l-4 border-r-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                        onClick={() => handleMobileControl('D')}
                        aria-label="Down"
                    >▼</button>
                    
                    {/* Center decoration */}
                     <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 pointer-events-none z-20 flex items-center justify-center">
                        <div className="w-2/3 h-2/3 bg-black/20 rounded-full"></div>
                     </div>
                </div>

                {/* Action Buttons (A/B Style) */}
                <div className="flex items-end justify-end gap-3 relative pr-2">
                    {/* B Button (Left) - Now ROTATE */}
                    <div className="flex flex-col items-center mb-2">
                        <button 
                            className="w-16 h-16 bg-green-700 rounded-full border-b-4 border-green-900 active:border-b-0 active:translate-y-1 shadow-xl text-sm text-white font-bold"
                            onClick={() => handleMobileControl('ROT')}
                            aria-label="Rotate"
                        >B</button>
                         <span className="text-[10px] text-slate-700 font-bold mt-1 tracking-tighter">ROT</span>
                    </div>
                    {/* A Button (Right) - Now DROP */}
                    <div className="flex flex-col items-center -mt-4">
                        <button 
                            className="w-16 h-16 bg-red-700 rounded-full border-b-4 border-red-900 active:border-b-0 active:translate-y-1 shadow-xl text-sm text-white font-bold"
                            onClick={() => handleMobileControl('HD')}
                            aria-label="Hard Drop"
                        >A</button>
                        <span className="text-[10px] text-slate-700 font-bold mt-1 tracking-tighter">DROP</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default App;
