import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, GitBranch, BarChart2, Zap, X, Code, ChevronDown, Sword } from 'lucide-react';
import { AiThought } from '../types/game';

interface AiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThought?: AiThought;
}

const models = {
  pattern: {
    title: "Reconhecimento de Padrões",
    description: "Analisa sequências de jogadas para identificar padrões repetitivos, alternados e tendências no comportamento do jogador.",
    features: [
      "Detecção de padrões alternados (A-B-A-B)",
      "Análise de sequências repetitivas",
      "Identificação de padrões após vitória/derrota",
      "Contra-ataques otimizados para padrões"
    ],
    code: `private analyzeAlternatingPatterns(moves: Round[], thoughts: AiThought[]): void {
  if (moves.length < this.MIN_SEQUENCE_LENGTH) return;

  const lastFour = moves.slice(-4).map(r => r.playerMove);
  const [moveA, moveB, moveC, moveD] = lastFour;

  // Verifica padrão A-B-A-B
  if (moveA === moveC && moveB === moveD && moveA !== moveB) {
    const nextPredicted = moveA;
    const bestCounter = this.findBestCounter(nextPredicted);
    
    thoughts.push({
      type: 'pattern',
      description: \`Padrão alternado forte detectado: \${moveA}-\${moveB}\`,
      confidence: this.ALTERNATING_CONFIDENCE
    });
  }
}`,
    icon: <GitBranch className="w-5 h-5" />
  },
  frequency: {
    title: "Análise de Frequência",
    description: "Calcula estatísticas detalhadas sobre o uso de cada movimento, incluindo taxa de vitória e frequência recente.",
    features: [
      "Cálculo de frequência global",
      "Análise de movimentos recentes",
      "Taxa de sucesso por movimento",
      "Detecção de preferências"
    ],
    code: `private calculateMoveStats(history: Round[]): Record<Move, MoveStats> {
  const stats: Record<Move, MoveStats> = {};
  
  moves.forEach(move => {
    const moveGames = history
      .filter(round => round.playerMove === move);
    const wins = moveGames
      .filter(round => round.winner === 'ai').length;
    
    stats[move] = {
      frequency: moveGames.length / history.length,
      winRate: wins / moveGames.length,
      lastUsed: history.findLastIndex(...)
    };
  });
  
  return stats;
}`,
    icon: <BarChart2 className="w-5 h-5" />
  },
  prediction: {
    title: "Modelo Preditivo",
    description: "Combina múltiplas fontes de dados para prever o próximo movimento do jogador com base em seu histórico e estado emocional.",
    features: [
      "Análise de transições entre movimentos",
      "Avaliação do estado emocional",
      "Detecção de mudanças estratégicas",
      "Previsão contextual"
    ],
    code: `private analyzeEmotionalState(history: Round[], thoughts: AiThought[]): void {
  const consecutiveLosses = history
    .slice(-3)
    .filter((round, i) => 
      i > 0 && 
      history[i-1].winner === 'ai' && 
      round.winner === 'ai'
    );
  
  if (consecutiveLosses.length > 1) {
    thoughts.push({
      type: 'prediction',
      description: 'Jogador sob pressão, alta chance de mudança',
      confidence: 0.85
    });
  }
}`,
    icon: <Brain className="w-5 h-5" />
  },
  counter: {
    title: "Sistema de Contra-ataque",
    description: "Seleciona o movimento ideal para contra-atacar com base nas previsões e padrões identificados.",
    features: [
      "Seleção ponderada de contra-ataques",
      "Adaptação baseada em confiança",
      "Sistema de momentum",
      "Normalização de pesos"
    ],
    code: `private selectCounter(
  predictedMove: Move, 
  confidence: number
): [Move, AiThought] {
  const counters = {
    rock: ['paper', 'spock'],
    paper: ['scissors', 'lizard'],
    scissors: ['rock', 'spock'],
    lizard: ['rock', 'scissors'],
    spock: ['paper', 'lizard']
  };
  
  this.moveWeights[predictedMove] *= (1 - LEARNING_RATE);
  counters[predictedMove].forEach(counter => {
    this.moveWeights[counter] += 
      (LEARNING_RATE * confidence) / 2;
  });
  
  return this.selectWeightedMove(counters[predictedMove]);
}`,
    icon: <Zap className="w-5 h-5" />
  },
  aggressive: {
    title: "Estratégia Agressiva",
    description: "Modo especial ativado quando a IA está perdendo por 5 ou mais pontos, focando em contra-ataques mais arriscados e decisivos.",
    features: [
      "Análise agressiva de padrões",
      "Movimentos de alto risco/recompensa",
      "Boost de confiança nas decisões",
      "Priorização de contra-ataques"
    ],
    code: `public analyze(history: Round[]): AiThought[] {
  const thoughts: AiThought[] = [];
  const recentMoves = history.slice(-3);

  // Análise agressiva de padrões recentes
  this.analyzeRecentPatterns(recentMoves, thoughts);
  
  // Análise de movimentos de alto risco/recompensa
  this.analyzeRiskyMoves(history, thoughts);

  return thoughts;
}`,
    icon: <Sword className="w-5 h-5" />
  }
};

export const AiInfoModal: React.FC<AiInfoModalProps> = ({ isOpen, onClose, currentThought }) => {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

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
            className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full border border-cyan-500/30 shadow-lg shadow-cyan-500/20 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Modelos de Tomada de Decisão
              </h2>
              <button
                onClick={onClose}
                className="text-cyan-300 hover:text-cyan-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(models).map(([key, model]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    rounded-lg overflow-hidden
                    ${currentThought?.type === key
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'bg-black/30'
                    }
                  `}
                >
                  <button
                    className="w-full p-4 flex items-center justify-between text-left"
                    onClick={() => setExpandedModel(expandedModel === key ? null : key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">
                        {model.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-cyan-400">
                          {model.title}
                        </h3>
                        <p className="text-sm text-cyan-100/80">
                          {model.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-cyan-400 transition-transform ${
                        expandedModel === key ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedModel === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-4">
                          <div className="pl-4 border-l-2 border-cyan-500/30">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                              Características Principais:
                            </h4>
                            <ul className="space-y-1">
                              {model.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-cyan-100/80 flex items-center gap-2"
                                >
                                  <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="relative">
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <Code size={14} className="text-cyan-400" />
                              <span className="text-xs text-cyan-400">
                                Implementação
                              </span>
                            </div>
                            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
                              <code className="text-cyan-100/90">
                                {model.code}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};