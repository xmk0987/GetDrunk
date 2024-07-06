// Mock implementation for useSocket
export const useSocket = jest.fn().mockReturnValue({
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
});
