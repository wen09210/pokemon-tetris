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
import HelpModal from './components/HelpModal';
import { GameStatus } from './types';
import { audio } from './services/audioService';

const { useState, useRef, useEffect } = React;

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MENU);
  const [pokemonId, setPokemonId] = useState(25); // Start with Pikachu
  const [collectedPokemon, setCollectedPokemon] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Use a ref to track catching state for the timer callback to avoid dependency loops
  const isCatchingRef = useRef(false);

  const { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer, nextTetromino } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Sync ref with state
  useEffect(() => {
    isCatchingRef.current = isCatching;
  }, [isCatching]);

  // Pokemon Timer: Change Pokemon every 30s if not currently catching
  // Depends on pokemonId to reset the timer whenever a new pokemon appears (whether by time or catch)
  useInterval(() => {
    if (gameStatus === GameStatus.PLAYING && !isCatchingRef.current) {
        // Only switch if we are NOT currently in the middle of a catch animation
        let newId = Math.floor(Math.random() * 151) + 1;
        while(newId === pokemonId) {
             newId = Math.floor(Math.random() * 151) + 1;
        }
        setPokemonId(newId);
    }
  }, 30000);

  // Audio lifecycle
  useEffect(() => {
    audio.setMute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING && !showHelp) {
       audio.playBGM();
       // Focus the game area to ensure keyboard events are captured immediately
       gameAreaRef.current?.focus();
    } else {
       audio.stopBGM();
    }
    return () => audio.stopBGM();
  }, [gameStatus, showHelp]);

  // Capture Logic
  useEffect(() => {
    if (rowsCleared > 0 && !isCatching) {
        // Trigger capture sequence
        setIsCatching(true);
        audio.clear();

        // Wait for animation (2000ms), then update collection and spawn new Pokemon
        setTimeout(() => {
            setCollectedPokemon(prev => [...prev, pokemonId]);
            
            // Generate distinct new ID
            let newId = Math.floor(Math.random() * 151) + 1;
            while(newId === pokemonId) {
                newId = Math.floor(Math.random() * 151) + 1;
            }
            setPokemonId(newId);
            setIsCatching(false); // Reset catching state
        }, 2000);
    }
  }, [rowsCleared, pokemonId, isCatching]);

  // Block Out Detection (Game Over when spawn overlaps)
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      if (checkCollision(player, stage, { x: 0, y: 0 })) {
        setGameStatus(GameStatus.GAMEOVER);
        setDropTime(null);
        audio.gameOver();
      }
    }
  }, [player, stage, gameStatus]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
      audio.move();
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameStatus(GameStatus.PLAYING);
    setScore(0);
    setRows(0);
    setLevel(0);
    setCollectedPokemon([]);
    setPokemonId(Math.floor(Math.random() * 151) + 1);
    setIsCatching(false);
    audio.start();
    audio.playBGM();
  };

  const handleGameControl = (e?: React.MouseEvent) => {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    if (gameStatus === GameStatus.PLAYING) {
        // Pause
        setGameStatus(GameStatus.PAUSED);
        setDropTime(null);
        audio.stopBGM();
    } else if (gameStatus === GameStatus.PAUSED) {
        // Resume
        setGameStatus(GameStatus.PLAYING);
        setDropTime(1000 / (level + 1) + 200);
        audio.playBGM();
    } else {
        // Start (Menu or GameOver)
        startGame();
    }
  };

  const toggleHelp = (e?: React.MouseEvent) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Pause game if opening help while playing
    if (!showHelp && gameStatus === GameStatus.PLAYING) {
        setGameStatus(GameStatus.PAUSED);
        setDropTime(null);
        audio.stopBGM();
    }
    
    setShowHelp(!showHelp);
  };

  const drop = () => {
    // Increase level every 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over (Lock Out)
      if (player.pos.y < 1) {
        setGameStatus(GameStatus.GAMEOVER);
        setDropTime(null);
        audio.gameOver();
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
      audio.drop();
    }
  };

  const keyUp = (e: React.KeyboardEvent) => {
    if (gameStatus !== GameStatus.PLAYING) return;
    const { keyCode } = e;
    // 40: Down Arrow, 83: S
    if (keyCode === 40 || keyCode === 83) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const hardDrop = () => {
    let tmpY = 0;
    while (!checkCollision(player, stage, { x: 0, y: tmpY + 1 })) {
        tmpY += 1;
    }
    updatePlayerPos({ x: 0, y: tmpY, collided: true });
    audio.drop();
  };

  const move = (e: React.KeyboardEvent) => {
    if (gameStatus !== GameStatus.PLAYING || showHelp) return;

    const { keyCode } = e;
    
    // Prevent default scrolling for Arrow keys and Space
    if ([32, 37, 38, 39, 40].includes(keyCode)) {
      e.preventDefault();
    }

    // Left Arrow (37) or A (65)
    if (keyCode === 37 || keyCode === 65) {
      movePlayer(-1);
    } 
    // Right Arrow (39) or D (68)
    else if (keyCode === 39 || keyCode === 68) { 
      movePlayer(1);
    } 
    // Down Arrow (40) or S (83)
    else if (keyCode === 40 || keyCode === 83) { 
      dropPlayer();
    } 
    // Up Arrow (38) or W (87)
    else if (keyCode === 38 || keyCode === 87) { 
      playerRotate(stage, 1);
      audio.rotate();
    } 
    // Space (32)
    else if (keyCode === 32) { 
      hardDrop();
    }
  };
  
  const handleControl = (action: 'L' | 'R' | 'D' | 'ROT' | 'HD') => {
      if (gameStatus !== GameStatus.PLAYING) return;
      if (action === 'L') movePlayer(-1);
      if (action === 'R') movePlayer(1);
      if (action === 'D') dropPlayer();
      if (action === 'ROT') { playerRotate(stage, 1); audio.rotate(); }
      if (action === 'HD') hardDrop();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent focus stealing
    setIsMuted(!isMuted);
  };

  return (
    <div 
        className="fixed inset-0 flex flex-col items-center justify-start overflow-hidden bg-[#D8D0C0] outline-none touch-none" 
        role="button" 
        tabIndex={0} 
        onKeyDown={move} 
        onKeyUp={keyUp}
        ref={gameAreaRef}
    >
      {/* 
          Main Layout Wrapper 
          - Restricts width to max-w-lg for BOTH game area and controls
          - Centers content horizontally
      */}
      <div className="w-full max-w-lg h-full flex flex-col mx-auto">
          
          {/* Game Area Container */}
          <div className="flex-1 min-h-0 flex flex-row items-center justify-center gap-4 px-2 box-border py-4">
            
            {/* Board Wrapper */}
            <div className="relative h-full max-h-full aspect-[10/20] max-w-[calc(100vw-120px)]">
                <Board stage={stage}>
                     {/* Feedback Animation */}
                    <GeminiFeedback rowsCleared={rowsCleared} />
                    
                    {/* Overlays (Start/Gameover/Paused) */}
                    <GameOverlay 
                        gameStatus={gameStatus} 
                        score={score}
                        collectedPokemon={collectedPokemon}
                        onStartGame={handleGameControl}
                    />
                </Board>
            </div>

            {/* Sidebar */}
            <div className="h-full flex flex-col justify-start">
                <Sidebar 
                    gameStatus={gameStatus}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    togglePause={handleGameControl}
                    onHelp={toggleHelp}
                    nextTetromino={nextTetromino}
                    pokemonId={pokemonId}
                    score={score}
                    collectedCount={collectedPokemon.length}
                    isCatching={isCatching}
                />
            </div>
          </div>

          {/* Bottom Controls - Inside the max-w-lg wrapper */}
          <Controls onControl={handleControl} />

      </div>
      
      {/* Global Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

    </div>
  );
};

export default App;