const axios = require("axios");


/**
 * Fetch a new deck from the deck of cards api.
 * @returns - Returns the new deck object
 */
const getNewDeck = async () => {
  try {
    const response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    /* const response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS"
    ); */
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // Return null in case of an error
  }
};

/**
 * Fetch a new deck from the deck of cards api.
 * @param deckId - The id of the deck we want to draw a card from
 * @param count - How many cards to draw
 * @returns - Returns the deck object with the cards key with the drawn card
 */
const drawACard = async (deckId, count = 1) => {
  try {
    const response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // Return null in case of an error
  }
};


/**
 * Add a card to a pile
 * @param deckId - The id of the deck we want to draw a card from
 * @param pileName - What pile to add a card to, if its non existent creates new pile otherwise adds to existing pile
 * @param card - Which card value to add to pile
 * @returns - Returns the deck object with the piles
 */
const addToPile = async (deckId, pileName, card) => {
  try {
    const response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/?cards=${card}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // Return null in case of an error
  }
};


/**
 * List all the cards in a pile
 * @param deckId - The id of the deck we want to draw a card from
 * @param pileName - What pile to list.
 * @returns - Returns the deck object with the cards and piles and the cards in the given pile.
 */
const listPileCards = async (deckId, pileName) => {
  try {
    const response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/list/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // Return null in case of an error
  }
};

module.exports = { getNewDeck, drawACard, addToPile, listPileCards };
