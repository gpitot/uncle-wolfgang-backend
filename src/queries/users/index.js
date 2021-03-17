import { query } from "../query";
import bcrypt from "bcrypt";
const saltRounds = 10;

const getUser = (id) => {
  const sql = "SELECT id, firstname, lastname, photo from USERS where id = $1";
  return new Promise((resolve, reject) => {
    query(sql, [id])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        return resolve(data.rows[0]);
      })
      .catch(() => {
        reject("An unknown error occurred");
      });
  });
};

const login = (req) => {
  const sql = `
  SELECT 
  *
   from users 
   where email = $1
  `;
  return new Promise((resolve, reject) => {
    query(sql, [req.email.toLowerCase()])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        const {
          id,
          email,
          password: hashedPassword,
          firstname,
          lastname,
          photo,
          role,
        } = data.rows[0];
        bcrypt.compare(req.password, hashedPassword, function (err, result) {
          // result == true
          if (result) {
            resolve({ id, email, firstname, lastname, photo, role });
          } else {
            reject("incorrect password");
          }
        });
      })
      .catch((err) => reject(err));
  });
};

const addUser = ({
  email,
  password,
  firstname,
  lastname,
  photo = "default.jpg",
}) => {
  const sql = `
  INSERT INTO USERS (email, password, firstname, lastname, photo)
  VALUES ($1, $2, $3, $4, $5)
  returning *;
  `;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return reject(err);
      }

      query(sql, [email.toLowerCase(), hash, firstname, lastname, photo])
        .then((data) => {
          const { id, email, firstname, lastname, photo, role } = data.rows[0];
          resolve({ id, email, firstname, lastname, photo, role });
        })
        .catch((qerr) => reject(qerr));
    });
  });
};

const updateUser = ({ user }) => {
  const sql = `

  UPDATE USERS
  set
  password = $1,
  firstname = $2,
  lastname = $3,
  photo = $4
  where id = $5
  `;
  const { id, password, firstname, lastname, photo } = user;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return reject(err);
      }

      query(sql, [hash, firstname, lastname, photo, id])
        .then(() => {
          resolve();
        })
        .catch((qerr) => reject(qerr));
    });
  });
};

export { getUser, addUser, updateUser, login };
