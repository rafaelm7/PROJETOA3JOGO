import React from 'react';
import { motion } from 'framer-motion';
import { Move } from '../types/game';
import { moveEmojis } from '../utils/moveEmojis';

interface MoveButtonProps {
  move: Move;
  onClick: (move: Move) => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export const MoveButton: React.FC<MoveButtonProps> = ({ 
  move, 
  onClick, 
  disabled,
  isSelected 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(move)}
      disabled={disabled}
      className={`
        relative aspect-square rounded-xl transition-all duration-200
        flex items-center justify-center
        ${disabled 
          ? 'bg-gray-800/50 cursor-not-allowed opacity-50' 
          : 'bg-black hover:bg-gray-900 shadow-lg hover:shadow-cyan-500/20 border border-cyan-500/30'
        }
        ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#000428]' : ''}
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br 
        before:from-cyan-500/20 before:to-purple-500/20 before:opacity-0 
        before:transition-opacity hover:before:opacity-100
        w-full h-full min-h-[60px] sm:min-h-[80px]
      `}
      title={move.charAt(0).toUpperCase() + move.slice(1)}
    >
      <span className="text-2xl sm:text-3xl relative z-10 flex items-center justify-center">
        {moveEmojis[move]}
      </span>
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-cyan-400/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.button>
  );
};