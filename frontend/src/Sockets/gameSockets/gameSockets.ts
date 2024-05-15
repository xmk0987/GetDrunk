import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initiateSocketConnection = (url: string): Socket => {
  socket = io(url);
  return socket;
};

export const createRoom = async (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    socket.emit("create-room", username);
    socket.on("room-created", (data) => {
      resolve(data);
    });
    socket.on("error", (err) => {
      reject(err);
    });
  });
};

export const joinRoom = async (
  roomId: string,
  username: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    socket.emit("join-room", { roomId, username });
    socket.on("room-joined", (data) => {
      resolve(data);
    });
    socket.on("error-joining-room", (err) => {
      reject(err);
    });
  });
};

export const getPlayers = (roomId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    socket.emit("get-players", roomId);
    socket.on("players-fetched", ({ players }) => {
      resolve(players);
    });
    socket.on("error", (err) => {
      reject(err);
    });
  });
};
