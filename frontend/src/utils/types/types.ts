export interface Player {
  socketId: string;
  username: string;
}

export interface Game {
  name: string;
  status: string;
}

export interface RoomData {
  game: Game;
  players: Player[];
  admin: string;
  roomStatus: string;
}

export interface GameData {
  name: string;
  maxPlayers: number;
  rules: string[];
  minPlayers: number;
}
