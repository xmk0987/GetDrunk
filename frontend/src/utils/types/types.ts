// types.ts
export interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

export interface Deck {
  deck_id: string;
  cards: Card[];
}

export interface Player {
  socketId: string;
  username: string;
}
export interface GameData {
  name: string;
  status: string;
  deck: any;
  dealer: Player | null;
  guesser: Player | null;
  dealerTurn: number;
  guessNumber: number;
  playedCards: Array<any>;
}

export interface RoomData {
  roomId: string;
  admin: string;
  players: Array<Player>;
  game: GameData;
}

export interface GameLogic {
  status: string;
  players: Player[];
  dealer: Player | null;
  guesser: Player | null;
  deck?: Deck;
  guessNumber: number;
  dealerTurn: number;
  playedCards: Card[];
}

// Define the interface for each game's properties
export interface Game {
  name: string;
  image: string;
  desc: string;
  minPlayers: number;
  maxPlayers: number;
  route: string;
  rules: string[];
}
