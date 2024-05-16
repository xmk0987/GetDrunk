const axios = require("axios");

const getNewDeck = async () => {
  try {
    const response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // Return null in case of an error
  }
};

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

module.exports = { getNewDeck, drawACard };
