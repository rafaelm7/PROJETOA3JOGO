import { Move, Round, AiThought, MoveStats } from '../../types/game';
import { moves } from '../gameRules';

export class FrequencyAnalysisModel {
  public analyze(history: Round[]): [Record<Move, MoveStats>, AiThought[]] {
    const thoughts: AiThought[] = [];
    const stats = this.calculateMoveStats(history);
    
    // Análise de frequência global
    const mostFrequent = this.analyzeMostFrequentMove(stats, thoughts);
    
    // Análise de sequências vitoriosas
    this.analyzeWinningSequences(history, thoughts);
    
    return [stats, thoughts];
  }

  private calculateMoveStats(history: Round[]): Record<Move, MoveStats> {
    const stats: Record<Move, MoveStats> = {} as Record<Move, MoveStats>;
    const recentHistory = history.slice(-5);
    
    moves.forEach(move => {
      const moveGames = history.filter(round => round.playerMove === move);
      const recentMoveGames = recentHistory.filter(round => round.playerMove === move);
      const wins = moveGames.filter(round => round.winner === 'ai').length;
      
      stats[move] = {
        frequency: moveGames.length / Math.max(history.length, 1),
        winRate: moveGames.length ? wins / moveGames.length : 0,
        lastUsed: history.findLastIndex(round => round.playerMove === move),
        recentFrequency: recentMoveGames.length / Math.min(history.length, 5)
      };
    });
    
    return stats;
  }

  private analyzeMostFrequentMove(stats: Record<Move, MoveStats>, thoughts: AiThought[]): Move {
    const mostFrequent = moves.reduce((a, b) => 
      stats[a].frequency > stats[b].frequency ? a : b
    );
    
    thoughts.push({
      type: 'frequency',
      description: `Jogador tem preferência por ${mostFrequent}`,
      confidence: stats[mostFrequent].frequency * 1.2
    });
    
    return mostFrequent;
  }

  private analyzeWinningSequences(history: Round[], thoughts: AiThought[]): void {
    const recentWins = history.slice(-3).filter(r => r.winner === 'player');
    if (recentWins.length >= 2) {
      const winningMove = recentWins[0].playerMove;
      thoughts.push({
        type: 'prediction',
        description: `Jogador pode manter ${winningMove} por estar vencendo`,
        confidence: 0.75 + (recentWins.length * 0.05)
      });
    }
  }
}