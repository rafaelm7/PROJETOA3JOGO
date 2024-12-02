import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Move, GameState, AiThought } from './types/game';
import { moves, determineWinner } from './utils/gameRules';
import { AiCore } from './utils/aiCore';
import { GameHistory } from './components/GameHistory';
import { MoveButton } from './components/MoveButton';
import { AiThoughtProcess } from './components/AiThoughtProcess';
import { ScoreCard } from './components/ScoreCard';
import { AboutModal } from './components/AboutModal';
import { Info, RotateCcw } from 'lucide-react';

const aiCore = new AiCore();

function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerScore: 0,
    aiScore: 0,
    history: [],
    aiThoughts: []
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ player: Move | null; ai: Move | null }>({
    player: null,
    ai: null
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleMove = useCallback((playerMove: Move) => {
    setIsPlaying(true);
    setLastMove(prev => ({ ...prev, player: playerMove }));
    
    setTimeout(() => {
      const [aiMove, thoughts] = aiCore.think(gameState);
      setLastMove(prev => ({ ...prev, ai: aiMove }));
      
      const winner = determineWinner(playerMove, aiMove);
      
      setGameState(prev => ({
        ...prev,
        playerScore: prev.playerScore + (winner === 'player' ? 1 : 0),
        aiScore: prev.aiScore + (winner === 'ai' ? 1 : 0),
        history: [...prev.history, { playerMove, aiMove, winner, timestamp: Date.now() }],
        aiThoughts: thoughts
      }));

      setResult(
        winner === 'tie' 
          ? "Empate! 🤝" 
          : winner === 'player' 
            ? 'Você venceu! 🏆' 
            : 'IA venceu! 🤖'
      );

      setTimeout(() => {
        setIsPlaying(false);
        setLastMove({ player: null, ai: null });
      }, 1500);
    }, 500);
  }, [gameState]);

  const handleReset = () => {
    setGameState({
      playerScore: 0,
      aiScore: 0,
      history: [],
      aiThoughts: []
    });
    setResult(null);
    setLastMove({ player: null, ai: null });
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#000428] to-[#004e92] py-6 sm:py-12 px-4 text-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        <motion.div 
          className="text-center relative w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Pedra, Papel, Tesoura, Lagarto e Spock
          </h1>
          <div className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors group"
              title="Reiniciar Jogo"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-transform group-hover:rotate-180" />
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
              title="Sobre Nós"
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </button>
          </div>
        </motion.div>

        <ScoreCard 
          playerScore={gameState.playerScore} 
          aiScore={gameState.aiScore}
          lastMove={lastMove}
          result={result}
        />

        <motion.div 
          className="w-full max-w-md bg-black/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-cyan-400 mb-4 sm:mb-6 text-center">
            Escolha sua Jogada
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {moves.map(move => (
              <MoveButton
                key={move}
                move={move}
                onClick={handleMove}
                disabled={isPlaying}
                isSelected={lastMove.player === move}
              />
            ))}
          </div>
        </motion.div>

        <div className="w-full space-y-6">
          <AiThoughtProcess thoughts={gameState.aiThoughts} />
          <GameHistory history={gameState.history} />
        </div>
        
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      </div>
    </div>
  );
}

export default App;