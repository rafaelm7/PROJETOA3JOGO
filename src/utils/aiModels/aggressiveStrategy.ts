import { Move, Round, AiThought } from '../../types/game';
import { moves } from '../gameRules';

export class AggressiveStrategyModel {
  private readonly CONFIDENCE_BOOST = 0.15;
  private readonly PATTERN_WEIGHT = 0.7;

  public analyze(history: Round[]): AiThought[] {
    const thoughts: AiThought[] = [];
    const recentMoves = history.slice(-3);

    // Análise agressiva de padrões recentes
    this.analyzeRecentPatterns(recentMoves, thoughts);
    
    // Análise de movimentos de alto risco/recompensa
    this.analyzeRiskyMoves(history, thoughts);

    return thoughts;
  }

  private analyzeRecentPatterns(moves: Round[], thoughts: AiThought[]): void {
    if (moves.length < 2) return;

    const lastMove = moves[moves.length - 1].playerMove;
    const previousMove = moves[moves.length - 2].playerMove;

    if (lastMove === previousMove) {
      thoughts.push({
        type: 'pattern',
        description: `Padrão identificado em modo agressivo: ${lastMove}`,
        confidence: 0.95 + this.CONFIDENCE_BOOST
      });
    }
  }

  private analyzeRiskyMoves(history: Round[], thoughts: AiThought[]): void {
    const moveStats = this.calculateMoveStats(history);
    const bestCounter = this.findBestCounter(moveStats);

    thoughts.push({
      type: 'counter',
      description: `Estratégia agressiva: contra-atacar com ${bestCounter}`,
      confidence: 0.9 + this.CONFIDENCE_BOOST
    });
  }

  private calculateMoveStats(history: Round[]): Map<Move, number> {
    const stats = new Map<Move, number>();
    
    moves.forEach(move => {
      const successRate = history.filter(round => 
        round.playerMove === move && round.winner === 'player'
      ).length / Math.max(1, history.filter(round => round.playerMove === move).length);
      
      stats.set(move, successRate);
    });

    return stats;
  }

  private findBestCounter(moveStats: Map<Move, number>): Move {
    let bestMove = moves[0];
    let highestScore = 0;

    moveStats.forEach((score, move) => {
      if (score > highestScore) {
        highestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  }
}