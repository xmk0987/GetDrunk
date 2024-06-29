import React from "react";

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

interface PyramidProps {
  pyramid: Card[];
  turnedCards: { [key: string]: Card[] }; // Adjusted type
}

const Pyramid: React.FC<PyramidProps> = ({ pyramid, turnedCards }) => {
  const totalRows: number = 5;

  const isTurned = (cardCode: string) => {
    return turnedCards.hasOwnProperty(cardCode);
  };

  let cardIndex = 0;
  const rows = Array.from({ length: totalRows }, (_, row) => {
    const cards = Array.from({ length: totalRows - row }, (_, col) => {
      if (cardIndex < pyramid.length) {
        const card = pyramid[cardIndex];
        cardIndex++;
        return (
          <div className="bd-pyramid-stack">
            <img
              src={
                isTurned(card.code)
                  ? card.image
                  : "https://deckofcardsapi.com/static/img/back.png"
              }
              alt={card.code}
            />
            {isTurned(card.code) &&
              turnedCards[card.code].map((playedCard) => (
                <img
                  key={playedCard.code}
                  src={playedCard.image}
                  alt={playedCard.code}
                />
              ))}
          </div>
        );
      }
      return null;
    });
    return (
      <div className="bd-pyramid-row" key={row}>
        <p className="bd-pyramid-row-drink-amount">{2 * row + 2}x</p>
        {cards}
      </div>
    );
  }).reverse();

  return <div className="bd-pyramid-container">{rows}</div>;
};

export default Pyramid;
