import shuffle from './shuffle';
import common from './decks/common';

const getDeckType = (deck) => {
  return {
    common: common,
  }[deck];
};

const generateCards = (deckName, numDecks = 1) => {
  const deckType = getDeckType(deckName);
  const cards = shuffle(deckType, numDecks);
  return cards;
};

export default generateCards;
