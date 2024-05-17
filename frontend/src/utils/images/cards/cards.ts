// HEARTS
export const HA: string = "https://deckofcardsapi.com/static/img/AH.png";
export const H2: string = "https://deckofcardsapi.com/static/img/2H.png";
export const H3: string = "https://deckofcardsapi.com/static/img/3H.png";
export const H4: string = "https://deckofcardsapi.com/static/img/4H.png";
export const H5: string = "https://deckofcardsapi.com/static/img/5H.png";
export const H6: string = "https://deckofcardsapi.com/static/img/6H.png";
export const H7: string = "https://deckofcardsapi.com/static/img/7H.png";
export const H8: string = "https://deckofcardsapi.com/static/img/8H.png";
export const H9: string = "https://deckofcardsapi.com/static/img/9H.png";
export const H10: string = "https://deckofcardsapi.com/static/img/0H.png";
export const HJ: string = "https://deckofcardsapi.com/static/img/JH.png";
export const HQ: string = "https://deckofcardsapi.com/static/img/QH.png";
export const HK: string = "https://deckofcardsapi.com/static/img/KH.png";

// SPADES
export const SA: string = "https://deckofcardsapi.com/static/img/AS.png";
export const S2: string = "https://deckofcardsapi.com/static/img/2S.png";
export const S3: string = "https://deckofcardsapi.com/static/img/3S.png";
export const S4: string = "https://deckofcardsapi.com/static/img/4S.png";
export const S5: string = "https://deckofcardsapi.com/static/img/5S.png";
export const S6: string = "https://deckofcardsapi.com/static/img/6S.png";
export const S7: string = "https://deckofcardsapi.com/static/img/7S.png";
export const S8: string = "https://deckofcardsapi.com/static/img/8S.png";
export const S9: string = "https://deckofcardsapi.com/static/img/9S.png";
export const S10: string = "https://deckofcardsapi.com/static/img/0S.png";
export const SJ: string = "https://deckofcardsapi.com/static/img/JS.png";
export const SQ: string = "https://deckofcardsapi.com/static/img/QS.png";
export const SK: string = "https://deckofcardsapi.com/static/img/KS.png";

// CROSS
export const CA: string = "https://deckofcardsapi.com/static/img/AC.png";
export const C2: string = "https://deckofcardsapi.com/static/img/2C.png";
export const C3: string = "https://deckofcardsapi.com/static/img/3C.png";
export const C4: string = "https://deckofcardsapi.com/static/img/4C.png";
export const C5: string = "https://deckofcardsapi.com/static/img/5C.png";
export const C6: string = "https://deckofcardsapi.com/static/img/6C.png";
export const C7: string = "https://deckofcardsapi.com/static/img/7C.png";
export const C8: string = "https://deckofcardsapi.com/static/img/8C.png";
export const C9: string = "https://deckofcardsapi.com/static/img/9C.png";
export const C10: string = "https://deckofcardsapi.com/static/img/0C.png";
export const CJ: string = "https://deckofcardsapi.com/static/img/JC.png";
export const CQ: string = "https://deckofcardsapi.com/static/img/QC.png";
export const CK: string = "https://deckofcardsapi.com/static/img/KC.png";

// DIAMONDS
export const DA: string = "https://deckofcardsapi.com/static/img/AD.png";
export const D2: string = "https://deckofcardsapi.com/static/img/2D.png";
export const D3: string = "https://deckofcardsapi.com/static/img/3D.png";
export const D4: string = "https://deckofcardsapi.com/static/img/4D.png";
export const D5: string = "https://deckofcardsapi.com/static/img/5D.png";
export const D6: string = "https://deckofcardsapi.com/static/img/6D.png";
export const D7: string = "https://deckofcardsapi.com/static/img/7D.png";
export const D8: string = "https://deckofcardsapi.com/static/img/8D.png";
export const D9: string = "https://deckofcardsapi.com/static/img/9D.png";
export const D10: string = "https://deckofcardsapi.com/static/img/0D.png";
export const DJ: string = "https://deckofcardsapi.com/static/img/JD.png";
export const DQ: string = "https://deckofcardsapi.com/static/img/QD.png";
export const DK: string = "https://deckofcardsapi.com/static/img/KD.png";

// ALL CARDS
export const allCardsImages: Array<string> = [
  HA,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  H8,
  H9,
  H10,
  HJ,
  HQ,
  HK,
  SA,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  SJ,
  SQ,
  SK,
  DA,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
  D8,
  D9,
  D10,
  DJ,
  DQ,
  DK,
  CA,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  C10,
  CJ,
  CQ,
  CK,
];

// Group cards by suit
export const cardsBySuit = allCardsImages.reduce((acc, cardUrl) => {
  // Extract the card code from the URL (e.g., AH, 2H, etc.)
  const cardCodeMatch = cardUrl.match(/\/([A-Z0-9]{2})\.png$/);
  if (cardCodeMatch) {
    const cardCode = cardCodeMatch[1];
    // The suit is the last character of the card code
    const suit = cardCode.slice(-1);
    if (!acc[suit]) {
      acc[suit] = [];
    }
    acc[suit].push(cardUrl);
  } else {
    console.error(`Could not extract card code from URL: ${cardUrl}`);
  }
  return acc;
}, {} as Record<string, string[]>);
