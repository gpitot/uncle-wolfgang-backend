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
  const message = REMINDERS["challenge-submitted"](
    firstname,
    challenger_name,
    challenged
  );
  sendMessage(message, phone, challenged);
};

const addLadderChallengeResponseNotification = async (
  challenged_name,
  match_id,
  challenged_id,
  accepted = true
) => {
  const sqlGetChallengerName = `
        select users.id, users.firstname, users.phone
        from ladder_matches
                 inner join users
                            on ladder_matches.player_1 = users.id
        where ladder_matches.id = $1`;

  const sqlGetChallengedPhone = "select phone from users where id = $1";

  try {
    const res = await query(sqlGetChallengerName, [match_id]);
    if (res.rows.length > 0) {
      const { id, firstname, phone } = res.rows[0];

      const challengedRes = await query(sqlGetChallengedPhone, [challenged_id]);
      const reminderKey = accepted
        ? "challenge-accepted"
        : "challenge-declined";
      const message = REMINDERS[reminderKey](
        firstname,
        challenged_name,
        challengedRes.rows[0].phone
      );
      sendMessage(message, phone, id);
    }
  } catch (e) {
    console.log(e);
  }
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
  const { firstname: winner_firstname, phone: winner_phone } = await getDetails(
    winner
  );
  const { firstname: loser_firstname, phone: loser_phone } = await getDetails(
    loser
  );
  if (winner_firstname === undefined || loser_firstname === undefined) return;

  let winnerMessage;
  let loserMessage;
  //if the higher rank #1 beat #2
  if (winner_rank < loser_rank) {
    winnerMessage = REMINDERS["ladder-match-winner-not-changed"](
      winner_firstname,
      loser_firstname
    );
    loserMessage = REMINDERS["ladder-match-loser-not-changed"](
      loser_firstname,
      winner_firstname
    );
  } else {
    const new_winner_rank = getRankExtension(loser_rank); //0 index
    const new_loser_rank = getRankExtension(loser_rank + 1);
    winnerMessage = REMINDERS["ladder-match-winner-changed"](
      winner_firstname,
      loser_firstname,
      new_winner_rank
    );
    loserMessage = REMINDERS["ladder-match-loser-changed"](
      loser_firstname,
      new_loser_rank
    );
  }

  sendMessage(winnerMessage, winner_phone, winner);
  sendMessage(loserMessage, loser_phone, loser);
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

    sendMessage(message, player_2_phone, player_2);
    return;
  }

  if (reminderType === "pending-playing") {
    // send reminder to opponent only
    sendMessage(
      REMINDERS[reminderType](
        player_1_firstname,
        player_2_firstname,
        player_2_phone
      ),
      player_1_phone,
      player_1
    );
    sendMessage(
      REMINDERS[reminderType](
        player_2_firstname,
        player_1_firstname,
        player_1_phone
      ),
      player_2_phone,
      player_2
    );
    return;
  }

  if (reminderType === "pending-result") {
    // send reminder to opponent only
    sendMessage(
      REMINDERS[reminderType](player_1_firstname, player_2_firstname, player_1),
      player_1_phone,
      player_1
    );
    sendMessage(
      REMINDERS[reminderType](player_2_firstname, player_1_firstname, player_2),
      player_2_phone,
      player_2
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
  const sql =
    "INSERT INTO NOTIFICATIONS_SENT (user_id, message, notification_date) values ($1, $2, $3)";
  query(sql, [userid, message, Date.now()]);
};

const getSMSSentNotifications = () => {
  const sql = `
        SELECT n.user_id, n.message, n.notification_date, u.firstname, u.lastname
        FROM notifications_sent as n
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

//sms
const sendResetPasswordTokenToUser = async (phone, token, user_id) => {
  const message = REMINDERS["password-reset"](token);
  sendMessage(message, phone, user_id);
};

const sendGroupMessage = (users, messageKey) => {
  users.forEach((user) => {
    const message = REMINDERS[messageKey](...user);
    if (message) {
      sendMessage(message, user.phone, user.id);
    }
  });
};

const sendDemotionMessage = (user_id, firstname, rank, phone) => {
  const message = REMINDERS["ladder-user-demoted"]({
    firstname,
    new_rank: getRankExtension(rank),
  });
  sendMessage(message, phone, user_id);
};

const sendWelcomeMessage = (user_id, firstname, phone) => {
  const message = REMINDERS["welcome-new-user"]({ firstname });
  sendMessage(message, phone, user_id);
};

export {
  addLadderChallengeSubmittedNotification,
  addAdminSheetsNotification,
  addLadderChallengeResponseNotification,
  addLadderResultApprovedNotification,
  reminderNotification,
  getSMSSentNotifications,
  sendResetPasswordTokenToUser,
  addSMSSentNotification,
  sendGroupMessage,
  sendDemotionMessage,
  sendWelcomeMessage,
};
