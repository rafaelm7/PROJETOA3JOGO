import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Move } from '../types/game';
import { moveEmojis } from '../utils/moveEmojis';
import { User, Bot } from 'lucide-react';

interface ScoreCardProps {
  playerScore: number;
  aiScore: number;
  lastMove: {
    player: Move | null;
    ai: Move | null;
  };
  result: string | null;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  playerScore, 
  aiScore, 
  lastMove,
  result 
}) => {
  const getResultColor = (result: string | null) => {
    if (!result) return 'text-cyan-400';
    if (result.includes('Você venceu')) return 'text-green-400';
    if (result.includes('IA venceu')) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl" />
        
        <div className="relative flex justify-between items-center">
          <motion.div 
            className="text-center flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-1 sm:mb-2" />
            <p className="text-base sm:text-lg font-semibold text-cyan-400">Jogador</p>
            <p className="text-2xl sm:text-4xl font-mono text-cyan-300">{playerScore}</p>
          </motion.div>
          
          <div className="flex flex-col items-center mx-2 sm:mx-4">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`text-lg sm:text-2xl font-bold mb-1 sm:mb-2 text-center ${getResultColor(result)}`}
                >
                  {result}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <AnimatePresence mode="wait">
                {lastMove.player && (
                  <motion.div
                    key={`player-${lastMove.player}`}
                    initial={{ opacity: 0, scale: 0.5, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -20 }}
                    className="text-2xl sm:text-4xl"
                  >
                    {moveEmojis[lastMove.player]}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {(lastMove.player || lastMove.ai) && (
                <span className="text-cyan-500/50 text-xl sm:text-2xl">vs</span>
              )}
              
              <AnimatePresence mode="wait">
                {lastMove.ai && (
                  <motion.div
                    key={`ai-${lastMove.ai}`}
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    className="text-2xl sm:text-4xl"
                  >
                    {moveEmojis[lastMove.ai]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <motion.div 
            className="text-center flex flex-col items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-1 sm:mb-2" />
            <p className="text-base sm:text-lg font-semibold text-cyan-400">IA</p>
            <p className="text-2xl sm:text-4xl font-mono text-cyan-300">{aiScore}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};