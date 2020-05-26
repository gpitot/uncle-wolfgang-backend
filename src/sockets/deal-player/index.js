import calculateOdds, { getHandsFromPlayers } from '../../dealer/odds';

const deal = ({ io, players, state, gameConfig, cards }) => {
  state.inGame = true;

  players.forEach((player) => {
    player.cards = [];
  });

  for (let i = 0; i < gameConfig.cardsPerPlayer; i += 1) {
    //deal cards here

    players.forEach((player) => {
      player.cards.push(cards[0]);
      cards.splice(0, 1);
    });
  }

  const preflop = calculateOdds(getHandsFromPlayers(players), []);
  players.forEach((player, i) => {
    io.to(player.id).emit('deal', {
      cards: player.cards,
      ...state,
    });

    io.to(player.id).emit('odds', {
      odds: preflop[i],
    });
  });
};

export default deal;
