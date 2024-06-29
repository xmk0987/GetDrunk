const { Server } = require("socket.io");
const { nanoid } = require("nanoid");
const FuckTheDealerLogic = require("../gamesLogic/FuckTheDealerLogic");
const BussDriverLogic = require("../gamesLogic/BussDriverLogic");

const socketData = {}; // Stores information about each room
const socketIdToUsername = {}; // Maps socket IDs to usernames
const userTimeouts = {};

/**
 * Initializes the Socket.IO server.
 * @param {Object} server - The HTTP server instance.
 * @param {Object} options - Options for configuring the Socket.IO server.
 */
function initializeSocket(server, options) {
  const io = new Server(server, options);

  /**
   * Handles a new connection.
   * @param {Object} socket - The socket representing the connection.
   */
  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    /**
     * Handles the creation of a new room.
     * @param {Object} data - Data containing the game name and username.
     */
    socket.on("create-room", (data) => {
      const { game_name, username } = data;
      console.log("Trying to create room with username:", username);

      const roomId = nanoid(10); // Generate a unique room ID
      socket.join(roomId); // Join the socket to the room

      // Initialize room data
      const roomData = {
        game: {
          name: game_name,
          status: "lobby",
        },
        players: [{ socketId: socket.id, username }],
        admin: username,
        roomId: roomId,
      };

      socketData[roomId] = roomData;
      socketIdToUsername[socket.id] = username;
      socket.emit("room-created", {
        roomData,
        player: { socketId: socket.id, username },
      });
    });

    /**
     * Handles joining an existing room.
     * @param {Object} data - Data containing the username and room ID.
     */
    socket.on("join-room", (data) => {
      const { username, roomId } = data;
      console.log("Trying to join room", roomId, "with username:", username);

      if (socketData[roomId] && socketData[roomId].game.status === "lobby") {
        socket.join(roomId); // Join the socket to the room
        socketData[roomId].players.push({ socketId: socket.id, username });
        socketIdToUsername[socket.id] = username;
        socket.emit("room-joined", {
          player: { socketId: socket.id, username },
          roomData: socketData[roomId],
        });
        console.log("Player added", socketData[roomId]);
        socket.to(roomId).emit("new-player", { socketId: socket.id, username });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    /**
     * Handles rejoining an existing room after a disconnect.
     * @param {Object} data - Data containing the room ID and player information.
     */
    socket.on("rejoin-room", (data) => {
      const { roomId, player } = data;
      console.log("Rejoining room", roomId, "with player:", player);

      if (socketData[roomId]) {
        socket.join(roomId); // Join the socket to the room
        const existingPlayer = socketData[roomId].players.find(
          (p) => p.username === player.username // Match player by username instead of socket ID
        );
        if (existingPlayer) {
          existingPlayer.socketId = socket.id; // Update the socket ID for the rejoining player
          switch (socketData[roomId].game.name) {
            case "fuckTheDealer":
              const ftdLogic = new FuckTheDealerLogic(io, roomId, socketData);
              ftdLogic.rejoinGame(player, socket);
              break;
            case "bussDriver":
              const bdLogic = new BussDriverLogic(io, roomId, socketData);
              bdLogic.rejoinGame(player, socket);
              break;
            default:
              console.log(`Unknown game: ${socketData[roomId].game.name}`);
              break;
          }
        } else {
          // If player is not found, add them to the players list
          console.log("player not found!");
          socketData[roomId].players.push({
            socketId: socket.id,
            username: player.username,
          });
        }

        // Clear the timeout if the user reconnects
        if (userTimeouts[socket.id]) {
          console.log("time out cleared");
          clearTimeout(userTimeouts[socket.id]);
          delete userTimeouts[socket.id];
        }

        socketIdToUsername[socket.id] = player.username;
        socket.emit("room-joined", {
          player: { socketId: socket.id, username: player.username },
          roomData: socketData[roomId],
        });

        socket.to(roomId).emit("player-rejoined", {
          roomData: socketData[roomId],
        });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    /**
     * Handles starting the game.
     * @param {string} roomId - The ID of the room where the game is started.
     */
    socket.on("start-game", (roomId) => {
      console.log("new game", roomId);
      if (socketData[roomId]) {
        switch (socketData[roomId].game.name) {
          case "fuckTheDealer":
            const ftdLogic = new FuckTheDealerLogic(io, roomId, socketData);
            ftdLogic.startGame();
            break;
          case "bussDriver":
            const bdLogic = new BussDriverLogic(io, roomId, socketData);
            bdLogic.startGame();
            break;
          default:
            console.log(`Unknown game: ${socketData[roomId].game.name}`);
            break;
        }
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    /**
     * Handles player actions within the game.
     * @param {Object} data - Data containing the action, room ID, and any extra data.
     */
    // Handling player actions on the server
    socket.on("player-action", (data) => {
      const { action, roomId, ...extraData } = data; // Destructure action, roomId, and extra data
      if (socketData[roomId]) {
        console.log(`Action received: ${action} for room: ${roomId}`);
        console.log("GAME: ", socketData[roomId].game.name);
        switch (socketData[roomId].game.name) {
          case "fuckTheDealer":
            const ftdLogic = new FuckTheDealerLogic(io, roomId, socketData);
            ftdLogic.handlePlayerAction(action, extraData); // Pass extra data to the game logic
            break;
          case "bussDriver": {
            const bdLogic = new BussDriverLogic(io, roomId, socketData);
            bdLogic.handlePlayerAction(action, extraData);
            break;
          }
          default:
            console.log(`Unknown game: ${socketData[roomId].game.name}`);
            break;
        }
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    /**
     * Handles disconnection of a user.
     */
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const username = socketIdToUsername[socket.id];

      // Set a timeout to delete the user data after a specified period (e.g., 1 minute)
      userTimeouts[socket.id] = setTimeout(() => {
        // Delete user information
        delete socketIdToUsername[socket.id];
        for (const roomId in socketData) {
          const room = socketData[roomId];
          const playerIndex = room.players.findIndex(
            (player) => player.socketId === socket.id
          );
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            socket.to(roomId).emit("player-left", username);

            if (room.players.length === 0) {
              delete socketData[roomId];
              console.log(`Room ${roomId} deleted because it is empty.`);
            }
            break;
          }
        }
      }, 60000); // Timeout period in milliseconds (60000ms = 1 minute)
    });
  });
}

module.exports = initializeSocket;
