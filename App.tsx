import * as React from 'react';
import { createStage, checkCollision } from './utils/gameHelpers';
import { useStage } from './hooks/useStage';
import { usePlayer } from './hooks/usePlayer';
import { useGameStatus } from './hooks/useGameStatus';
import { useInterval } from './hooks/useInterval';
import Board from './components/Board';
import GeminiFeedback from './components/GeminiFeedback';
import Controls from './components/Controls';
import Sidebar from './components/Sidebar';
import GameOverlay from './components/GameOverlay';
import { GameStatus } from './types';
import { audio } from './services/audioService';

const { useState, useRef, useEffect } = React;

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MENU);
  const [pokemonId, setPokemonId] = useState(25); // Start with Pikachu
  const [collectedPokemon, setCollectedPokemon] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent game focus loss or accidental moves
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audio.setMute(newMutedState);
    
    // Resume music if unmuting while playing
    if (!newMutedState && gameStatus === GameStatus.PLAYING) {
      audio.playBGM();
    }
    gameAreaRef.current?.focus();
  };

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
    audio.playBGM();
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
        audio.stopBGM();
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
        className="flex flex-col h-[100dvh] w-screen bg-[#D8D0C0] overflow-hidden outline-none touch-none p-4 relative"
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
                 <Board stage={stage}>
                    {/* Overlay UI now inside its own component */}
                    <GameOverlay 
                        gameStatus={gameStatus}
                        score={score}
                        collectedPokemon={collectedPokemon}
                        onStartGame={startGame}
                    />
                 </Board>
            </div>

            {/* Right: Sidebar */}
            <Sidebar 
                isMuted={isMuted}
                toggleMute={toggleMute}
                nextTetromino={nextTetromino}
                pokemonId={pokemonId}
                score={score}
                collectedCount={collectedPokemon.length}
                level={level}
            />
        </div>

        {/* Controls Area (Bottom) */}
        <Controls onControl={handleMobileControl} />
    </div>
  );
};

export default App;