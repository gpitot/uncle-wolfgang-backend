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

export { addLadderChallengeSubmittedNotification, addAdminNotification, addLadderChallengeAcceptedNotification };
