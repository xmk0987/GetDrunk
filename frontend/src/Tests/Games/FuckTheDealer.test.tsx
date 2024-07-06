import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import FuckTheDealer from "../../Pages/Games/FuckTheDealer/FuckTheDealer";

describe("FuckTheDealer Component", () => {
  it("renders the GetIntoGame component with Create Room and Join Room buttons when no game data is set", () => {
    render(
      <MemoryRouter>
        <FuckTheDealer />
      </MemoryRouter>
    );

    // Check if "Create Room" button is in the document
    const createButton = screen.getByText("Create Room");
    expect(createButton).toBeInTheDocument();

    // Check if "Join Room" button is in the document
    const joinButton = screen.getByText("Join Room");
    expect(joinButton).toBeInTheDocument();
  });

  
});
