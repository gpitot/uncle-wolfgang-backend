import { CardGroup, OddsCalculator } from 'poker-odds-calculator';

const remap = (card) => {
  card = card.replace('10', 't');
  return card;
};

const getHandsFromPlayers = (players) => {
  const hands = players.map(({ cards }) => {
    return cards.map((card) => remap(card));
  });
  return hands;
};

const getOddsPostFlop = (players, board) => {
  const hands = getHandsFromPlayers(players);
  const handStrings = hands.map((hand) => CardGroup.fromString(hand.join()));
  board = board.map((card) => remap(card));
  const boardString = CardGroup.fromString(board.join(''));
  const result = OddsCalculator.calculate(handStrings, boardString);
  return result.equities.map((eq) => eq.getEquity());
};

const calculateOdds = (hands) => {
  if (hands.length < 2) return hands.map(() => 100);
  const handStrings = hands.map((hand) => CardGroup.fromString(hand.join()));

  const result = OddsCalculator.calculate(handStrings, []);
  return result.equities.map((eq) => eq.getEquity());
};

export { getHandsFromPlayers, getOddsPostFlop };
export default calculateOdds;
