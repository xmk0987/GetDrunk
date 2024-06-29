import React from "react";
import { Player } from "../../../../utils/types/types";

interface PlayersProps {
  players: Player[];
  username: string | null;
  readyPlayers: Player[];
}

const Players: React.FC<PlayersProps> = ({
  players,
  username,
  readyPlayers,
}) => {
  const isReady = (player: Player) => {
    return readyPlayers.some(
      (readyPlayer) => readyPlayer.username === player.username
    );
  };

  return (
    <div className="bd-players">
      {players &&
        players.map((player) => (
          <div className="bd-player" key={player.socketId}>
            <p
              className={`underline ${
                player.username === username ? "you" : ""
              } ${isReady(player) ? "ready-underline" : "not-ready-underline"}`}
            >
              {player.username}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Players;
