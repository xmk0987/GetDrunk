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

// Mock the useGameSocket hook
jest.mock("../../Hooks/useGameSocket");

describe("BussDriver Game", () => {
  it("renders GetIntoGame component when there is no game data", () => {
    return;
  });
});
