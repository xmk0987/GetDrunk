import React, { useState } from "react";
import { useSocket } from "../../../Providers/SocketContext";
import "./getintogame.css";

const GetIntoGame: React.FC<{
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  game_name: string;
}> = ({ setError, setLoading, game_name }) => {
  const [view, setView] = useState<string>("default");
  const [roomName, setRoomName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const { socket } = useSocket();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRoomName(e.target.value);
  };

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(e.target.value);
  };

  const handleCreateRoom = () => {
    if (socket && username !== "") {
      setLoading(true);
      setError(null);
      socket.emit("create-room", { username, game_name });
    }
  };

  const handleJoinRoom = () => {
    if (socket && roomName !== "" && username !== "") {
      setLoading(true);
      setError(null);
      socket.emit("join-room", { roomId: roomName, username });
    }
  };

  const handleSetView = (newView: string): void => {
    setView(newView);
    setError(null); // Reset error when changing views
  };

  const goBack = (): void => {
    setView("default");
    setUsername("");
    setRoomName("");
    setError(null);
  };

  return (
    <div className="getintogame-container">
      <div className="getintogame-options">
        {view === "create" ? (
          <div className="getintogame-join-popup">
            <label htmlFor="your-name">Your name:</label>
            <input
              id="your-name"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            <button
              className="default-btn-style getintogame-join"
              disabled={username === ""}
              onClick={handleCreateRoom}
            >
              CREATE
            </button>
            <button className="getintogame-back" onClick={goBack}>
              Back
            </button>
          </div>
        ) : view === "join" ? (
          <div className="getintogame-join-popup">
            <label htmlFor="room-name">Room name:</label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={handleNameChange}
            />
            <label htmlFor="your-name">Your name:</label>
            <input
              id="your-name"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            <button
              className="default-btn-style getintogame-join"
              disabled={roomName === "" || username === ""}
              onClick={handleJoinRoom}
            >
              JOIN
            </button>
            <button className="getintogame-back" onClick={goBack}>
              Back
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleSetView("create")}
              className="default-btn-style"
            >
              Create Room
            </button>
            <button
              onClick={() => handleSetView("join")}
              className="default-btn-style"
            >
              Join Room
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GetIntoGame;
