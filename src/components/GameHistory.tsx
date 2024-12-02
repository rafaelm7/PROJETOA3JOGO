import React from 'react';
import { motion } from 'framer-motion';
import { Round } from '../types/game';
import { moveEmojis } from '../utils/moveEmojis';

interface GameHistoryProps {
  history: Round[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  const getWinnerDisplay = (winner: 'player' | 'ai' | 'tie') => {
    switch (winner) {
      case 'player':
        return <span className="text-green-400">Jogador venceu!</span>;
      case 'ai':
        return <span className="text-red-400">IA venceu!</span>;
      case 'tie':
        return <span className="text-yellow-400">Empate!</span>;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-cyan-500">Histórico de Batalhas</h2>
      <div className="bg-black/80 rounded-lg p-4 border border-cyan-500/30 max-h-48 sm:max-h-60 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-cyan-300/50 text-center">Nenhuma batalha ainda</p>
        ) : (
          <div className="space-y-2">
            {[...history].reverse().map((round, index) => (
              <motion.div
                key={round.timestamp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 rounded bg-gray-900/50 text-sm sm:text-base"
              >
                <span className="text-cyan-500 font-mono hidden sm:block">
                  #{history.length - index}
                </span>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className={round.winner === 'player' ? 'text-green-400' : 'text-cyan-300/70'}>
                    {moveEmojis[round.playerMove]}
                  </span>
                  <span className="text-cyan-500/50">vs</span>
                  <span className={round.winner === 'ai' ? 'text-red-400' : 'text-cyan-300/70'}>
                    {moveEmojis[round.aiMove]}
                  </span>
                </div>
                <div className="ml-2 sm:ml-4 text-xs sm:text-sm">
                  {getWinnerDisplay(round.winner)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};