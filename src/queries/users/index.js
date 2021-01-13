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

const addUser = ({ user }) => {
  const sql = `
  INSERT INTO USERS (id, email, firstname, lastname, photo)
  VALUES ($1, $2, $3, $4, $5);
  `;
  const {
    _json: { given_name, family_name, picture, email, sub },
  } = user;
  //const sql = `SELECT *, now() FROM events;`;
  return new Promise((resolve, reject) => {
    query(sql, [sub, email, given_name, family_name, picture])
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  });
};

const updateUser = ({ user }) => {
  const sql = `

  UPDATE USERS
  set
  email = $1,
  firstname = $2,
  lastname = $3,
  photo = $4
  where id = $5
  `;
  const {
    _json: { given_name, family_name, picture, email, sub },
  } = user;
  //const sql = `SELECT *, now() FROM events;`;
  return new Promise((resolve, reject) => {
    query(sql, [email, given_name, family_name, picture, sub])
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  });
};

export { addUser, updateUser, getUser };
