const axios = require("axios");

const baseURL = "https://deckofcardsapi.com/api/deck/";

// Axios instance with base URL
const axiosInstance = axios.create({
  baseURL,
});

// Function to handle API request and response
const handleRequest = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    throw error; // Throw the error for handling in the caller function
  }
};

// Fetch a new deck from the deck of cards API
const getNewDeck = async () => {
  try {
    const response = await handleRequest(
      axiosInstance.get("new/shuffle/?deck_count=1")
    );
    /*     const response = await handleRequest(
      axiosInstance.get("new/shuffle/?cards=AS,2S,KS,AD")
    ); */
    return response;
  } catch (error) {
    throw error;
  }
};

// Draw a card from a deck
const drawACard = async (deckId, count = 1) => {
  try {
    const response = await handleRequest(
      axiosInstance.get(`${deckId}/draw/?count=${count}`)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Add a card to a pile
const addToPile = async (deckId, pileName, card) => {
  try {
    const response = await handleRequest(
      axiosInstance.get(`${deckId}/pile/${pileName}/add/?cards=${card}`)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// List all the cards in a pile
const listPileCards = async (deckId, pileName) => {
  try {
    const response = await handleRequest(
      axiosInstance.get(`${deckId}/pile/${pileName}/list/`)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Draw a specific card from a pile
const drawFromPile = async (deckId, pileName, cardCode) => {
  try {
    const response = await handleRequest(
      axiosInstance.get(`${deckId}/pile/${pileName}/draw/?cards=${cardCode}`)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Discard a card into the discard pile
const discardCard = async (deckId, card) => {
  return await addToPile(deckId, "discard", card);
};

// Shuffle the deck
const shuffleDeck = async (deckId) => {
  try {
    const response = await handleRequest(
      axiosInstance.post(`${deckId}/shuffle/`)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Return a pile to the deck and shuffle
const returnPileToDeck = async (deckId, pileName) => {
  try {
    const response = await handleRequest(
      axiosInstance.post(`${deckId}/pile/${pileName}/return`)
    );
    if (response.success) {
      return await shuffleDeck(deckId);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const returnAllCardsToDeck = async (deckId) => {
  try {
    const response = await handleRequest(
      axiosInstance.post(`${deckId}/return`)
    );
    if (response.success) {
      return await shuffleDeck(deckId);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
  drawFromPile,
  discardCard,
  returnPileToDeck,
  returnAllCardsToDeck,
};
