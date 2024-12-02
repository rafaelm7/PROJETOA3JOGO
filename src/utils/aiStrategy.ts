import { Move, GameState, Round } from '../types/game';
import { moves } from './gameRules';

const PATTERN_THRESHOLD = 3;
const WEIGHT_ADJUSTMENT = 0.2;

export const detectPattern = (history: Round[]): Move | null => {
  if (history.length < PATTERN_THRESHOLD) return null;
  
  const recentMoves = history.slice(-PATTERN_THRESHOLD).map(round => round.playerMove);
  const lastMove = recentMoves[recentMoves.length - 1];
  
  if (recentMoves.every(move => move === lastMove)) {
    return lastMove;
  }
  
  return null;
};

export const normalizeWeights = (weights: Record<Move, number>): Record<Move, number> => {
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  return Object.fromEntries(
    Object.entries(weights).map(([move, weight]) => [move, weight / total])
  ) as Record<Move, number>;
};

export const updateWeights = (
  weights: Record<Move, number>,
  history: Round[],
  patternMove: Move | null
): Record<Move, number> => {
  const newWeights = { ...weights };

  if (patternMove) {
    moves.forEach(move => {
      if (move === patternMove) {
        newWeights[move] += WEIGHT_ADJUSTMENT;
      }
    });
  }

  return normalizeWeights(newWeights);
};

export const selectAiMove = (gameState: GameState): Move => {
  if (gameState.history.length < 5) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const pattern = detectPattern(gameState.history);
  const adjustedWeights = updateWeights(gameState.weights, gameState.history, pattern);
  
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  
  for (const move of moves) {
    cumulativeWeight += adjustedWeights[move];
    if (randomValue <= cumulativeWeight) {
      return move;
    }
  }
  
  return moves[0];
};