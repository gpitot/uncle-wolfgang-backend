import { query } from "../query";
import fetch from "node-fetch";
import FormData from "form-data";

const getNotifications = (user_id) => {
  const sql = `
   select 
    id,
    title,
    description,
    action_positive_text,
    action_positive_link,
    action_negative_text,
    action_negative_link
   from notifications
   where acknowledged = false
   and
   user_id = $1;
   `;
  return new Promise((resolve, reject) => {
    query(sql, [user_id])
      .then((data) => {
        return resolve(data.rows);
      })
      .catch(() => {
        reject("An unknown error occurred");
      });
  });
};

const addNotification = ({
  user_id,
  title,
  description,
  action_positive_text,
  action_positive_link,
  action_negative_text,
  action_negative_link,
}) => {
  const sql = `
  insert into notifications 
  (user_id, title, description, action_positive_text, action_positive_link, action_negative_text, action_negative_link, notification_date)
  values ($1, $2, $3, $4, $5, $6, $7, $8);`;
  console.log("adding notification");
  query(sql, [
    user_id,
    title,
    description,
    action_positive_text,
    action_positive_link,
    action_negative_text,
    action_negative_link,
    Date.now(),
  ])
    .then(() => {
      console.log("added notification----------");
    })
    .catch((err) => {
      console.log(err);
      console.log("An unknown error occurred");
    });
};

const acknowledgeNotification = ({ id }) => {
  const sql = `
    update notifications
    set acknowledged = true
    where id = $1`;

  return new Promise((resolve, reject) => {
    query(sql, [id])
      .then(() => {
        return resolve();
      })
      .catch(() => {
        reject("An unknown error occurred");
      });
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

export {
  acknowledgeNotification,
  addNotification,
  getNotifications,
  addAdminNotification,
};
