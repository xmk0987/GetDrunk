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

export interface RoomData {
  roomId: string;
  game: {
    name: string;
    status: string;
    deck?: Deck;
    playedCards?: Card[];
  };
  players: Player[];
  dealer: string;
  guesser: string;
}

export interface GameLogic {
  status: string;
  players: Player[];
  dealer: string;
  guesser: string;
  deck?: Deck;
  playedCards: Card[];
}
