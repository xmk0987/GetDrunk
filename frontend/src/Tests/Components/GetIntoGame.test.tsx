import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetIntoGame from "../../Components/Games/GetIntoGame/GetIntoGame";
import { useSocket } from "../../Providers/SocketContext";

// Mock the useSocket hook
jest.mock("../../Providers/SocketContext");

describe("GetIntoGame Component", () => {
  const mockSetError = jest.fn();
  const mockSetLoading = jest.fn();
  const mockEmit = jest.fn();

  beforeEach(() => {
    // Mock implementation of useSocket
    (useSocket as jest.Mock).mockReturnValue({
      socket: {
        emit: mockEmit,
      },
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  it("renders Create Room and Join Room buttons initially", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    // Check if "Create Room" button is in the document
    const createButton = screen.getByText("Create Room");
    expect(createButton).toBeInTheDocument();

    // Check if "Join Room" button is in the document
    const joinButton = screen.getByText("Join Room");
    expect(joinButton).toBeInTheDocument();
  });

  it("changes view to Create Room form when Create Room button is clicked", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const createButton = screen.getByText("Create Room");
    fireEvent.click(createButton);

    // Check if the Create Room form is displayed
    const nameLabel = screen.getByText("Your name:");
    expect(nameLabel).toBeInTheDocument();

    const createRoomButton = screen.getByText("CREATE");
    expect(createRoomButton).toBeInTheDocument();
  });

  it("changes view to Join Room form when Join Room button is clicked", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    // Check if the Join Room form is displayed
    const roomNameLabel = screen.getByText("Room name:");
    expect(roomNameLabel).toBeInTheDocument();

    const joinRoomButton = screen.getByText("JOIN");
    expect(joinRoomButton).toBeInTheDocument();
  });

  it("changes view to default when back button is clicked from Create Room view", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    // Click "Create Room" button to change view
    const createButton = screen.getByText("Create Room");
    fireEvent.click(createButton);

    // Click "Back" button to return to default view
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    // Check if the default buttons are displayed again
    const createButtonAfterBack = screen.getByText("Create Room");
    expect(createButtonAfterBack).toBeInTheDocument();

    const joinButtonAfterBack = screen.getByText("Join Room");
    expect(joinButtonAfterBack).toBeInTheDocument();
  });

  it("changes view to default when back button is clicked from Join Room view", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    // Click "Join Room" button to change view
    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    // Click "Back" button to return to default view
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    // Check if the default buttons are displayed again
    const createButtonAfterBack = screen.getByText("Create Room");
    expect(createButtonAfterBack).toBeInTheDocument();

    const joinButtonAfterBack = screen.getByText("Join Room");
    expect(joinButtonAfterBack).toBeInTheDocument();
  });

  it("calls setRoomName on room name input change", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    const roomNameInput = screen.getByLabelText("Room name:");
    fireEvent.change(roomNameInput, { target: { value: "Test Room" } });

    expect(roomNameInput).toHaveValue("Test Room");
  });

  it("calls setUsername on username input change", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    const usernameInput = screen.getByLabelText("Your name:");
    fireEvent.change(usernameInput, { target: { value: "Test User" } });

    expect(usernameInput).toHaveValue("Test User");
  });

  it("calls handleCreateRoom when Create Room form is submitted", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const createButton = screen.getByText("Create Room");
    fireEvent.click(createButton);

    const usernameInput = screen.getByLabelText("Your name:");
    fireEvent.change(usernameInput, { target: { value: "Test User" } });

    const createRoomButton = screen.getByText("CREATE");
    fireEvent.click(createRoomButton);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockEmit).toHaveBeenCalledWith("create-room", {
      username: "Test User",
      game_name: "test-game",
    });
  });

  it("calls handleJoinRoom when Join Room form is submitted", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    const roomNameInput = screen.getByLabelText("Room name:");
    fireEvent.change(roomNameInput, { target: { value: "Test Room" } });

    const usernameInput = screen.getByLabelText("Your name:");
    fireEvent.change(usernameInput, { target: { value: "Test User" } });

    const joinRoomButton = screen.getByText("JOIN");
    fireEvent.click(joinRoomButton);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockEmit).toHaveBeenCalledWith("join-room", {
      roomId: "Test Room",
      username: "Test User",
    });
  });

  it("calls setView and setError when handleSetView is called", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const createButton = screen.getByText("Create Room");
    fireEvent.click(createButton);

    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it("calls goBack and resets state", () => {
    render(
      <GetIntoGame
        setError={mockSetError}
        setLoading={mockSetLoading}
        game_name="test-game"
      />
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockSetError).toHaveBeenCalledWith(null);
    const createButtonAfterBack = screen.getByText("Create Room");
    expect(createButtonAfterBack).toBeInTheDocument();
  });
});
