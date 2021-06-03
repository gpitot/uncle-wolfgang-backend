import fetch from "node-fetch";
import FormData from "form-data";
import { sendMessage } from "../../twilio-api";
import { query } from "../query";

//sms
const addLadderChallengeSubmittedNotification = (
  challenger_name,
  challenged,
  match_id
) => {
  //get firstname of challenger
  //get name and phone of challenged
  //get match id for url to accept the challenge
  const sql = `
  select firstname, phone from users where id = $1`;
  query(sql, [challenged])
    .then((res) => {
      if (res.rows.length > 0) {
        const { firstname, phone } = res.rows[0];

        const message = `Hey ${firstname}!\nYou have been challenged to a ladder match by ${challenger_name}.\nAccept it here:\nhttps://northmanlysquash.com/profile/${challenged}?action=accept_challenge&match=${match_id}`;
        sendMessage(message, `+61${phone}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const addLadderChallengeAcceptedNotification = (challenged_name, match_id) => {
  const sql = `
  select users.firstname, users.phone
  from ladder_matches inner join users 
  on ladder_matches.player_1 = users.id 
  where ladder_matches.id = $1`;
  query(sql, [match_id])
    .then((res) => {
      if (res.rows.length > 0) {
        const { firstname, phone } = res.rows[0];

        const message = `Hey ${firstname}!\nYour challenge to ${challenged_name} has been accepted.\nContact Gil or Pete to set up a discounted ladder booking.`;
        sendMessage(message, `+61${phone}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRankExtension = (rank) => {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
};

const addLadderResultApprovedNotification = async (
  winner,
  loser,
  winner_rank,
  loser_rank
) => {
  /*
  only send sms to players who are involved and change rank
  e.g. do not send sms if higher player wins
  */
  if (winner_rank < loser_rank) return;
  //lower rank is better
  //remember 0 index
  const new_winner_rank = getRankExtension(loser_rank); //0 index
  const new_loser_rank = getRankExtension(loser_rank + 1);

  const getDetails = async (id) => {
    const sql = `
    select firstname, phone
    from users
    where id = $1
  `;

    const data = await query(sql, [id]);
    const rows = await data.rows;
    if (rows.length === 0) return {};
    return rows[0];
  };

  const { firstname: winner_firstname, phone: winner_phone } = await getDetails(
    winner
  );
  const { firstname: loser_firstname, phone: loser_phone } = await getDetails(
    loser
  );
  if (winner_firstname === undefined || loser_firstname === undefined) return;

  const winnerMessage = `Hey ${winner_firstname}!\nWell done on the win.\nYou're now ranked ${new_winner_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`;
  sendMessage(winnerMessage, `+61${winner_phone}`);

  const loserMessage = `Hey ${loser_firstname}!\nBetter luck next time.\nYou've been bumped down to ${new_loser_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`;
  sendMessage(loserMessage, `+61${loser_phone}`);
};

const addAdminNotification = (message) => {
  try {
    const url =
      "https://docs.google.com/forms/u/1/d/e/1FAIpQLScFKlUumzr2EpfTbaDkTCUjpCBJncA517n7afQDf-xoVaG3Vg/formResponse";
    const formData = new FormData();

    formData.append("entry.1745826593", Date.now());
    formData.append("entry.860934272", message);

    fetch(url, { method: "post", body: formData });
  } catch (err) {
    return;
  }
};

export {
  addLadderChallengeSubmittedNotification,
  addAdminNotification,
  addLadderChallengeAcceptedNotification,
  addLadderResultApprovedNotification,
};
