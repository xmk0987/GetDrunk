/* eslint-disable testing-library/no-node-access */
import React from "react";
import {
  render,
  screen,
  within,
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
});
