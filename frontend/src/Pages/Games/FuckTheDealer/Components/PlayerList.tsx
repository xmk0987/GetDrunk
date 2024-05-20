import React from "react";
import { Player } from "../../../../utils/types/types";

interface PlayerListProps {
  players: Player[];
  dealer: Player | null;
  guesser: Player | null;
  currentPlayer: Player | null;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  dealer,
  guesser,
  currentPlayer,
}) => {
  // List all players in current game lobby and dealer or guesser status if they are any
  return (
    <section className="ftd-players">
      {players.map((player) => (
        <div className="ftd-player" key={player.socketId}>
          <p
            className={`ftd-player-name ${
              player.socketId === currentPlayer?.socketId ? "you" : ""
            }`}
          >
            {player.username}
          </p>
          {dealer?.socketId === player.socketId && (
            <p className={`ftd-player-turn dealer`}>Dealer</p>
          )}
          {guesser?.socketId === player.socketId && (
            <p className={`ftd-player-turn guesser`}>Guesser</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default PlayerList;
