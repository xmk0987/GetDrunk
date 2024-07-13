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
import FuckTheDealer from "../../Pages/Games/FuckTheDealer/FuckTheDealer";
import { useGameSocket } from "../../Hooks/useGameSocket";
import { FuckTheDealerLogic } from "../../utils/gameLogics/fuckTheDealerLogic";
import { TEST_FTD_GAME, TEST_FTD_GAME_OVER } from "../testConstants";

// Mock the useGameSocket hook
jest.mock("../../Hooks/useGameSocket");

describe("FuckTheDealer Game", () => {
  const mockUseGameSocket = useGameSocket as jest.MockedFunction<
    typeof useGameSocket
  >;

  const mockReturnValue = {
    error: null,
    message: "It's your turn!",
    loading: false,
    player: { socketId: "hyNJAbsVqWeNVhRsAACX", username: "Player1" },
    gameLogic: new FuckTheDealerLogic(),
    roomInfo: TEST_FTD_GAME.roomInfo,
    resetAll: jest.fn(),
    setError: jest.fn(),
    setLoading: jest.fn(),
    startGame: jest.fn(),
    handlePlayerAction: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockReturnValue.gameLogic.setGameData(TEST_FTD_GAME.roomInfo);
    mockUseGameSocket.mockReturnValue(mockReturnValue);
  });

  it("renders GetIntoGame component when there is no game data", () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      message: "",
      player: null,
      gameLogic: new FuckTheDealerLogic(),
      roomInfo: null,
    });

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if GetIntoGame component is rendered
    expect(screen.getByText("Create Room")).toBeInTheDocument();
    expect(screen.getByText("Join Room")).toBeInTheDocument();
  });

  it("renders GameLobby component when game status is lobby", () => {
    const initialLogic = new FuckTheDealerLogic();
    initialLogic.status = "lobby";

    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      gameLogic: initialLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          name: "fuckTheDealer",
          status: "lobby",
        },
      },
    });

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if GameLobby component is rendered
    const lobbyElement = screen.getByTestId("lobby");
    expect(lobbyElement).toBeInTheDocument();
  });

  it("renders game components when game is in playing state", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if game components are rendered
    expect(screen.getByText("It's your turn!")).toBeInTheDocument();
    expect(screen.getByText("Turned card:")).toBeInTheDocument();
    expect(screen.getByAltText("Card to guess")).toBeInTheDocument();
    expect(screen.getByText("F*CK THE DEALER")).toBeInTheDocument();
  });

  it("renders all players in PlayerList component", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if PlayerList component renders all players correctly
    TEST_FTD_GAME.roomInfo.players.forEach((player) => {
      expect(screen.getByText(player.username)).toBeInTheDocument();
    });
  });

  it("marks the dealer and guesser correctly in PlayerList component", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if PlayerList component marks the dealer and guesser correctly and their positions
    const dealerElement = screen.getByText("Dealer");
    const guesserElement = screen.getByText("Guesser");

    expect(dealerElement).toHaveClass("ftd-player-turn dealer");
    expect(guesserElement).toHaveClass("ftd-player-turn guesser");

    // Find the parent element containing "Player1" and "Dealer"
    const player1Element = screen.getByText("Player1");
    const dealerParent = player1Element.closest(".ftd-player") as HTMLElement;
    expect(dealerParent).toBeInTheDocument();
    expect(within(dealerParent).getByText("Dealer")).toBeInTheDocument();

    // Find the parent element containing "Player2" and "Guesser"
    const player2Element = screen.getByText("Player2");
    const guesserParent = player2Element.closest(".ftd-player") as HTMLElement;
    expect(guesserParent).toBeInTheDocument();
    expect(within(guesserParent).getByText("Guesser")).toBeInTheDocument();

    // Ensure only one dealer and one guesser
    expect(screen.getAllByText("Dealer").length).toBe(1);
    expect(screen.getAllByText("Guesser").length).toBe(1);
  });

  it("the turn counter is correctly displayed at start", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    const turnCounter = screen.getByTestId("turn-counter");
    expect(turnCounter).toHaveTextContent("0/3");
  });

  it("doesn't render any played cards at the start", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if the played cards container is empty
    const playedCardsContainer = screen.getByTestId("played-cards");
    expect(playedCardsContainer.children.length).toBe(0);
  });

  it("render the dealer container to the dealer, but not the guesser container", () => {
    mockUseGameSocket.mockReturnValue(mockReturnValue);

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    const dealerContainer = screen.getByTestId("dealer-container");
    expect(dealerContainer).toBeInTheDocument();

    // Check if the guesser container is not rendered
    const guesserContainer = screen.queryByTestId("guesser-container");
    expect(guesserContainer).not.toBeInTheDocument();
  });

  it("render the guesser component to the guesser, but not the dealer container", () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      player: {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
    });

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    const dealerContainer = screen.queryByTestId("dealer-container");
    expect(dealerContainer).not.toBeInTheDocument();

    // Check if the guesser container is not rendered
    const guesserContainer = screen.getByTestId("guesser-container");
    expect(guesserContainer).toBeInTheDocument();
  });

  it("don't render the dealer or guesser component to other players", () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      player: {
        socketId: "hyNJgfdgdfgadfa",
        username: "Player3",
      },
    });

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if the dealer container is not rendered
    const dealerContainer = screen.queryByTestId("dealer-container");
    expect(dealerContainer).not.toBeInTheDocument();

    // Check if the guesser container is not rendered
    const guesserContainer = screen.queryByTestId("guesser-container");
    expect(guesserContainer).not.toBeInTheDocument();
  });

  it("changes the data correctly on smaller wrong guess first half", async () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      player: {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
    });

    const { rerender } = render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Simulate clicking the wrong card that is too high
    const wrongCard = screen.getByTestId("card-11");
    fireEvent.click(wrongCard);

    // Check that handlePlayerAction is called with the correct arguments
    await waitFor(() => {
      expect(mockReturnValue.handlePlayerAction).toHaveBeenCalledWith(
        "GUESS_SMALLER",
        { value: 11 }
      );
    });

    // Mock the server-side response to simulate state change after the guess
    mockReturnValue.gameLogic.setGameData({
      ...TEST_FTD_GAME.roomInfo,
      game: {
        ...TEST_FTD_GAME.roomInfo.game,
        guessNumber: 2, // Update the guessNumber to 2 after the guess
      },
    });

    // Simulate the server emitting the event to the client
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      message: `Player2 guessed 11. The card is smaller.`,
      gameLogic: mockReturnValue.gameLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          ...mockReturnValue.roomInfo.game,
          guessNumber: 2, // Update the guess number
        },
      },
    });

    // Re-render the component to reflect the new state
    rerender(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Assert the message and state changes on the client side
    await waitFor(() => {
      expect(
        screen.getByText("Player2 guessed 11. The card is smaller.")
      ).toBeInTheDocument();
    });

    // Verify the guessNumber is updated to 2
    expect(mockReturnValue.gameLogic.guessNumber).toBe(2);
  });

  it("changes the data correctly on bigger wrong guess first half", async () => {
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      player: {
        socketId: "afasdfdsfdsAACX",
        username: "Player2",
      },
    });

    const { rerender } = render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Simulate clicking the wrong card that is too small
    const wrongCard = screen.getByTestId("card-5");
    fireEvent.click(wrongCard);

    // Check that handlePlayerAction is called with the correct arguments
    await waitFor(() => {
      expect(mockReturnValue.handlePlayerAction).toHaveBeenCalledWith(
        "GUESS_BIGGER",
        { value: 5 }
      );
    });

    // Mock the server-side response to simulate state change after the guess
    mockReturnValue.gameLogic.setGameData({
      ...TEST_FTD_GAME.roomInfo,
      game: {
        ...TEST_FTD_GAME.roomInfo.game,
        guessNumber: 2, // Update the guessNumber to 2 after the guess
      },
    });

    // Simulate the server emitting the event to the client
    mockUseGameSocket.mockReturnValue({
      ...mockReturnValue,
      message: `Player2 guessed 5. The card is bigger.`,
      gameLogic: mockReturnValue.gameLogic,
      roomInfo: {
        ...mockReturnValue.roomInfo,
        game: {
          ...mockReturnValue.roomInfo.game,
          guessNumber: 2, // Update the guess number
        },
      },
    });

    // Re-render the component to reflect the new state
    rerender(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Assert the message and state changes on the client side
    await waitFor(() => {
      expect(
        screen.getByText("Player2 guessed 5. The card is bigger.")
      ).toBeInTheDocument();
    });

    // Verify the guessNumber is updated to 2
    expect(mockReturnValue.gameLogic.guessNumber).toBe(2);
  });

  it("handles wrong answer on second guess", async () => {
    return;
  });

  it("handles wrong answer on first guess on second half", async () => {
    return;
  });

  it("correctly changes turn counter on wrong answer", async () => {
    return;
  });

  it("on 3 wrongs changes dealer correctly", async () => {
    return;
  });

  it("changes guesser on wrong answer", async () => {
    return;
  });

  it("handles correct answer on first guess", async () => {
    return;
  });

  it("renders played cards in the played cards container after right or wrong answer", async () => {
    return;
  });

  it("handles correct answer on second guess", async () => {
    return;
  });

  it("renders GameOver component when no cards are left in deck", () => {
    const initialLogic = new FuckTheDealerLogic();
    initialLogic.setGameData(TEST_FTD_GAME_OVER.roomInfo);

    mockUseGameSocket.mockReturnValue({
      error: null,
      message: "It's your turn!",
      loading: false,
      player: { socketId: "hyNJAbsVqWeNVhRsAACX", username: "Player1" },
      gameLogic: initialLogic,
      roomInfo: TEST_FTD_GAME_OVER.roomInfo,
      resetAll: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
      startGame: jest.fn(),
      handlePlayerAction: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if GameOver component is rendered
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
    expect(screen.getByText("RETURN TO LOBBY")).toBeInTheDocument();
  });
});
