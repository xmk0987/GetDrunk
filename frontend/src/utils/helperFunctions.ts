import { Card } from "./types/types";

/**
 * Maps the card value to a number for comparison.
 * @param value - The card value as a string.
 * @returns The numeric value of the card.
 */
export const mapCardValueToNumber = (value: string): number => {
  const cardValues: Record<string, number> = {
    ACE: 1,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
  };
  return cardValues[value] || parseInt(value, 10);
};

function cardValue(cardCode: string): number {
  // Create a dictionary to map card ranks to values
  const cardValues: { [key: string]: number } = {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "0": 10,
    J: 11,
    Q: 12,
    K: 13,
  };

  // Extract the rank from the card code
  const rank = cardCode.slice(0, -1);

  // Return the value corresponding to the rank
  return cardValues[rank];
}

/**
 * Groups cards by their values.
 * @param cards - The array of cards to group.
 * @returns An object with card values as keys and arrays of cards as values.
 */
export const groupCardsByValue = (cards: Card[]): Record<string, Card[]> => {
  return cards.reduce((acc, card) => {
    const cardValue = mapCardValueToNumber(card.value).toString();
    if (!acc[cardValue]) {
      acc[cardValue] = [];
    }
    acc[cardValue].push(card);
    return acc;
  }, {} as Record<string, Card[]>);
};

/**
 * Compares two strings and returns true if they are the same, false otherwise.
 * @param str1 - The first string to compare.
 * @param str2 - The second string to compare.
 * @returns True if the strings are the same, otherwise false.
 */
export const isEqual = (str1: string, str2: string | null): boolean => {
  if (!str1 || !str2) {
    return false;
  }

  return cardValue(str1) === cardValue(str2);
};
