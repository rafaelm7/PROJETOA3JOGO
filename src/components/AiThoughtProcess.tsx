import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { AiThought } from '../types/game';
import { AiInfoModal } from './AiInfoModal';

interface AiThoughtProcessProps {
  thoughts: AiThought[];
}

export const AiThoughtProcess: React.FC<AiThoughtProcessProps> = ({ thoughts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThought, setSelectedThought] = useState<AiThought | undefined>();

  const handleThoughtClick = (thought: AiThought) => {
    setSelectedThought(thought);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-black/80 rounded-lg p-4 border border-cyan-500/30">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-cyan-500 text-base sm:text-lg font-bold flex items-center">
            <span className="mr-2">🤖</span> Processo de Tomada de Decisão
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
            title="Saiba mais sobre o processo de decisão da IA"
          >
            <Info className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-cyan-400" />
          </button>
        </div>
        <div className="space-y-2">
          {thoughts.map((thought, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center text-xs sm:text-sm w-full p-2 rounded hover:bg-cyan-500/10 transition-colors"
              onClick={() => handleThoughtClick(thought)}
            >
              <div className="w-1 h-1 bg-cyan-500 rounded-full mr-2 flex-shrink-0" />
              <span className="text-cyan-300 text-left">{thought.description}</span>
              <div 
                className="ml-auto pl-2 text-xs flex-shrink-0"
                style={{ color: `hsl(${thought.confidence * 120}, 100%, 75%)` }}
              >
                {Math.round(thought.confidence * 100)}%
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AiInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedThought(undefined);
        }}
        currentThought={selectedThought}
      />
    </>
  );
};