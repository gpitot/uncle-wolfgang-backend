import pool from "../index";

const query = (q, params = []) => {
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        console.warn(err);
        reject(err);
      }

      client
        .query(q, params)
        .then(resolve)
        .catch(reject)
        .finally(() => release());
    });
  });
};

export { query };
