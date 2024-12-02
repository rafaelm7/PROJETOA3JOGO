export type Move = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export interface GameState {
  playerScore: number;
  aiScore: number;
  history: Round[];
  aiThoughts: AiThought[];
}

export interface Round {
  playerMove: Move;
  aiMove: Move;
  winner: 'player' | 'ai' | 'tie';
  timestamp: number;
}

export interface AiThought {
  type: 'pattern' | 'frequency' | 'counter' | 'prediction';
  description: string;
  confidence: number;
}

export interface MoveStats {
  frequency: number;
  winRate: number;
  lastUsed: number;
}