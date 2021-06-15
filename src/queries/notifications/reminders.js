export default {
  "pending-matches": (challenger, opponent, opponent_id) =>
    `Hey ${opponent},\nYou have a pending challenge from ${challenger}.\nAccept it here:\nhttps://northmanlysquash.com/profile/${opponent_id}`,

  "pending-playing": (player_1, player_2) =>
    `Hey ${player_1},\nLet Gil know when you want to play your ladder match against ${player_2}`,

  "pending-result": (player_1, player_2, user_id) =>
    `Hey ${player_1},\nHow did you go against ${player_2}.\nPut your result in here:\nhttps://northmanlysquash.com/profile/${user_id}`,
};
