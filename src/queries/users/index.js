import { query } from "../query";

const getUser = ({ id }) => {
  const sql = `
  SELECT 
  *
   from users 
   where id = $1
  `;
  //const sql = `SELECT *, now() FROM events;`;
  return new Promise((resolve, reject) => {
    query(sql, [id])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        resolve(data.rows[0]);
      })
      .catch((err) => reject(err));
  });
};

export { getUser };
