const userChallengedText = {
  title: "Ladder match",
  description: "You've been challenged to a ladder match!",
  action_positive_text: "Accept",
  action_positive_link: (userid, matchid) =>
    `/profile/${userid}?action=accept_challenge&match=${matchid}`,
};

export { userChallengedText };
