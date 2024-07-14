/* eslint-disable testing-library/no-node-access */
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useGameSocket } from "../../Hooks/useGameSocket";
import { RingOfFireLogic } from "../../utils/gameLogics/ringOfFireLogic";
import { TEST_ROF_GAME } from "../testConstants";
import RingOfFire from "../../Pages/Games/RingOfFire/RingOfFIre";

// Mock the useGameSocket hook
jest.mock("../../Hooks/useGameSocket");

describe("Ring Of Fire Game", () => {
  const mockUseGameSocket = useGameSocket as jest.MockedFunction<
    typeof useGameSocket
  >;

  const mockReturnValue = {
    error: null,
    message: "It's your turn!",
    loading: false,
    player: { socketId: "hyNJAbsVqWeNVhRsAACX", username: "Player1" },
    gameLogic: new RingOfFireLogic(),
    roomInfo: TEST_ROF_GAME.roomInfo,
    resetAll: jest.fn(),
    setError: jest.fn(),
    setLoading: jest.fn(),
    startGame: jest.fn(),
    handlePlayerAction: jest.fn(),
  };

  it("renders GetIntoGame component when there is no game data", () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      message: "",
      player: null,
      gameLogic: new RingOfFireLogic(),
      roomInfo: null,
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if GetIntoGame component is rendered
    expect(screen.getByText("Create Room")).toBeInTheDocument();
    expect(screen.getByText("Join Room")).toBeInTheDocument();
  });

  it("renders GameLobby component when game status is lobby", () => {
    const initialLogic = new RingOfFireLogic();
    initialLogic.status = "lobby";

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "ringOfFire",
          status: "lobby",
        },
      },
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if GameLobby component is rendered
    const lobbyElement = screen.getByTestId("lobby");
    expect(lobbyElement).toBeInTheDocument();
  });

  it("renders playing state correctly", () => {
    const initialLogic = new RingOfFireLogic();
    initialLogic.status = "playing";
    initialLogic.deck = { remaining: 52 };
    initialLogic.cards = Array(52).fill(1);
    initialLogic.playerInTurn = {
      socketId: "hyNJAbsVqWeNVhRsAACX",
      username: "Player1",
    };

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "ringOfFire",
          status: "playing",
        },
      },
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if the player's turn is displayed
    expect(screen.getByTestId("rof-turn")).toBeInTheDocument();
    expect(screen.getByTestId("rof-self-player")).toBeInTheDocument();
  });

  it("renders the correct number of cards in the circle", () => {
    const initialLogic = new RingOfFireLogic();
    initialLogic.status = "playing";
    initialLogic.deck = { remaining: 52 };
    initialLogic.cards = Array(52).fill(1);
    initialLogic.playerInTurn = {
      socketId: "hyNJAbsVqWeNVhRsAACX",
      username: "Player1",
    };

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "ringOfFire",
          status: "playing",
        },
      },
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if the correct number of cards are rendered
    const cardButtons = screen.getAllByRole("button", {
      name: /back of card/,
    });
    expect(cardButtons).toHaveLength(52);

    // Verify the position and rotation of a few cards
    cardButtons.forEach((button, index) => {
      const angle = (360 / 52) * index;
      const x = 200 * Math.cos((angle * Math.PI) / 180);
      const y = 200 * Math.sin((angle * Math.PI) / 180);
      const transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

      expect(button.parentElement).toHaveStyle(`transform: ${transform}`);
      expect(button).toHaveStyle(`transform: rotate(${-angle}deg)`);
    });
  });

  it("displays card rule when card is turned and rule button is clicked", async () => {
    const initialLogic = new RingOfFireLogic();
    initialLogic.status = "playing";
    initialLogic.deck = { remaining: 52 };
    initialLogic.cards = Array(52).fill(1);
    initialLogic.playerInTurn = {
      socketId: "hyNJAbsVqWeNVhRsAACX",
      username: "Player1",
    };
    initialLogic.card = {
      code: "AS",
      value: "A",
      image: "https://deckofcardsapi.com/static/img/AS.png",
      suit: "SPADES",
    };

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "ringOfFire",
          status: "playing",
        },
      },
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if the turned card image is displayed
    expect(screen.getByAltText("Turned card is AS")).toBeInTheDocument();

    // Click the button to show card rule
    fireEvent.click(screen.getByText("Card Rule"));

    // Wait for the card rule to be displayed
    await waitFor(() => {
      expect(screen.getByTestId("rof-turned-card-rules")).toBeInTheDocument();
    });

    // Click the button to close the card rule
    fireEvent.click(screen.getByText("CLOSE"));

    // Wait for the card rule to be hidden
    await waitFor(() => {
      expect(
        screen.queryByTestId("rof-turned-card-rules")
      ).not.toBeInTheDocument();
    });
  });

  it("renders GameOver component when the game is over", () => {
    const initialLogic = new RingOfFireLogic();
    initialLogic.status = "playing";
    initialLogic.deck = { remaining: 1 };

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "ringOfFire",
          status: "playing",
        },
      },
    });

    render(
      <MemoryRouter>
        <RingOfFire />
      </MemoryRouter>
    );

    // Check if GameOver component is rendered
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
  });
});
