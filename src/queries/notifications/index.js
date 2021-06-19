import fetch from "node-fetch";
import FormData from "form-data";
import { sendMessage } from "../../twilio-api";
import { query } from "../query";
import REMINDERS from "./reminders";

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

//sms
const addLadderChallengeSubmittedNotification = async (
  challenger_name,
  challenged
) => {
  //get firstname of challenger
  //get name and phone of challenged
  const { firstname, phone } = await getDetails(challenged);
  const message = `Hey ${firstname}!\nYou have been challenged to a ladder match by ${challenger_name}.\nAccept it here:\nhttps://northmanlysquash.com/profile/${challenged}`;
  sendMessage(message, phone);
  addSMSSentNotification(challenged, message);
};

const addLadderChallengeAcceptedNotification = (challenged_name, match_id) => {
  const sql = `
  select users.id, users.firstname, users.phone
  from ladder_matches inner join users 
  on ladder_matches.player_1 = users.id 
  where ladder_matches.id = $1`;
  query(sql, [match_id])
    .then((res) => {
      if (res.rows.length > 0) {
        const { id, firstname, phone } = res.rows[0];

        const message = `Hey ${firstname}!\nYour challenge to ${challenged_name} has been accepted.\nContact Gil or Pete to set up a discounted ladder booking.`;
        sendMessage(message, phone);
        addSMSSentNotification(id, message);
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

  const { firstname: winner_firstname, phone: winner_phone } = await getDetails(
    winner
  );
  const { firstname: loser_firstname, phone: loser_phone } = await getDetails(
    loser
  );
  if (winner_firstname === undefined || loser_firstname === undefined) return;

  const winnerMessage = `Hey ${winner_firstname}!\nWell done on the win.\nYou're now ranked ${new_winner_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`;
  sendMessage(winnerMessage, winner_phone);

  const loserMessage = `Hey ${loser_firstname}!\nBetter luck next time.\nYou've been bumped down to ${new_loser_rank}!\nChallenge someone else at\nhttps://northmanlysquash.com/competition`;
  sendMessage(loserMessage, loser_phone);

  addSMSSentNotification(winner, winnerMessage);
  addSMSSentNotification(loser, loserMessage);
};

const reminderNotification = async ({ reminderType, player_1, player_2 }) => {
  const { firstname: player_1_firstname, phone: player_1_phone } =
    await getDetails(player_1);

  const { firstname: player_2_firstname, phone: player_2_phone } =
    await getDetails(player_2);

  if (player_1_firstname === undefined || player_2_firstname === undefined)
    return;

  if (reminderType === "pending-matches") {
    // send reminder to opponent only
    const message = REMINDERS[reminderType](
      player_1_firstname,
      player_2_firstname,
      player_2
    );

    sendMessage(message, player_2_phone);
    addSMSSentNotification(player_2, message);
    return;
  }

  if (reminderType === "pending-playing") {
    // send reminder to opponent only
    sendMessage(
      REMINDERS[reminderType](player_1_firstname, player_2_firstname),
      player_1_phone
    );
    sendMessage(
      REMINDERS[reminderType](player_2_firstname, player_1_firstname),
      player_2_phone
    );
    addSMSSentNotification(
      player_1,
      REMINDERS[reminderType](player_1_firstname, player_2_firstname)
    );
    addSMSSentNotification(
      player_2,
      REMINDERS[reminderType](player_2_firstname, player_1_firstname)
    );
    return;
  }

  if (reminderType === "pending-result") {
    // send reminder to opponent only
    sendMessage(
      REMINDERS[reminderType](player_1_firstname, player_2_firstname, player_1),
      player_1_phone
    );
    sendMessage(
      REMINDERS[reminderType](player_2_firstname, player_1_firstname, player_2),
      player_2_phone
    );

    addSMSSentNotification(
      player_1,
      REMINDERS[reminderType](player_1_firstname, player_2_firstname, player_1)
    );
    addSMSSentNotification(
      player_2,
      REMINDERS[reminderType](player_2_firstname, player_1_firstname, player_2)
    );
    return;
  }
};

const addAdminSheetsNotification = (message) => {
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

const addSMSSentNotification = (userid, message) => {
  const sql = "INSERT INTO NOTIFICATIONS_SENT (user_id, message, notification_date) values ($1, $2, $3)";
  query(sql, [userid, message, Date.now()]);
};

const getSMSSentNotifications = () => {
  const sql = `
    SELECT n.user_id , n.message, n.notification_date, u.firstname, u.lastname
    FROM
    notifications_sent as n
    inner join users as u
    on n.user_id = u.id
    order by n.notification_date desc;
  `;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

export {
  addLadderChallengeSubmittedNotification,
  addAdminSheetsNotification,
  addLadderChallengeAcceptedNotification,
  addLadderResultApprovedNotification,
  reminderNotification,
  getSMSSentNotifications,
};
