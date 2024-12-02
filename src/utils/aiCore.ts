import { Move, GameState, Round, AiThought } from '../types/game';
import { moves } from './gameRules';
import { PatternRecognitionModel } from './aiModels/patternRecognition';
import { FrequencyAnalysisModel } from './aiModels/frequencyAnalysis';
import { PredictionModel } from './aiModels/predictionModel';
import { CounterStrategyModel } from './aiModels/counterStrategy';
import { AggressiveStrategyModel } from './aiModels/aggressiveStrategy';
import { CONFIDENCE_THRESHOLDS, SCORE_DIFFERENCE_THRESHOLD } from './constants/thresholds';

export class AiCore {
  private patternModel: PatternRecognitionModel;
  private frequencyModel: FrequencyAnalysisModel;
  private predictionModel: PredictionModel;
  private counterModel: CounterStrategyModel;
  private aggressiveModel: AggressiveStrategyModel;

  constructor() {
    this.patternModel = new PatternRecognitionModel();
    this.frequencyModel = new FrequencyAnalysisModel();
    this.predictionModel = new PredictionModel();
    this.counterModel = new CounterStrategyModel();
    this.aggressiveModel = new AggressiveStrategyModel();
  }

  public think(gameState: GameState): [Move, AiThought[]] {
    const { history, playerScore, aiScore } = gameState;
    const thoughts: AiThought[] = [];
    
    // Verifica se deve usar estratégia agressiva
    if (playerScore - aiScore >= SCORE_DIFFERENCE_THRESHOLD) {
      return this.useAggressiveStrategy(history, thoughts);
    }

    // Fase inicial - Exploração aleatória estratégica
    if (history.length < 3) {
      return this.handleInitialPhase(thoughts);
    }

    // 1. Análise de Padrões (Prioridade Alta)
    const patterns = this.patternModel.analyze(history);
    
    // Procura por padrão alternado primeiro
    const alternatingPattern = patterns.find(p => 
      p.description.includes('Padrão alternado') && 
      p.confidence >= CONFIDENCE_THRESHOLDS.ALTERNATING
    );
    
    if (alternatingPattern) {
      return this.handleAlternatingPattern(alternatingPattern, thoughts, patterns);
    }

    // Procura outros padrões fortes
    const strongPattern = patterns.find(p => p.confidence >= CONFIDENCE_THRESHOLDS.PATTERN);
    if (strongPattern) {
      return this.handlePatternBasedDecision(strongPattern, thoughts, patterns);
    }

    // 2. Análise de Frequência (Prioridade Média)
    const [moveStats, frequencyThoughts] = this.frequencyModel.analyze(history);
    const strongFrequency = frequencyThoughts.find(
      f => f.confidence >= CONFIDENCE_THRESHOLDS.FREQUENCY
    );
    
    if (strongFrequency) {
      return this.handleFrequencyBasedDecision(strongFrequency, thoughts, frequencyThoughts);
    }

    // 3. Previsão Comportamental (Prioridade Baixa)
    const predictions = this.predictionModel.analyze(history, moveStats);
    const strongPrediction = predictions.find(
      p => p.confidence >= CONFIDENCE_THRESHOLDS.PREDICTION
    );
    
    if (strongPrediction) {
      return this.handlePredictionBasedDecision(strongPrediction, thoughts, predictions);
    }

    // 4. Fallback - Estratégia Adaptativa
    return this.handleAdaptiveStrategy(history, thoughts);
  }

  private handleAlternatingPattern(
    pattern: AiThought,
    thoughts: AiThought[],
    allPatterns: AiThought[]
  ): [Move, AiThought[]] {
    thoughts.push(...allPatterns);
    
    // Encontra o pensamento de contra-ataque correspondente
    const counterThought = allPatterns.find(t => 
      t.type === 'counter' && 
      t.confidence >= CONFIDENCE_THRESHOLDS.ALTERNATING
    );
    
    if (counterThought) {
      const counterMove = this.extractMoveFromThought(counterThought);
      if (counterMove) {
        return [counterMove, thoughts];
      }
    }
    
    return this.handleAdaptiveStrategy([], thoughts);
  }

  private useAggressiveStrategy(history: Round[], thoughts: AiThought[]): [Move, AiThought[]] {
    const aggressiveThoughts = this.aggressiveModel.analyze(history);
    thoughts.push(...aggressiveThoughts);

    const predictedMove = this.extractMoveFromThought(aggressiveThoughts[0]);
    if (predictedMove) {
      const [counterMove, counterThought] = this.counterModel
        .selectCounter(predictedMove, 0.95);
      thoughts.push(counterThought);
      return [counterMove, thoughts];
    }

    return this.handleAdaptiveStrategy(history, thoughts);
  }

  private handleInitialPhase(thoughts: AiThought[]): [Move, AiThought[]] {
    const initialMove = moves[Math.floor(Math.random() * moves.length)];
    thoughts.push({
      type: 'prediction',
      description: 'Fase inicial de análise comportamental',
      confidence: 0.5
    });
    return [initialMove, thoughts];
  }

  private handlePatternBasedDecision(
    pattern: AiThought,
    thoughts: AiThought[],
    allPatterns: AiThought[]
  ): [Move, AiThought[]] {
    thoughts.push(...allPatterns);
    const predictedMove = this.extractMoveFromThought(pattern);
    
    if (predictedMove) {
      const [counterMove, counterThought] = this.counterModel
        .selectCounter(predictedMove, pattern.confidence);
      thoughts.push(counterThought);
      return [counterMove, thoughts];
    }
    
    return this.handleAdaptiveStrategy([], thoughts);
  }

  private handleFrequencyBasedDecision(
    frequency: AiThought,
    thoughts: AiThought[],
    allFrequencies: AiThought[]
  ): [Move, AiThought[]] {
    thoughts.push(...allFrequencies);
    const predictedMove = this.extractMoveFromThought(frequency);
    
    if (predictedMove) {
      const [counterMove, counterThought] = this.counterModel
        .selectCounter(predictedMove, frequency.confidence * 0.9);
      thoughts.push(counterThought);
      return [counterMove, thoughts];
    }
    
    return this.handleAdaptiveStrategy([], thoughts);
  }

  private handlePredictionBasedDecision(
    prediction: AiThought,
    thoughts: AiThought[],
    allPredictions: AiThought[]
  ): [Move, AiThought[]] {
    thoughts.push(...allPredictions);
    const predictedMove = this.extractMoveFromThought(prediction);
    
    if (predictedMove) {
      const [counterMove, counterThought] = this.counterModel
        .selectCounter(predictedMove, prediction.confidence * 0.8);
      thoughts.push(counterThought);
      return [counterMove, thoughts];
    }
    
    return this.handleAdaptiveStrategy([], thoughts);
  }

  private handleAdaptiveStrategy(history: Round[], thoughts: AiThought[]): [Move, AiThought[]] {
    const adaptiveMove = moves[Math.floor(Math.random() * moves.length)];
    thoughts.push({
      type: 'prediction',
      description: 'Utilizando estratégia adaptativa baseada em probabilidade',
      confidence: 0.6
    });
    return [adaptiveMove, thoughts];
  }

  private extractMoveFromThought(thought: AiThought): Move | null {
    return moves.find(move => thought.description.includes(move)) || null;
  }
}