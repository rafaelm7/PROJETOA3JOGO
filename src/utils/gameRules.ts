import { Move } from '../types/game';

export const rules: Record<Move, { beats: Move[] }> = {
  rock: { beats: ['scissors', 'lizard'] },
  paper: { beats: ['rock', 'spock'] },
  scissors: { beats: ['paper', 'lizard'] },
  lizard: { beats: ['paper', 'spock'] },
  spock: { beats: ['scissors', 'rock'] },
} as const;

export const determineWinner = (playerMove: Move, aiMove: Move): 'player' | 'ai' | 'tie' => {
  if (playerMove === aiMove) return 'tie';
  return rules[playerMove].beats.includes(aiMove) ? 'player' : 'ai';
};

export const moves: Move[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];