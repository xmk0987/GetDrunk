import spinTheBottleImage from "../images/spinthebottle.webp";
import truthOrdareImage from "../images/truthordare.webp";
import bussDriverImage from "../images/bussdriver.webp";
import ringOfFireImage from "../images/ringoffire.webp";
import beerpongImage from "../images/beerpong.webp";
import thirtyShotsImage from "../images/30min30shot.webp";
import horseRaceImage from "../images/horserace.webp";
import drunkPokerImage from "../images/sipPoker.webp";
import biggerCardImage from "../images/biggerCard.webp";
import drunkDealerImage from "../images/drunkDealer.webp";

// Define the interface for each game's properties
export interface Game {
  name: string;
  image: string;
  desc: string;
  minPlayers: number;
  maxPlayers: number;
  route: string;
  rules: string[];
}

// Define an interface for the complete games object
export interface Games {
  [key: string]: Game;
}

// Type the games object with the Games interface
export const games: Games = {
  spinTheBottle: {
    name: "SPIN THE BOTTLE",
    image: spinTheBottleImage,
    desc: "The old classic. We provide the bottle. You get drunk.",
    minPlayers: 3,
    maxPlayers: Infinity,
    route: "spinTheBottle",
    rules: [
      "Go sit around the device in a circle.",
      "Press the bottle to spin it.",
      "The player that the bottle points to chooses a truth or a dare.",
      "Other players come up with a truth or a dare. (You can use premade ones also if you can't come up with anything)",
      "The player either completes task OR drinks X amount of sips.",
      "The bottle is spinned again.",
    ],
  },
  fuckTheDealer: {
    name: "F*CK THE DEALER",
    image: drunkDealerImage,
    desc: "Lets bend over the house for once.",
    minPlayers: 3,
    maxPlayers: 10,
    route: "fuckTheDealer",
    rules: [
      "Sit around a table in circular fashion, and each player choose a face down card from the deck.",
      "Whoever picked the lowest card (Twos are low, Aces are high) begins as the first dealer. No cards need to be dealt before the game begins.",
      "Dealer asks the first player (typically whoever is to their left to guess the number of the card from the top of the deck.",
      "Should they guess right, the dealer drinks (5) sips and the card is placed in the middle face up. The dealer asks the next person to guess the card number.",
      "Should they guess wrong, the dealer tells whether the card is higher or lower than the guessed card, the player guesses again.",
      "Should they guess right the dealer drinks (2) and the card is placed in the middle face up. The dealer asks the next person to guess the card number.",
      "Should they guess wrong the guesser drinks the difference between the guessed number and the actual card number, the card is placed in the middle and the turn moves to the next player.",
      "The dealer changes if 3 players in a row guess the wrong card.",
      "When 1/3 of the pack is left you can remove the second guess option if you like.",
    ],
  },
  bussdriver: {
    name: "BUSS DRIVER",
    image: bussDriverImage,
    desc: "Can you drive the bus? Hopefully you don't have to.",
    minPlayers: 2,
    maxPlayers: 6,
    route: "bussDriver",
    rules: [
      "Make a pyramid of cards 5 at the bottom 1 at the top.",
      "Deal the rest of the pack between members equally.",
      "Flip the first card of the pyramid from the bottom.",
      "If you have the same number in hand that the pyramid currently turned card is, you can place your card on top of the card and deal X amount of sips",
      "Then turn the next card. Go one row at a time.",
      "The first row one card is worth 2 sips, the next row 4, the third row 6, etc...",
      "You don't have to play a card and can save it for the better rows.",
      "You can place multiple cards at the same time if you have them.",
      "Bussdriver is the person with the most cards in the end of the game after top card of pyramid is played. Bussdriver gets a bonus round.",
      "On ties deal single cards to tied players and the smallest card becomes bussdriver",
      "BONUS ROUND: Make similar pyramid as in the start.",
      "The bussdriver has to get to the top of pyramid without hitting J,Q,K,A.",
      "The bussdriver opens one card of his choosing from each row of the pyramid.",
      "If the card is one of J,Q,K,A drink sips of the row number the card was on.",
      "Replace all cards and the bussdriver goes back to the start.",
      "Repeat this until the bussdriver chooses a card from each row without hitting a face card.",
    ],
  },
  ringOfFire: {
    name: "RING OF FIRE",
    image: ringOfFireImage,
    desc: "Don't burn yourself!",
    minPlayers: 2,
    maxPlayers: Infinity,
    route: "ringOfFire",
    rules: [
      "Shuffle the deck, place a cup in the middle and put the cards facing down in a big circle around the cup so they all are connected",
      "If a player breaks the circle he has to drink.",
      "The drink punishment is 3 sips",
      "Start turning one card at a time and do the action based on the number",
      "Ace is waterfall. Starting with the player who drew the card, every player has to continually drink their drink. You can only stop when the person to their right has stopped drinking.",
      "2 is You, the player who drew the card picks someone to drink.",
      "3 is Me, the player who drew the card drinks.",
      "4 is (Guess the rhyme), All those who identify as female drink.",
      "5 is Thumbmaster, the player who drew the card must put their thumb on the table at a chosen time (before the next five gets picked though, or they lose the right). The last person to put their thumb on the table must drink.",
      "6 is Dicks, All those who identify as male drink.",
      "7 is Heaven, the player who drew the card must point to the sky (at any chosen time before the next 7 is drawn). The last person who points to the sky must drink.",
      "8 is Mate, the player who drew the card picks a drinking mate, who must drink every time they drink. As a secondary rule, you can decide whether that means you always have to drink when they drink, too.",
      "9 is Rhyme, the player who drew the card says a word, and you go around the circle rhyming with that word until someone messes up, and has to drink.",
      "10 is Categories, the player who drew the card thinks of a category (e.g. dogs, cars, types of alcohol), and you go around the circle naming words in that category until someone messes up, and has to drink.",
      "Jack is Make a rule. The player who drew the card makes a new rule (e.g. you can't say the word 'yes' or you can't put your drink down) and anyone who breaks the rule at any time throughout the rest of the game has to drink.",
      "Queen is Question master. You become the question master, and if anybody answers a question asked by you (the player who drew the card), they have to drink. This applies to ANY question.",
      "King is the player who drew the card must pour some of their drink into the cup in the middle. The person to draw the last King has to drink whatever is in the cup in the middle.",
    ],
  },
  thirtyShots: {
    name: "30 SHOTS",
    image: thirtyShotsImage,
    desc: "Hopefully you know how to burp.",
    minPlayers: 1,
    maxPlayers: Infinity,
    route: "30Shots",
    rules: [
      "Set a timer of 30 minutes",
      "Every minute take a shot.",
      "Normal people take a shot of like beer, but if you choose to take heavier shots thats on you.",
    ],
  },
  horseRace: {
    name: "HORSE TRACK",
    image: horseRaceImage,
    desc: "Lets hit the tracks.",
    minPlayers: 2,
    maxPlayers: Infinity,
    route: "horseTrack",
    rules: [
      "The horseracing game requires active participation by only one person: the announcer.",
      "The announcer prepares the field by searching through the deck, taking out the ace (horse) of each suit, and laying them face-up and side by side at one end of the table (these are 'the gates'). ",
      "They then shuffle the deck and lay out a variable number of cards face-down (these form the 'links' of the race) in a straight line perpendicular to the row of aces.",
      "The cards thus appear to form an 'L' or the two legs of a right triangle. The field is now set.",
      "Before the game begins, each player makes bets based on their horse being as simple as 'five on diamonds'.",
      "The player has to drink 1/3 of his bet amount before the race starts as a pay in.",
      "Once all bets are in, the announcer begins the race.",
      "They flip over the top card of the remaining deck. Only the suit of this card matters; the ace of that suit moves forward to the first link.",
      "The announcer narrates the ebb and flow of the game as the betters cheer on their horse.",
      "The announcer continues flipping cards and advancing horses accordingly until one horse wins by passing the final link into the winner's circle.",
      "If all horses pass a link that link is flipped over. The horse that matches the suit that appears in the link will be pulled one link backwards. (Can't go back from starting position).",
      "The players who bet on the right horse can give out drinks equal to their bet amount to all the players who chose a losing horse.",
    ],
  },
  drunkPoker: {
    name: "DRUNK POKER",
    image: drunkPokerImage,
    desc: "Broke? No problem play with tolerance.",
    minPlayers: 2,
    maxPlayers: 10,
    route: "drunkPoker",
    rules: [
      "Poker, but you bet on drink amounts. Pay in is 5 sips.",
      "Each player starts the game with a drink of their choice.",
      "Standard poker rules apply. Use Texas Hold'em format for rounds.",
      "Bets are placed by taking sips. You bet sips based on your hand's strength or your bluffing strategy.",
      "Betting rounds: Pre-Flop (bet sips before the flop), Flop (bet sips after three community cards), Turn (bet sips after the fourth card), River (bet sips after the fifth card).",
      "Players reveal their cards after the River. The best hand wins the round.",
      "Losers of each round drink additional sips equal to half the total sips bet in that round.",
      "The game can end after a set number of rounds or at players' discretion.",
      "The player who has taken the least sips by the end of the game can be declared the 'Sobriety Winner.'",
    ],
  },
  biggerCard: {
    name: "CARD BATTLE",
    image: biggerCardImage,
    desc: "Need to get drunk fast?",
    minPlayers: 2,
    maxPlayers: 10,
    route: "cardBattle",
    rules: [
      "Simple. Shuffle deck and give one card to all participants.",
      "Lowest card number (in this case Ace is 1) has to drink the difference between the lowest and highest card.",
      "On tie give the tied players a card and continue until no ties occur.",
    ],
  },
  beerPong: {
    name: "BEER PONG",
    image: beerpongImage,
    desc: "Just throw the ball in the cup...",
    minPlayers: 2,
    maxPlayers: 4,
    route: "beerPong",
    rules: ["You already know beer pong..."],
  },
  truthOrDare: {
    name: "TRUTH OR DARE",
    image: truthOrdareImage,
    desc: "What are you willing to do to hide your secrets?",
    minPlayers: 2,
    maxPlayers: Infinity,
    route: "truthOrDare",
    rules: [
      "Choose player to start.",
      "Player gets asked truth or dare.",
      "Player either completes truth or dare OR drinks 5 sips.",
      "Next players turn.",
    ],
  },
};
