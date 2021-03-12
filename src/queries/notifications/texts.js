const userChallengedText = {
  title: "You've been challenged to a ladder match!",
  link: (userid, matchid) => `/profile/${userid}?action=accept_challenge&match=${matchid}`,
};

export { userChallengedText };
