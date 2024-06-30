import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player } from "../utils/types/types";

/**
 * Custom hook to manage the game socket and game state.
 * @param initialGameLogic - The initial game logic object.
 * @returns An object containing various game states and functions to manage the game.
 */
export const useGameSocket = (initialGameLogic: any) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [player, setPlayer] = useState<Player | null>(() => {
    const savedPlayer = sessionStorage.getItem("player");
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });

  const [roomInfo, setRoomInfo] = useState<any>(() => {
    const savedRoomInfo = sessionStorage.getItem("roomInfo");
    return savedRoomInfo ? JSON.parse(savedRoomInfo) : null;
  });

  const [gameLogic] = useState<any>(initialGameLogic);

  // Save roomInfo to session storage whenever it changes
  useEffect(() => {
    if (roomInfo !== null) {
      sessionStorage.setItem("roomInfo", JSON.stringify(roomInfo));
    } else {
      sessionStorage.removeItem("roomInfo");
    }
  }, [roomInfo]);

  // Save player to session storage whenever it changes
  useEffect(() => {
    if (player !== null) {
      sessionStorage.setItem("player", JSON.stringify(player));
    } else {
      sessionStorage.removeItem("player");
    }
  }, [player]);

  // Set up socket event handlers
  useEffect(() => {
    if (!socket) return;

    /**
     * Handle socket connection.
     */
    const handleConnect = () => {
      const savedRoomInfo = sessionStorage.getItem("roomInfo");
      const savedPlayer = sessionStorage.getItem("player");
      if (savedRoomInfo && savedPlayer) {
        const roomInfo = JSON.parse(savedRoomInfo);
        const player = JSON.parse(savedPlayer);
        socket.emit("rejoin-room", { roomId: roomInfo.roomId, player });
      }
    };

    /**
     * Handle socket error.
     * @param message - The error message.
     */
    const handleError = (message: string) => {
      setLoading(false);
      setError(message);
    };

    /**
     * Handle room creation.
     * @param data - The room data.
     */
    const handleRoomCreated = (data: any) => {
      const { roomData, player } = data;
      setRoomInfo(roomData);
      setPlayer(player);
      setLoading(false);
    };

    /**
     * Handle room joining.
     * @param data - The room data.
     */
    const handleRoomJoined = (data: any) => {
      const { roomData, player } = data;
      setRoomInfo(roomData);
      setPlayer(player);
      setLoading(false);
      if (roomData.game.status === "playing") {
        gameLogic.setGameData(roomData);
      }
    };

    /**
     * Handle new player joining.
     * @param player - The new player data.
     */
    const handleNewPlayer = (player: Player) => {
      setRoomInfo((prevRoomInfo: { players: any }) => {
        if (!prevRoomInfo) return null;
        return {
          ...prevRoomInfo,
          players: [...prevRoomInfo.players, player],
        };
      });
    };

    /**
     * Handle game start.
     * @param data - The room data.
     */
    const handleGameStarted = (data: any) => {
      setMessage("");
      gameLogic.setGameData(data);
      setRoomInfo(data);
    };

    /**
     * Handle next turn.
     * @param data - The room data.
     */
    const handleNextTurn = (data: any) => {
      const { message, gameData } = data;
      console.log("RECEIVED NEW GAME DATA: ", data.gameData);
      setRoomInfo(gameData);
      setMessage(message);
      gameLogic.setGameData(gameData);
    };

    /**
     * Handle guess again.
     * @param data - The room data.
     */
    const handleRejoin = (data: any) => {
      const { roomData } = data;
      setRoomInfo(roomData);
      if (roomData.game.status === "playing") {
        gameLogic.setGameData(roomData);
      }
    };

    const handleReadyPlayer = (data: any) => {
      setRoomInfo((prevRoomInfo: { game: { readyPlayers: any } }) => {
        // Make sure to access the current readyPlayers array correctly
        const updatedReadyPlayers = data;

        // Return the new state with the updated readyPlayers array
        return {
          ...prevRoomInfo,
          game: {
            ...prevRoomInfo.game,
            readyPlayers: updatedReadyPlayers,
          },
        };
      });

      gameLogic.setReadyPlayers(data);
    };

    socket.on("connect", handleConnect);
    socket.on("error", handleError);
    socket.on("room-created", handleRoomCreated);
    socket.on("room-joined", handleRoomJoined);
    socket.on("new-player", handleNewPlayer);
    socket.on("game-started", handleGameStarted);
    socket.on("next-turn", handleNextTurn);
    socket.on("player-rejoined", handleRejoin);
    socket.on("ready-players-updated", handleReadyPlayer);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("error", handleError);
      socket.off("room-created", handleRoomCreated);
      socket.off("room-joined", handleRoomJoined);
      socket.off("new-player", handleNewPlayer);
      socket.off("game-started", handleGameStarted);
      socket.off("next-turn", handleNextTurn);
      socket.off("ready-players-updated", handleReadyPlayer);
    };
  }, [socket, gameLogic]);

  /**
   * Starts the game by emitting a start-game event.
   */
  const startGame = useCallback(() => {
    if (roomInfo?.roomId && socket) {
      gameLogic.startGame(socket, roomInfo.roomId);
    }
  }, [roomInfo, socket, gameLogic]);

  /**
   * Handles player actions by emitting appropriate events.
   * @param action - The action type.
   * @param data - Additional data for the action.
   */
  // Using a callback to handle player actions
  const handlePlayerAction = useCallback(
    (action: string, data?: any) => {
      if (roomInfo?.roomId && socket) {
        socket.emit("player-action", {
          action,
          roomId: roomInfo.roomId,
          ...data,
        });
      }
    },
    [roomInfo, socket]
  );

  /**
   * Resets all game states and clears session storage.
   */
  const resetAll = () => {
    sessionStorage.removeItem("player");
    sessionStorage.removeItem("roomInfo");
    setPlayer(null);
    setRoomInfo(null);
    setMessage("");
    setError(null);
    setLoading(false);
    gameLogic.resetGame();
  };

  return {
    message,
    error,
    loading,
    gameLogic,
    roomInfo,
    player,
    resetAll,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  };
};
