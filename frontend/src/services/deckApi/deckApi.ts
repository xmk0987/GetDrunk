import axios from "axios";

export const getPileCards = async (deckId: string, pileName: string) => {
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

