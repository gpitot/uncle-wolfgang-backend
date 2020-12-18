import { query } from "../query";

const getUsers = ({ event_id, event_date }) => {
  const sql = `
    SELECT * FROM user_events
    WHERE event_id = $1 and event_date > $2::date;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [event_id, event_date])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const addUserEvent = ({
  firstname,
  event_id,
  paid = false,
  receipt = null,
}) => {
  const sql = `
    INSERT INTO user_events (firstname, event_date, event_id, paid, receipt)
     VALUES ($1, now(), $2, $3, $4);
    `;

  return new Promise((resolve, reject) => {
    query(sql, [firstname, event_id, paid, receipt])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

export { getUsers, addUserEvent };
