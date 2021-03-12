import { query } from "../query";

const getNotifications = (user_id) => {
  const sql = `
   select * from notifications
   where acknowledged = true
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

const addNotification = ({ user_id, title, description, link }) => {
  const sql =
    "insert into notifications (user_id, title, description, link, notification_date) values ($1, $2, $3, $4, $5);";
  query(sql, [user_id, title, description, link, Date.now()])
    .then(() => {
      console.log("added notification----------");
    })
    .catch(() => {
      console.log("An unknown error occurred");
    });
};

const acknowledgeNotification = (id) => {
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

export { acknowledgeNotification, addNotification, getNotifications };
