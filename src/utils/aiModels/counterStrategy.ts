import { Move, AiThought } from '../../types/game';
import { moves } from '../gameRules';

const LEARNING_RATE = 0.2;
const MOMENTUM_FACTOR = 0.3;

export class CounterStrategyModel {
  private moveWeights: Record<Move, number>;
  private momentum: Record<Move, number>;

  constructor() {
    this.moveWeights = moves.reduce((acc, move) => {
      acc[move] = 0.2;
      return acc;
    }, {} as Record<Move, number>);

    this.momentum = moves.reduce((acc, move) => {
      acc[move] = 0;
      return acc;
    }, {} as Record<Move, number>);
  }

  public selectCounter(
    predictedMove: Move, 
    confidence: number
  ): [Move, AiThought] {
    const counters: Record<Move, Move[]> = {
      rock: ['paper', 'spock'],
      paper: ['scissors', 'lizard'],
      scissors: ['rock', 'spock'],
      lizard: ['rock', 'scissors'],
      spock: ['paper', 'lizard']
    };
    
    // Atualiza pesos com aprendizado aprimorado
    this.moveWeights[predictedMove] *= (1 - LEARNING_RATE);
    counters[predictedMove].forEach(counter => {
      this.moveWeights[counter] += (LEARNING_RATE * confidence) / 2;
      this.momentum[counter] += MOMENTUM_FACTOR * confidence;
    });

    // Normaliza pesos e momentum
    this.normalizeWeights();
    this.normalizeMomentum();

    // Seleção estratégica de contra-ataque
    const effectiveCounters = counters[predictedMove].map(move => ({
      move,
      weight: this.moveWeights[move] * (1 + this.momentum[move] * MOMENTUM_FACTOR)
    })).sort((a, b) => b.weight - a.weight);
    
    const chosenMove = this.selectWeightedMove(effectiveCounters);
    
    return [
      chosenMove,
      {
        type: 'counter',
        description: `Contra-atacando ${predictedMove} previsto com ${chosenMove}`,
        confidence: confidence * 0.8
      }
    ];
  }

  private normalizeWeights(): void {
    const total = Object.values(this.moveWeights).reduce((sum, weight) => sum + weight, 0);
    moves.forEach(move => {
      this.moveWeights[move] /= total;
    });
  }

  private normalizeMomentum(): void {
    const total = Object.values(this.momentum).reduce((sum, m) => sum + m, 0);
    if (total > 0) {
      moves.forEach(move => {
        this.momentum[move] /= total;
      });
    }
  }

  private selectWeightedMove(
    weightedMoves: Array<{ move: Move; weight: number }>
  ): Move {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const { move, weight } of weightedMoves) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        return move;
      }
    }
    
    return weightedMoves[0].move;
  }
}