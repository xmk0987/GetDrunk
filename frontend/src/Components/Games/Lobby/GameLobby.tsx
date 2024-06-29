import React from "react";
import RulesPopup from "../../Rules/RulesPopup";

import "./lobby.css";
import { Game, Player } from "../../../utils/types/types";
import GroupIcon from "../../../utils/icons/GroupIcon";

interface GameLobbyProps {
  roomId: string | null;
  player: any;
  gameData: Game;
  roomData: any;
  onStartGame: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  roomId,
  player,
  gameData,
  roomData,
  onStartGame,
}) => {
  return (
    <div className="lobby">
      <section className="game-room-players">
        {roomData.players.length > 0 &&
          roomData.players.map((mPlayer: Player, index: number) => (
            <div
              key={index}
              className={`player ${
                player?.socketId === mPlayer.socketId ? "accent-3-bg" : ""
              }`}
            >
              {mPlayer.username}
            </div>
          ))}
      </section>
      <section className="game-info">
        <p>ROOM ID:</p>
        <span>{roomId}</span>
        <section className="lobby-player-amount">
          <p>
            {gameData.minPlayers} -{" "}
            {gameData.maxPlayers === Infinity ? "∞" : gameData.maxPlayers}
          </p>
          <GroupIcon size={20} />
        </section>
        <p>Players:</p>
        <span
          className={`${
            roomData.players.length >= gameData.maxPlayers ? "red" : ""
          }`}
        >
          {roomData.players.length} / {gameData.maxPlayers}
        </span>
        {roomData.admin === player?.username && (
          <button
            className="default-btn-style"
            onClick={onStartGame}
            disabled={roomData.players.length < gameData.minPlayers}
          >
            START
          </button>
        )}
      </section>
      <RulesPopup header={gameData.name} rules={gameData.rules} />
    </div>
  );
};

export default GameLobby;
