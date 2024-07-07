import { FuckTheDealerLogic } from "../utils/gameLogics/fuckTheDealerLogic";

// FUCK THE DEALAER TEST CONSTANTS

export const TEST_FTD_GAME = {
  error: null,
  message: "",
  loading: false,
  player: { socketId: "hyNJAbsVqWeNVhRsAACX", username: "Player1" },
  gameLogic: new FuckTheDealerLogic(),
  roomInfo: {
    admin: "Player1",
    game: {
      dealer: {
        socketId: "hyNJAbsVqWeNVhRsAACX",
        username: "Player1",
      },
      dealerTurn: 1,
      deck: {
        success: true,
        deck_id: "pxtqd80jbzai",
        cards: [
          {
            code: "9D",
            image: "https://deckofcardsapi.com/static/img/9D.png",
            images: {
              svg: "https://deckofcardsapi.com/static/img/9D.svg",
              png: "https://deckofcardsapi.com/static/img/9D.png",
            },
            suit: "DIAMONDS",
            value: "9",
          },
        ],
        remaining: 51,
      },
      guessNumber: 1,
      guesser: {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
      name: "fuckTheDealer",
      playedCards: [],
      status: "playing",
    },
    players: [
      {
        socketId: "hyNJAbsVqWeNVhRsAACX",
        username: "Player1",
      },
      {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
      {
        socketId: "hyNJgfdgdfgadfa",
        username: "Player3",
      },
    ],
    roomId: "testroom",
  },
  resetAll: jest.fn(),
  setError: jest.fn(),
  setLoading: jest.fn(),
  startGame: jest.fn(),
  handlePlayerAction: jest.fn(),
};

export const TEST_FTD_GAME_OVER = {
  error: null,
  message: "",
  loading: false,
  player: { socketId: "hyNJAbsVqWeNVhRsAACX", username: "Player1" },
  gameLogic: new FuckTheDealerLogic(),
  roomInfo: {
    admin: "Player1",
    game: {
      dealer: {
        socketId: "hyNJAbsVqWeNVhRsAACX",
        username: "Player1",
      },
      dealerTurn: 1,
      deck: {
        success: true,
        deck_id: "pxtqd80jbzai",
        cards: [],
        remaining: 0,
      },
      guessNumber: 1,
      guesser: {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
      name: "fuckTheDealer",
      playedCards: [],
      status: "playing",
    },
    players: [
      {
        socketId: "hyNJAbsVqWeNVhRsAACX",
        username: "Player1",
      },
      {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
      {
        socketId: "hyNJgfdgdfgadfa",
        username: "Player3",
      },
    ],
    roomId: "pxKKT3G4Gi",
  },
  resetAll: jest.fn(),
  setError: jest.fn(),
  setLoading: jest.fn(),
  startGame: jest.fn(),
  handlePlayerAction: jest.fn(),
};



