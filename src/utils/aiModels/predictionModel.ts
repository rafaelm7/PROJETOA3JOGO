import { Move, Round, AiThought, MoveStats } from '../../types/game';
import { moves } from '../gameRules';

export class PredictionModel {
  public analyze(history: Round[], moveStats: Record<Move, MoveStats>): AiThought[] {
    const thoughts: AiThought[] = [];
    
    if (history.length >= 3) {
      // Análise de transições
      this.analyzeTransitions(history, thoughts);
      
      // Análise de estados emocionais
      this.analyzeEmotionalState(history, thoughts);
      
      // Análise de momentum
      this.analyzeMomentum(history, moveStats, thoughts);
    }
    
    return thoughts;
  }

  private analyzeTransitions(history: Round[], thoughts: AiThought[]): void {
    const transitions: Record<Move, Record<Move, number>> = {} as Record<Move, Record<Move, number>>;
    
    for (let i = 1; i < history.length; i++) {
      const prevMove = history[i-1].playerMove;
      const currentMove = history[i].playerMove;
      
      if (!transitions[prevMove]) {
        transitions[prevMove] = {} as Record<Move, number>;
      }
      transitions[prevMove][currentMove] = (transitions[prevMove][currentMove] || 0) + 1;
    }

    const lastMove = history[history.length - 1].playerMove;
    if (transitions[lastMove]) {
      const mostLikelyNext = Object.entries(transitions[lastMove])
        .sort(([,a], [,b]) => b - a)[0][0] as Move;
        
      thoughts.push({
        type: 'prediction',
        description: `Após ${lastMove}, jogador costuma escolher ${mostLikelyNext}`,
        confidence: 0.7 + (transitions[lastMove][mostLikelyNext] * 0.05)
      });
    }
  }

  private analyzeEmotionalState(history: Round[], thoughts: AiThought[]): void {
    const consecutiveLosses = history.filter((round, i) => 
      i > 0 && history[i-1].winner === 'ai' && round.winner === 'ai'
    );
    
    if (consecutiveLosses.length > 1) {
      thoughts.push({
        type: 'prediction',
        description: 'Jogador sob pressão, alta chance de mudança de estratégia',
        confidence: 0.85
      });
    }

    const consecutiveWins = history.filter((round, i) => 
      i > 0 && history[i-1].winner === 'player' && round.winner === 'player'
    );

    if (consecutiveWins.length > 1) {
      thoughts.push({
        type: 'prediction',
        description: 'Jogador confiante, provável manutenção da estratégia',
        confidence: 0.8
      });
    }
  }

  private analyzeMomentum(
    history: Round[], 
    moveStats: Record<Move, MoveStats>, 
    thoughts: AiThought[]
  ): void {
    const recentMoves = history.slice(-5);
    const momentum: Record<Move, number> = {} as Record<Move, number>;
    
    moves.forEach(move => {
      const recentSuccess = recentMoves.filter(
        r => r.playerMove === move && r.winner === 'player'
      ).length;
      momentum[move] = recentSuccess / 5;
    });

    const highMomentumMoves = Object.entries(momentum)
      .filter(([, value]) => value > 0.5)
      .map(([move]) => move as Move);

    if (highMomentumMoves.length > 0) {
      thoughts.push({
        type: 'prediction',
        description: `Jogador demonstra confiança em: ${highMomentumMoves.join(', ')}`,
        confidence: 0.75
      });
    }
  }
}