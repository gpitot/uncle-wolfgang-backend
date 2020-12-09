import pool from '../index';

const query = (q, params = []) => {
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        console.warn(err);
        reject(err);
      }

      client
        .query(q, params)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err))
        .finally(() => release());
    });
  });
};

export { query };
