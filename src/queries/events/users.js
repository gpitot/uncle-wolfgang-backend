import pool from '../index';

const getUsers = ({ event_id, event_date }) => {
  const sql = `
    SELECT * FROM user_event 
    WHERE event_id = $1 and event_date > $2;
    `;
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        reject(err);
      }

      client
        .query(sql, [event_id, event_date])
        .then((data) => {
          resolve(data.rows);
        })
        .catch((err) => reject(err))
        .finally(() => release());
    });
  });
};

const insertUserEvent = ({
  firstname,
  event_id,
  paid = false,
  receipt = null,
}) => {
  const sql = `
    INSERT INTO user_event (firstname, event_date, event_id, paid, receipt)
     VALUES ($1, now(), $2, $3, $4);
    `;

  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        reject(err);
      }
      console.log(firstname, event_id, paid, receipt);
      client
        .query(sql, [firstname, event_id, paid, receipt])
        .then((data) => {
          resolve(data.rows);
        })
        .catch((err) => reject(err))
        .finally(() => release());
    });
  });
};

export { getUsers, insertUserEvent };
