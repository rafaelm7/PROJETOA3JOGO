import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Sobre Nós</h2>
              <button
                onClick={onClose}
                className="text-cyan-300 hover:text-cyan-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 text-cyan-100/80">
              <p>
                Projeto A3, apresentado ao curso de Sistemas de Informação, como requisito da UC Inteligência Artificial.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-cyan-400">Alunos:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Arthur Gallo Sá - 12723129251</li>
                  <li>Rafael Cordeiro Magalhães - 1272019188</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};