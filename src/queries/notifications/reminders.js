export default {
  // ladder match messages
  "pending-matches": (challenger, opponent, opponent_id) =>
    `Hey ${opponent},\nYou have a pending challenge from ${challenger}.\nAccept or decline it here:\nhttps://northmanlysquash.com/profile/${opponent_id}`,

  "pending-playing": (player_1, player_2, player_2_phone) =>
    `Hey ${player_1},\nYou have a pending ladder match against ${player_2}.\nContact them on ${player_2_phone} to organise a time to play.\nOnce organised message Gil on 0433641873 to book in the match!`,

  "pending-result": (player_1, player_2, user_id) =>
    `Hey ${player_1},\nHow did you go against ${player_2}.\nPut your result in here:\nhttps://northmanlysquash.com/profile/${user_id}`,

  "challenge-submitted": (firstname, challenger_name, challenged) =>
    `Hey ${firstname}!\nYou have been challenged to a ladder match by ${challenger_name}.\nAccept or decline it here:\nhttps://northmanlysquash.com/profile/${challenged}`,

  "challenge-accepted": (firstname, challenged_name, challenged_phone) =>
    `Hey ${firstname}!\nYour challenge to ${challenged_name} has been accepted!\nContact ${challenged_name} on ${challenged_phone} to organise a time to play.`,

  "challenge-declined": (firstname, challenged_name) =>
    `Hey ${firstname}!\nYour challenge to ${challenged_name} has been declined!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`,

  "ladder-match-winner-not-changed": (winner_firstname, loser_firstname) =>
    `Hey ${winner_firstname}!\nWell done on the win against ${loser_firstname}.\nChallenge someone else at\nhttps://northmanlysquash.com/competition`,

  "ladder-match-loser-not-changed": (loser_firstname, winner_firstname) =>
    `Hey ${loser_firstname}!\nBetter luck next time against ${winner_firstname}.\nChallenge someone else at\nhttps://northmanlysquash.com/competition`,

  "ladder-match-winner-changed": (
    winner_firstname,
    loser_firstname,
    new_winner_rank
  ) =>
    `Hey ${winner_firstname}!\nWell done on the win against ${loser_firstname}.\nYou're now ranked ${new_winner_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`,

  "ladder-match-loser-changed": (loser_firstname, new_loser_rank) =>
    `Hey ${loser_firstname}!\nBetter luck next time.\nYou've been bumped down to ${new_loser_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`,

  // user account messages
  "password-reset": (token) =>
    `Click here to reset your password:\nhttps://northmanlysquash.com/reset-password?token=${token}`,

  // social session messages

  "social-freebie-reminder": ({ firstname }) =>
    `Hey ${firstname}, Sign up to this weeks Monday Social night for FREE!\nhttps://northmanlysquash.com/social\nafter 3 social weeks in a row you get the 4th for free!`,

  "social-recent-user": ({ firstname }) =>
    `Hey ${firstname}, Monday Social night signups are now open!\n Sign up at\nhttps://northmanlysquash.com/social`,

  "welcome-new-user": ({ firstname }) =>
    `Welcome to North Manly Squash club ${firstname}!\nSign up to the ladder league here https://northmanlysquash.com/competition\nSign up to social events here https://northmanlysquash.com/social`,

  "ladder-user-demoted": ({ firstname, new_rank }) =>
    `Hey ${firstname} due to inactivity on the ladder league you have been demoted to ${new_rank}.\nChallenge someone at\nhttps://northmanlysquash.com/competition`,
};
