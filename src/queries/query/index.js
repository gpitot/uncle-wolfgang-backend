import pool from '../index';

const query = (q) => {
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        console.log('error occurs here');
        console.log(err);
        reject(err);
      }

      client
        .query(q)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err))
        .finally(() => release());

      //   try {
      //     const data = await client.query(q);
      //     release();
      //     return resolve(data);
      //   } catch (err) {
      //     release();
      //     return reject("failed");
      //   }
    });
  });
};

export { query };
