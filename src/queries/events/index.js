import pool from '../index';

const sql = `
SELECT * FROM events;
`;

const getEvents = () => {
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        reject(err);
      }

      client
        .query(sql)
        .then((data) => {
          resolve(data.rows);
        })
        .catch((err) => reject(err))
        .finally(() => release());
    });
  });
};

export { getEvents };
