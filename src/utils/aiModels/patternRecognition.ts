import { Move, Round, AiThought } from '../../types/game';
import { moves, rules } from '../gameRules';

export class PatternRecognitionModel {
  private readonly MIN_SEQUENCE_LENGTH = 4;
  private readonly ALTERNATING_CONFIDENCE = 0.92;

  public analyze(history: Round[]): AiThought[] {
    const thoughts: AiThought[] = [];
    const recentMoves = history.slice(-8);
    
    if (recentMoves.length >= 3) {
      // Análise de padrões imediatos (últimas 3 jogadas)
      this.analyzeImmediatePatterns(recentMoves, thoughts);
      
      // Análise aprimorada de padrões alternados (A-B-A-B)
      this.analyzeAlternatingPatterns(recentMoves, thoughts);
      
      // Análise de padrões cíclicos (A-B-C-A-B-C)
      this.analyzeCyclicPatterns(recentMoves, thoughts);
    }
    
    // Análise de padrões psicológicos
    this.analyzePsychologicalPatterns(history, thoughts);
    
    return thoughts;
  }

  private analyzeImmediatePatterns(moves: Round[], thoughts: AiThought[]): void {
    const lastThree = moves.slice(-3).map(r => r.playerMove);
    const isRepeating = lastThree.every(move => move === lastThree[0]);
    
    if (isRepeating) {
      thoughts.push({
        type: 'pattern',
        description: `Jogador tende a repetir ${lastThree[0]}`,
        confidence: 0.9
      });
    }
  }

  private analyzeAlternatingPatterns(moves: Round[], thoughts: AiThought[]): void {
    if (moves.length < this.MIN_SEQUENCE_LENGTH) return;

    const lastFour = moves.slice(-4).map(r => r.playerMove);
    const [moveA, moveB, moveC, moveD] = lastFour;

    // Verifica padrão A-B-A-B
    if (moveA === moveC && moveB === moveD && moveA !== moveB) {
      const nextPredicted = moveA; // O próximo movimento será provavelmente A
      const bestCounter = this.findBestCounter(nextPredicted);
      
      thoughts.push({
        type: 'pattern',
        description: `Padrão alternado forte detectado: ${moveA}-${moveB}. Prevendo próximo: ${nextPredicted}`,
        confidence: this.ALTERNATING_CONFIDENCE
      });

      thoughts.push({
        type: 'counter',
        description: `Contra-ataque ideal para ${nextPredicted}: ${bestCounter}`,
        confidence: this.ALTERNATING_CONFIDENCE
      });
    }
  }

  private analyzeCyclicPatterns(moves: Round[], thoughts: AiThought[]): void {
    const lastSix = moves.slice(-6).map(r => r.playerMove);
    if (lastSix[0] === lastSix[3] && lastSix[1] === lastSix[4] && lastSix[2] === lastSix[5]) {
      thoughts.push({
        type: 'pattern',
        description: `Padrão cíclico identificado`,
        confidence: 0.95
      });
    }
  }

  private analyzePsychologicalPatterns(history: Round[], thoughts: AiThought[]): void {
    const movesAfterLoss = history.filter((round, i) => 
      i > 0 && history[i-1].winner === 'ai'
    );
    
    if (movesAfterLoss.length >= 2) {
      const counts = movesAfterLoss.reduce((acc, round) => {
        acc[round.playerMove] = (acc[round.playerMove] || 0) + 1;
        return acc;
      }, {} as Record<Move, number>);
      
      const mostCommonMove = Object.entries(counts)
        .sort(([,a], [,b]) => b - a)[0][0] as Move;
      
      thoughts.push({
        type: 'pattern',
        description: `Após perder, jogador tende a escolher ${mostCommonMove}`,
        confidence: 0.8
      });
    }
  }

  private findBestCounter(move: Move): Move {
    // Encontra o movimento que vence do previsto
    const winningMoves = moves.filter(m => 
      rules[m].beats.includes(move)
    );
    
    // Retorna o primeiro movimento vencedor
    return winningMoves[0];
  }
}