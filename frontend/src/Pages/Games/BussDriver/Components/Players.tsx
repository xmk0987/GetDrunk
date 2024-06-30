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

  // Sort players so that the player with the given username is first
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.username === username) return -1;
    if (b.username === username) return 1;
    return 0;
  });

  return (
    <div className="bd-players">
      {sortedPlayers.map((player) => (
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
